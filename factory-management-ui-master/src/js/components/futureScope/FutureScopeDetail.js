import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { connect } from 'react-redux';
import Select from 'react-select';
import axios from 'axios';
import _ from 'lodash';

import FSDetailDropDowns from './detail/FSDetailDropDowns';
import Dropdown from '../general/dropdown/Dropdown';
import * as actions from '../../actions/futureScopeActions';
import Loader from '../general/Loader';
import { API_URL } from '../../util/config';
import { TASK_PROJECT_SUB } from '../../util/constants';

class FutureScopeDetail extends Component {

  constructor(props) {
    super(props);
    let fsDetail = props.fsList ? _.filter(props.fsList, { '_id': props.showfs})[0] : null,
      category = [],
      subCategory = [],
      projectType = [],
      categorySelected = {name: '', id: ''},
      subSelected = {name: '', id: ''},
      projectTypeSelected = {name: '', id: ''},
      managedBySelected = {name: '', id: ''},
      statusSelected = {name: '', id: ''};

    props.categories.forEach((item) => {
      if(fsDetail.categoryId && item._id == fsDetail.categoryId){
        categorySelected = {name: item.category, id: item._id}
      }
      category.push({name: item.category, id: item._id});
    });

    props.subCategories.forEach((item) => {
      if(fsDetail.subCategoryId && item._id == fsDetail.subCategoryId){
        subSelected = {name: item.subCategory, id: item._id}
      }
      subCategory.push({name: item.subCategory, id: item._id});
    });

    props.projectType.forEach((item) => {
      if(fsDetail.projectType && item._id == fsDetail.projectTypeId){
        projectTypeSelected = {name: item.projectType, id: item._id}
      }
      projectType.push({name: item.projectType, id: item._id});
    });

    let managedBy = props.managedBy.map((item) => {
      if(fsDetail.managedBy && item._id == fsDetail.managedById){
        managedBySelected = {name: item.managedBy, id: item._id}
      }
      return {name: item.managedBy, id: item._id}
    })

    let status = props.status.map((item) => {
      if(fsDetail.status && item._id == fsDetail.statusId){
        statusSelected = {name: item.status, id: item._id}
      }
      return {name: item.status, id: item._id}
    })

    this.state = {
      category: category,
      categorySelected: categorySelected,
      subCategory: subCategory,
      subSelected: subSelected,
      projectType: projectType,
      projectTypeSelected: projectTypeSelected,
      fsDetail: fsDetail,
      managedBy: managedBy,
      managedBySelected: managedBySelected,
      status: status,
      statusSelected: statusSelected,
      projectManager: fsDetail.projectManager ? fsDetail.projectManager : "",
      fteExpected: fsDetail.fteExpected ? fsDetail.fteExpected : "",
      estimatedHours: fsDetail.estimatedHours ? fsDetail.estimatedHours : "",
      consumedHours: fsDetail.consumedHours ? fsDetail.consumedHours : "",
      startDate: fsDetail.startDate ? moment(fsDetail.startDate) : "",
      endDate: fsDetail.endDate ? moment(fsDetail.endDate) : "",
      closeError: false,
      mandatoryFields: [], // Start Date (sd), End Date (ed), FTE (fte)
      isCommentsLoading: true
    }
  }

  componentWillMount() {
    this.props.setFSErrorMessage({eh: "", fte: "", mandatory: ""});
  }

  componentDidMount() {
    if(!_.includes(this.props.userRole, 'GUEST')){
      let showCommentsLoader = true;
      this.props.getComments(this.state.fsDetail._id, showCommentsLoader);
    }
  }

  _category() {
    return this.state.category.map( (item, index) => {
      return <MenuItem key={item.id} eventKey={item}>{item.name}</MenuItem>
    })
  }

  _subCategory() {
    return this.state.subCategory.map( (item, index) => {
      return <MenuItem key={item.id} eventKey={item}>{item.name}</MenuItem>
    })
  }

  _projectType() {
    return this.state.projectType.map( (item, index) => {
      return <MenuItem key={item.id} eventKey={item}>{item.name}</MenuItem>
    })
  }

  onClose() {
    this.props.closeDetails();
  }

  _onCategorySelect(key) {
    let payload = {
      categoryId: key.id
    };

    this._updateFs(payload);
    this.setState({categorySelected: key});
  }

  _onSubCategorySelect(key) {
    let payload = {
      subCategoryId: key.id
    };

    this._updateFs(payload);
    this.setState({subSelected: key});
  }

  _onProjectSelect(key) {
    let payload = {
      projectTypeId: key.id
    };

    this._updateFs(payload);
    this.setState({projectTypeSelected: key});
  }

  _handleDateChange(type, date) {
    let payload = {},
    statePayload = {};

    //FS_MANDATORY: remove(Start)
    // payload[type] = (date != null && date != "") ? moment(date).format("YYYY-MM-DD") : "";
    // statePayload[type] = date;
    // this._updateFs(payload);
    // this.setState(statePayload);
    //FS_MANDATORY: remove(end)

    //FS_MANDATORY: uncomment(Start)
    let mandatoryFields = this.state.mandatoryFields,
    messageObj = {
      eh: this.props.error.eh,
      fte: this.props.error.fte,
      mandatory: this.props.error.mandatory
    };

    if(date != null && date != ""){
      payload[type] = moment(date).format("YYYY-MM-DD");

      type == "startDate" ? mandatoryFields = _.remove(mandatoryFields, function(field) { return field != "sd"; }) : "";

      type == "endDate" ? mandatoryFields = _.remove(mandatoryFields, function(field) { return field != "ed"; }) : "";

      statePayload["mandatoryFields"] = mandatoryFields;
      statePayload[type] = date;
      this._updateFs(payload);
    }else {
      (type == "startDate" && mandatoryFields.indexOf("sd") < 0) ? mandatoryFields.push("sd") : "";

      (type == "endDate" && mandatoryFields.indexOf("ed") < 0) ? mandatoryFields.push("ed") : "";

      statePayload["mandatoryFields"] = mandatoryFields;
      messageObj["mandatory"] =  "Please fill all Mandatory Fields";
    }
    if(mandatoryFields.length == 0){
      messageObj["mandatory"] = "";
    }
    this.props.setFSErrorMessage(messageObj);
    this.setState(statePayload);
    //FS_MANDATORY: uncomment(end)
  }

  _updateFs(payload) {
    let args = {
      filter: this.props.filter,
      fsID: this.state.fsDetail._id,
      payload: payload,
      flag: true  //show data fetching
    };

    this.props.fsUpdate(args);
  }

  _autoSave(type, e) {
    let payload = {};
    payload[type] = e.target.value.trim();
    this._updateFs(payload);
  }

  _autoSaveNumber(type, fieldName, e) {
    let reg = /^\d+(\.\d{1,2})?$/;
    let mandatoryFields = this.state.mandatoryFields;
    let messageObj = {
      fte: this.props.error.fte,
      eh: this.props.error.eh,
      mandatory: "" //FS_MANDATORY: assign ->this.props.error.mandatory
    },
    value = e.target.value.trim();

    if(reg.test(value)){
      let payload = {};
      payload[type] = value;

      //FS_MANDATORY: uncomment(Start)
      type == "fteExpected" ? mandatoryFields = _.remove(mandatoryFields, function(field) { return field != "fte"; }) : "";

      if(mandatoryFields.length > 0){
        messageObj = {
          fte: type == "fteExpected" ? "" : this.props.error.fte,
          eh: type == "estimatedHours" ? "" : this.props.error.eh,
          mandatory: this.props.error.mandatory
        }
      }else {
        messageObj = {
          fte: type == "fteExpected" ? "" : this.props.error.fte,
          eh: type == "estimatedHours" ? "" : this.props.error.eh,
          mandatory: ""
        }
      }
      //FS_MANDATORY: uncomment(end)

      this._updateFs(payload);
    }else {
      if(value != ""){
        messageObj = {
          fte: type == "fteExpected" ? fieldName+" should be a Decimal Number" : this.props.error.fte,
          eh: type == "estimatedHours" ? fieldName+" should be a Decimal Number" : this.props.error.eh,
          mandatory: "" //FS_MANDATORY: assign -> this.props.error.mandatory
        };
      }else {
        //FS_MANDATORY: uncomment(Start)
        (type == "fteExpected"  && mandatoryFields.indexOf("fte") < 0) ? mandatoryFields.push("fte") : "";

        messageObj["mandatory"] = "Please fill all Mandatory Fields";
        //FS_MANDATORY: uncomment(end)
      }
    }



    //FS_MANDATORY: uncomment(Start)
    this.setState({mandatoryFields: mandatoryFields});
    this.props.setFSErrorMessage(messageObj);
    //FS_MANDATORY: uncomment(end)
  }

  _handleClickOutside() {
    this.setState({showATList: false, showConsultantList: false, showLeadList: false, showReviewerList: false})
  }

  _onManagedBySelect(item) {
    let params = {
      filter: this.props.filter,
      fsID: this.state.fsDetail._id,
      payload: {managedById: item.id}
    };
    this.props.fsUpdate(params);
    this.setState({managedBySelected: item})
  }

  _onStatusSelect(item) {
    let params = {
      filter: this.props.filter,
      fsID: this.state.fsDetail._id,
      payload: {statusId: item.id}
    };
    this.props.fsUpdate(params);
    this.setState({statusSelected: item})
  }

  _submitComment(e) {
    if(this.textarea.value != ""){
      let payload = {comment: this.textarea.value, futureScopeId: this.state.fsDetail._id};
      this.props.submitAComment(payload, this.state.filter);
      this.textarea.value = ""
    }
  }

  _getOldComments() {
    let _this = this
    return this.props.commentdetails.map((item, index) => {
      if(item.futureScopeId == _this.state.fsDetail._id && item.comment != ""){
        return (
          <div key={index}>
            <span>{item.createdBy[0].firstName+" "+item.createdBy[0].lastName}</span>
            <div>{item.comment}</div>
            <span style={{fontSize: "8px", fontWeight: "100"}}> {moment(item.created_at).format("MMM Do YYYY, hh:mm")}</span>
          </div>
        )
      }
    })
  }

  render() {
    let {fsDetail, closeError, subSelected} = this.state;
    let {userID, userRole, error} = this.props;
    return (
      <Col className="task-detail" lg={6} sm={6} xs={12} md={6}>
        <Row className="dropdown-container">
          <div className="navy-dropdown">
            {_.intersection(userRole, ['GUEST', 'DEVELOPER']).length > 0 ?
              <button id="dropdown-basic-1"
                role="button"
                type="button"
                className="dropdown-toggle btn btn-default btn-noedit">
                  {"MANAGED BY: "+this.state.managedBySelected.name}
              </button>
              :
              <Dropdown
                data={this.state.managedBy}
                selected={this.state.managedBySelected.name}
                title="MANAGED BY: "
                select={this._onManagedBySelect.bind(this)}
                />
            }
          </div>

          <div className="yellow-dropdown">
            {_.intersection(userRole, ['GUEST', 'DEVELOPER']).length > 0 ?
              <button id="dropdown-basic-1"
                role="button"
                type="button"
                className="dropdown-toggle btn btn-default btn-noedit">
                  {"USER STATUS: "+this.state.statusSelected.name}
              </button>
              :
              <Dropdown
                data={this.state.status}
                selected={this.state.statusSelected.name}
                title="STATUS: "
                select={this._onStatusSelect.bind(this)}
                />
            }
          </div>
        </Row>
        <div className="nav-close-trigger" onClick={this.onClose.bind(this)}>
          <span></span>
        </div>
        <Row>
          <div className={error && (error.eh != "" || error.fte != "" || error.mandatory != "") ? "slideDown" : "modal-error"}
            style={error && (error.eh != "" || error.fte != "" || error.mandatory != "") ? {"zIndex": "1500"} : {}}>
            {error.fte}
            {error.fte != "" && <br/>}
            {error.eh}
            {error.eh != "" && <br/>}
            {error.mandatory}
        </div>
        </Row>
        <Row className="td-info">
          {_.intersection(userRole, ['ADMIN', 'MANAGER', 'LEAD']).length > 0 ?
            <div className="td-desc">
                <input
                  type="text"
                  className="input-project"
                  disabled={fsDetail.projectName.length > 0}
                  defaultValue={fsDetail.projectName}/>
                {this.props.isdataloading && <Loader />}
            </div>
              :
            <div className="td-desc">{fsDetail.projectName}</div>
          }

          <Row>
              <Col xs={4}>
                <label>Project - Category</label>

              </Col>
              <Col xs={4}>
                <label>Project - Sub Category</label>

              </Col>
              <Col xs={4}>
                <label>Project - Type</label>

              </Col>
          </Row>


          <Row className="td-categories left-border">
            <div style={{width: "33.3%", display: "inline-block"}}>
              {_.intersection(userRole, ['ADMIN', 'MANAGER', 'LEAD']).length > 0?
              <DropdownButton
                title={this.state.categorySelected.name}
                id={`dropdown-basic-1`}
                onSelect={this._onCategorySelect.bind(this)}>
                {this._category()}

              </DropdownButton>
              : <div style={{paddingLeft: "15px"}}>{this.state.categorySelected.name}</div>
           }
         </div>
            <div style={{width: "33.3%", display: "inline-block"}}>
              {_.intersection(userRole, ['ADMIN', 'MANAGER', 'LEAD']).length > 0?
              <DropdownButton
                title={this.state.subSelected.name}
                id={`dropdown-basic-2`}
                onSelect={this._onSubCategorySelect.bind(this)}>
                {this._subCategory()}

              </DropdownButton>
              : <div style={{paddingLeft: "15px"}}>{this.state.subSelected.name}</div>
           }
         </div>
            <div style={{width: "33.3%", display: "inline-block"}}>
              {_.intersection(userRole, ['ADMIN', 'MANAGER', 'LEAD']).length > 0?
              <DropdownButton
                title={this.state.projectTypeSelected.name}
                id={`dropdown-basic-2`}
                onSelect={this._onProjectSelect.bind(this)}>
                {this._projectType()}

              </DropdownButton>
              : <div style={{paddingLeft: "15px"}}>{this.state.projectTypeSelected.name}</div>
           }
         </div>
          </Row>

          {_.intersection(userRole, ['GUEST', 'DEVELOPER']).length > 0 && <hr />}
            <Row style={{marginTop: "15px"}} className="left-border">
              <Col xs={12}>
                <label>Project Manager</label>
                {_.intersection(userRole, ['ADMIN', 'MANAGER', 'LEAD']).length > 0 ?
                 <input
                   className="input-rfc icon-user"
                   type="text"
                   placeholder="Unassigned"
                   defaultValue={fsDetail.projectManager}
                   onBlur={this._autoSave.bind(this, "projectManager")}/>:
                  <div className="icon-user">{fsDetail.projectManager || "Unassigned"}</div>
                }
              </Col>
            </Row>

            <hr />

          <Row style={{marginTop: "15px"}} className="left-border">
            <Col xs={4}>
              <label className={_.includes(this.state.mandatoryFields, 'sd') ? 'mandate' : ''}>Start Date</label>
              {_.intersection(userRole, ['ADMIN', 'MANAGER', 'LEAD']).length > 0 ?
                <DatePicker
                    selected={this.state.startDate}
                    placeholderText="Unassigned"
                    className="td-icon-calendar calendar-editable"
                    maxDate={this.state.endDate != "" || this.state.endDate != null ? moment(this.state.endDate) : null}
                    dateFormat="DD MMM YYYY"
                    onChange={this._handleDateChange.bind(this, "startDate")} />
                  : <div className="td-icon-calendar">{fsDetail.startDate ? moment(fsDetail.startDate).format("DD MMM YYYY") : "Unassigned"}</div>
              }
            </Col>
            <Col xs={4}>
              <label className={_.includes(this.state.mandatoryFields, 'ed') ? 'mandate' : ''}>End Date</label>
              {_.intersection(userRole, ['ADMIN', 'MANAGER', 'LEAD']).length > 0 ?
                <DatePicker
                    selected={this.state.endDate}
                    placeholderText="Unassigned"
                    className="td-icon-calendar calendar-editable"
                    minDate={this.state.startDate != "" || this.state.startDate != null ? moment(this.state.startDate) : null}
                    dateFormat="DD MMM YYYY"
                    onChange={this._handleDateChange.bind(this, "endDate")}/>
                  : <div className="td-icon-calendar">{fsDetail.endDate ? moment(fsDetail.endDate).format("DD MMM YYYY") : "Unassigned"}</div>
              }
            </Col>
            <Col xs={4}>
              <label className={_.includes(this.state.mandatoryFields, 'fte') ? 'mandate' : ''}>FTE Expected</label>
              {_.intersection(userRole, ['ADMIN', 'MANAGER', 'LEAD']).length > 0 ?
                <input type="text"
                  ref={(fte)=>{this.fte = fte}}
                  className="td-icon-time"
                  defaultValue={ fsDetail.fteExpected || ""}
                  style={{width: "100%"}}
                  onBlur={this._autoSaveNumber.bind(this, "fteExpected", "FTE Expected")}/>
                : <div className="td-icon-time">{fsDetail.fteExpected ? fsDetail.fteExpected : "Unassigned"}</div>
              }
            </Col>

          </Row>

          <hr />

          <Row style={{marginTop: "15px"}} className="left-border">
            <Col xs={6}>
              <label>Estimated Hours</label>
              {_.intersection(userRole, ['ADMIN', 'MANAGER', 'LEAD']).length > 0 ?
                <input type="text"
                  key={fsDetail.estimatedHours}
                  ref={(hrs)=>{this.hrs = hrs}}
                  className="td-icon-time"
                  defaultValue={ fsDetail.estimatedHours || ""}
                  style={{width: "100%"}}
                  placeholder="Unassigned"
                  onBlur={this._autoSaveNumber.bind(this, "estimatedHours", "Estimated Hours")}/>
                : <div className="td-icon-time">{fsDetail.estimatedHours ? fsDetail.estimatedHours : "Unassigned"}</div>
              }
            </Col>
            <Col xs={6}>
              <label>Consumed Hours</label>
                <div className="td-icon-time">{fsDetail.consumedHours ? fsDetail.consumedHours : 0}</div>
            </Col>
          </Row>

          {_.intersection(userRole, ['ADMIN', 'MANAGER', 'LEAD']).length > 0 && <Row style={{marginTop: "15px"}}>
            <Col xs={12}>
              <label>Comments</label>

            </Col>
            <Col xs={12} className="old-comments">
              {this.props.isCommentsLoading ? <span style={{fontSize: "10px"}}>Loading...</span> : this._getOldComments()}
            </Col>

            <Col xs={12} className="comment-section">
              <textarea placeholder="Write a comment"
                ref={(textarea) => {this.textarea = textarea}}/>
              <button onClick={this._submitComment.bind(this)}>Submit</button>
            </Col>


          </Row>}

        </Row>
      </Col>
    )
  }
}

function mapStateToProps(state) {
  return { fsList: state.futureScope.fsList,
  showfs: state.futureScope.showfs,
  error: state.futureScope.genericErrorMsg,
  filter: state.futureScope.filter,
  categories: state.generic.categories,
  subCategories: state.generic.subCategories,
  projectType: state.generic.projectType,
  status: state.generic.fsStatus,
  managedBy: state.generic.managedBy,
  isdataloading: state.futureScope.showdataloading,
  commentdetails: state.futureScope.commentdetails,
  isCommentsLoading: state.futureScope.isCommentsLoading,
  userID: state.auth.userID,
  userRole: state.auth.userRole};
}

export default connect(mapStateToProps, actions)(FutureScopeDetail);
