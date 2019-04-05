import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { connect } from 'react-redux';
import _ from 'lodash';

import FSDetailDropDowns from './detail/NewFSDetailDropDowns';
import Dropdown from '../general/dropdown/Dropdown';
import {
  newFSDataChange,
  setFSErrorMessage
} from '../../actions/futureScopeActions';

const FS_FILTER_DDMENU = [
  {name: "IBM", id: "ibm"},
  {name: "Heineken", id: "heineken"},
  {name: "Third Party", id: "third-party"}
]

const FS_PTYPE_DDMENU = [
  {name: "GIS", id: "gis", default: false},
  {name: "Opco", id: "opco", default: false},
  {name: "COE", id: "coe", default: false},
  {name: "AMS", id: "ams", default: false}
]

const FS_STATUS_DDMENU = [
  {name: "Proposed", id: "proposed"},
  {name: "Signed", id: "signed"},
  {name: "In progress", id: "in-progress"},
  {name: "Completed", id: "completed"},
  {name: "Cancelled", id: "cancelled"}
]
class CreateNewFSDetail extends Component {

  constructor(props) {
    super(props);

    let category = props.categories.map((item) => {
      return ({name: item.category, id: item._id});
    });

    let subCategory = props.subCategories.map((item) => {
      return ({name: item.subCategory, id: item._id});
    });

    let status = props.status.map((item) => {
      return {name: item.status, id: item._id}
    })

    let managedBy = props.managedBy.map((item) => {
      return {name: item.managedBy, id: item._id}
    })

    let projectType = props.projectType.map((item) => {
      return {name: item.projectType, id: item._id}
    })

    this.state = {
      category: category,
      categorySelected: category[0] ? category[0] : {name: '', id: ''},
      subCategory: subCategory,
      subSelected: subCategory[0] ? subCategory[0] : {name: '', id: ''},
      projectType: projectType,
      projectTypeSelected: projectType[0],
      managedBy: managedBy,
      managedBySelected: managedBy[0],
      status: status,
      statusSelected: status[0],
      fsDetail: {},
      projectName: "",
      projectManager: "",
      dueDate: "",
      startDate: "",
      endDate: "",
      fte: 0,
      estimatedHours: 0,
      consumedHours: 0,
      closeError: false,
      mandatoryFields: ["sd", "ed", "fte"] // FS_MANDATORY: use->["sd", "ed", "fte"]
    }
  }

  _formPayload(payload) {
    let data = {};
    for (let j in this.props.newfsdata){
      data[j] = this.props.newfsdata[j]
    }

    for (let i in payload){
      if(payload[i] != ""){
        data[i] = payload[i]
      }else{
        data[i] ? delete data[i] : ""
      }
    }
    this.props.newFSDataChange(data);
    // this.props.setTaskErrorMessage(this.props.taskError);
  }

  componentWillMount() {
    if(this.state.mandatoryFields.length > 0){
      let messageObj = {
        eh: "",
        fte: "",
        mandatory: "Please fill all Mandatory Fields", //FS_MANDATORY: assign -> "Please fill all Mandatory Fields"
        showMandatory: false
      };
      this.props.setFSErrorMessage(messageObj);
    }
  }

  componentDidMount() {

    this._formPayload({
      managedById: this.state.managedBySelected.id,
      statusId: this.state.statusSelected.id,
      categoryId: this.state.category[0].id,
      subCategoryId: this.state.subCategory[0].id,
      projectTypeId: this.state.projectTypeSelected.id
    });

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
    this._formPayload({
      categoryId: key.id
    });
    this.setState({categorySelected: key});
  }

  _onSubCategorySelect(key) {
    this._formPayload({
      subCategoryId: key.id
    });
    this.setState({subSelected: key});
  }

  _onProjectTypeSelect(key) {
    this._formPayload({
      projectTypeId: key.id
    });
    this.setState({projectTypeSelected: key});

  }

  _handleDateChange(type, date) {
    let payload = {},
    statePayload = {};

    //FS_MANDATORY: remove(Start)
    // payload[type] = (date != null && date != "") ? moment(date).format("YYYY-MM-DD") : "";
    // statePayload[type] = date;
    // this._formPayload(payload);
    // this.setState(statePayload);
    //FS_MANDATORY: remove(end)

    //FS_MANDATORY: uncomment(Start)
    let mandatoryFields = this.state.mandatoryFields,
    messageObj = {
      eh: this.props.error.eh,
      fte: this.props.error.fte,
      mandatory: this.props.error.mandatory,
      showMandatory: this.props.error.showMandatory
    };


    if(date != null && date != ""){

      payload[type] = moment(date).format("YYYY-MM-DD");

      type == "startDate" ? mandatoryFields = _.remove(mandatoryFields, function(field) { return field != "sd"; }) : "";

      type == "endDate" ? mandatoryFields = _.remove(mandatoryFields, function(field) { return field != "ed"; }) : "";

      statePayload["mandatoryFields"] = mandatoryFields;
      statePayload[type] = date;
      this._formPayload(payload);
    }else {
      (type == "startDate" && mandatoryFields.indexOf("sd") < 0) ? mandatoryFields.push("sd") : "";

      (type == "endDate" && mandatoryFields.indexOf("ed") < 0) ? mandatoryFields.push("ed") : "";

      statePayload["mandatoryFields"] = mandatoryFields; //FS_MANDATORY: assign -> mandatoryFields;
      messageObj["mandatory"] =  "Please fill all Mandatory Fields";
    }
    if(mandatoryFields.length == 0){
      messageObj["mandatory"] = "";
      messageObj["showMandatory"] = false;
    }

    this.props.setFSErrorMessage(messageObj);
    this.setState(statePayload);
    //FS_MANDATORY: uncomment(Start)
  }

  _onFTEChange(e) {
    let reg = /^\d+(\.\d{1,2})?$/;
    let mandatoryFields = this.state.mandatoryFields;
    let messageObj = {
      fte: this.props.error.fte,
      eh: this.props.error.eh,
      mandatory: this.props.error.mandatory,//"" //FS_MANDATORY: assign ->this.props.error.mandatory
      showMandatory: this.props.error.showMandatory
    },
    value = e.target.value.trim();

    if(reg.test(value)){
      mandatoryFields = _.remove(mandatoryFields, function(field) { return field != "fte"; });
      messageObj["fte"] = "";
      this._formPayload({fteExpected: value});
    }else{
      if(value != ""){
        messageObj["fte"] = "FTE Expected should be a Decimal Number";
      }else {
        //FS_MANDATORY: uncomment(Start)
        mandatoryFields.indexOf("fte") < 0 ? mandatoryFields.push("fte") : ""
        //FS_MANDATORY: uncomment(end)
      }
    }

    //FS_MANDATORY: uncomment(Start)
    if(mandatoryFields.length == 0){
      messageObj["mandatory"] = "";
      messageObj["showMandatory"] = false;
    }
    //FS_MANDATORY: uncomment(end)


    //FS_MANDATORY: uncomment(Start)
    this.props.setFSErrorMessage(messageObj);
    this.setState({mandatoryFields: mandatoryFields});
    //FS_MANDATORY: uncomment(end)
  }

  _onHoursChange(e) {
    this._formPayload({estimatedHours: e.target.value});
  }

  _handleClickOutside() {
    this.setState({showATList: false, showConsultantList: false, showLeadList: false, showReviewerList: false})
  }

  _onManagedBySelect(key) {
    this._formPayload({
      managedById: key.id
    });
    this.setState({managedBySelected: key});
  }

  _onStatusSelect(key) {
    this._formPayload({
      statusId: key.id
    });
    this.setState({statusSelected: key});
  }

  _onProjectManagerChange(e) {
    this._formPayload({projectManager: e.target.value});
  }

  _onNewInputChange(type, e) {
    this._formPayload({projectName: e.target.value});
  }

  _getStatuses() {

  }

  render() {
    let {fsDetail, closeError} = this.state;
    let {error, userRole} = this.props;

    return (
      <Col className="task-detail" lg={6} sm={12} xs={12} md={12}>
        <Row className="dropdown-container">
          <div className="navy-dropdown">
            <Dropdown
              data={this.state.managedBy}
              selected={this.state.managedBySelected.name}
              title="MANAGED BY: "
              select={this._onManagedBySelect.bind(this)}
              />
          </div>
          <div className="yellow-dropdown">
            <Dropdown
              data={this.state.status}
              selected={this.state.statusSelected.name}
              title="STATUS: "
              select={this._onStatusSelect.bind(this)}
              />
          </div>
        </Row>

        <div className="nav-close-trigger" onClick={this.onClose.bind(this)}>
          <span></span>
        </div>
        <Row>
          <div className={error && (error.eh != "" || error.fte != "") ? "slideDown" : "modal-error"}
            style={error && (error.eh != "" || error.fte != "") ? {"zIndex": "90"} : {}}>
            {error.fte}
            {error.fte != "" && <br/>}
            {error.eh}
          </div>
          <div className={error && (error.showMandatory && error.mandatory != "") ? "slideDown" : "modal-error"}
            style={error && (error.mandatory != "") ? {"zIndex": "90"} : {}}>
            {error.mandatory}
          </div>
        </Row>
        <Row className="td-info">
          <h4 className="td-desc">
            <input type="text"
              placeholder="Project Name"
              ref={(pn) => {this.pn = pn}}
              value={this.props.newfsdata.projectName || ''}
              onChange={this._onNewInputChange.bind(this, "projectName")} />

          </h4>

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
                <DropdownButton
                  title={this.state.categorySelected.name}
                  id={`dropdown-basic-1`}
                  onSelect={this._onCategorySelect.bind(this)}>
                  {this._category()}

                </DropdownButton>
              </div>
              <div style={{width: "33.3%", display: "inline-block"}}>
                <DropdownButton
                  title={this.state.subSelected.name}
                  id={`dropdown-basic-2`}
                  onSelect={this._onSubCategorySelect.bind(this)}>
                  {this._subCategory()}

                </DropdownButton>
              </div>
              <div style={{width: "33.3%", display: "inline-block"}}>
                <DropdownButton
                  title={this.state.projectTypeSelected.name}
                  id={`dropdown-basic-2`}
                  onSelect={this._onProjectTypeSelect.bind(this)}>
                  {this._projectType()}

                </DropdownButton>
              </div>

          </Row>

          <Row style={{marginTop: "15px"}} className="left-border">
            <Col xs={12}>
              <label>Project Manager</label>
              <input type="text"
                placeholder="Unassigned"
               ref={(pm)=>{this.pm = pm}}
               onChange={this._onProjectManagerChange.bind(this)} />
           </Col>
          </Row>

          <hr />

          <Row style={{marginTop: "15px"}} className="left-border">
            <Col xs={4}>
              <label className={error.showMandatory && _.includes(this.state.mandatoryFields, 'sd') ? 'mandate' : ''}>Start Date</label>
              <DatePicker
                  selected={this.state.startDate}
                  placeholderText="Unassigned"
                  maxDate={this.state.endDate != "" || this.state.endDate != null ? moment(this.state.endDate) : null}
                  dateFormat="DD MMM YYYY"
                  onChange={this._handleDateChange.bind(this, "startDate")} />
            </Col>
            <Col xs={4}>
              <label className={error.showMandatory && _.includes(this.state.mandatoryFields, 'ed') ? 'mandate' : ''}>End Date</label>
              <DatePicker
                  selected={this.state.endDate}
                  placeholderText="Unassigned"
                  minDate={this.state.startDate != "" || this.state.startDate != null ? moment(this.state.startDate) : null}
                  dateFormat="DD MMM YYYY"
                  onChange={this._handleDateChange.bind(this, "endDate")}/>
            </Col>
            <Col xs={4}>
              <label className={error.showMandatory && _.includes(this.state.mandatoryFields, 'fte') ? 'mandate' : ''}>FTE Expected</label>
              <input type="text"
                ref={(fte)=>{this.fte = fte}}
                placeholder="Unassigned"
                style={{width: "100%"}}
                onBlur={this._onFTEChange.bind(this)} />
            </Col>
          </Row>

          <hr />

          <Row style={{marginTop: "15px"}} className="left-border">
            <Col xs={6}>
              <label>Estimated Hours</label>
              <input type="text"
                ref={(hrs)=>{this.hrs = hrs}}
                onInput={() => {this.hrs.value=this.hrs.value.replace(/[^0-9]/g,'');}}
                placeholder="Unassigned"
                style={{width: "100%"}}
                onChange={this._onHoursChange.bind(this)} />
            </Col>
            <Col xs={6}>
              <label>Consumed Hours</label>
              <div></div>
            </Col>
          </Row>
          <hr />
        </Row>
      </Col>
    )
  }
}

function mapStateToProps(state) {
  return {
  categories: state.generic.categories,
  subCategories: state.generic.subCategories,
  userID: state.auth.userID,
  newfsdata: state.futureScope.newfsdata,
  status: state.generic.fsStatus,
  managedBy: state.generic.managedBy,
  error: state.futureScope.genericErrorMsg,
  projectType: state.generic.projectType};
}

export default connect(mapStateToProps, {newFSDataChange, setFSErrorMessage})(CreateNewFSDetail);
