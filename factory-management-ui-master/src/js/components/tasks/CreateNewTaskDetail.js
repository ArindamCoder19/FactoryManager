import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { connect } from 'react-redux';
import Select from 'react-select';
import axios from 'axios';

import {
  TASK_PRIORITY,
  TASK_COMPLEXITY,
  TASK_WRICEF,
  TASK_STATUS
} from '../../util/constants';
import { API_URL } from '../../util/config';

import * as actions from '../../actions/taskActions';
import TaskDetailDropDowns from './detail/NewTaskDetailDropDowns';
import TaskInputField from './TaskInputField';

class TaskDetail extends Component {

  constructor(props) {
    super(props);

    let category = props.categories.map((item) => {
      return ({name: item.category, id: item._id});
    });

    let subCategory = props.subCategories.map((item) => {
      return ({name: item.subCategory, id: item._id});
    });

    let filteredProjects = [],
    projects = [];
    props.projects.forEach((item) => {
      projects.push({name: item.projectName , id: item._id, category: item.category[0], subCategory: item.subCategory[0] ? item.subCategory[0] : ""})
      if(category[0].id == item.category[0]._id && (item.subCategory[0] && item.subCategory[0]._id == subCategory[0].id))
        filteredProjects.push({name: item.projectName , id: item._id});
    });

    this.state = {
      category: category,
      sub: subCategory,
      project: filteredProjects,
      allProjects: projects,
      categorySelected: category[0] ? category[0] : {name: '', id: ''},
      subSelected: subCategory[0] ? subCategory[0] : {name: '', id: ''},
      projectSelected: {name: '', id: ''},
      taskDetail: {},
      snownumber: "",
      dueDate: "",
      plannedStartDate: "",
      plannedEndDate: "",
      actualStartDate: "",
      actualEndDate: "",
      estimatedHours: "",
      fsRecievedDate: "",
      devAssigned: {value: props.profile._id, label:props.profile.firstName+" "+props.profile.lastName},
      leadAssigned: "",
      reviewerAssigned: "",
      functionalConsultant: "",
      showATList: null,
      assignedToList: [],
      showLeadList: null,
      leadList: [],
      showReviewerList: null,
      reviewerList: [],
      showConsultantList: null,
      consultantList: [],
      closeError: false,
      prioritySelected: TASK_PRIORITY[0],
      statusSelected: TASK_STATUS[0],
      wricefSelected: TASK_WRICEF[0],
      complexSelected: TASK_COMPLEXITY[0],
      mandatoryFields: []
    }
  }

  _checkMandatoryFields() {
    let mandatoryFields = [],
      { plannedStartDate,
      plannedEndDate,
      actualStartDate,
      actualEndDate,
      estimatedHours } = this.state;

    if(_.intersection([plannedStartDate, plannedEndDate, actualStartDate, actualEndDate, estimatedHours], ["", null]).length > 0){
      let messageObj = {
        fsi: this.props.taskError.fsi,
        mandatory: "Please fill all Mandatory Fields and then update the status"
      }
      this.props.setTaskErrorMessage(messageObj);
      (plannedStartDate === "" || plannedStartDate === null) && mandatoryFields.push('psd');
      (plannedEndDate === "" || plannedEndDate === null) && mandatoryFields.push('ped');
      (actualStartDate === "" || actualStartDate === null) && mandatoryFields.push('asd');
      (actualEndDate === "" || actualEndDate === null) && mandatoryFields.push('aed');
      estimatedHours === "" && mandatoryFields.push('eh');

      this.setState({mandatoryFields: mandatoryFields});

      return true;
    }else {
      return false;
    }
  }

  _onDDChange(type, payloadType, data, event){



    if(payloadType == "status" &&
    _.intersection(['DELIVERED', 'TEST-ON-HOLD', 'FUT-IN-PROGRESS', 'TESTING-IN-PROGRESS'], [data.id]).length > 0){
      if(!this._checkMandatoryFields()){
        // let messageObj = {
        //   fsi: this.props.taskError.fsi,
        //   mandatory: ""
        // }
        // this.props.setTaskErrorMessage(messageObj);
        let messageObj = {
          fsi: this.props.taskError.fsi,
          mandatory: ""
        }
        this.props.setTaskErrorMessage(messageObj);
        let payload = {},
        statePayload = {};
        payload[payloadType] = data.id;
        statePayload[type] = data;
        statePayload["mandatoryFields"] = [];
        this._updateTask(payload);
        this.setState(statePayload);
      }
    }else {
      let messageObj = {
        fsi: this.props.taskError.fsi,
        mandatory: ""
      }
      this.props.setTaskErrorMessage(messageObj);
      let payload = {},
      statePayload = {};
      payload[payloadType] = data.id;
      statePayload[type] = data;
      statePayload["mandatoryFields"] = [];
      this._updateTask(payload);
      this.setState(statePayload);
    }
  }

  _updateTask(payload) {
    let data = {};
    for (let j in this.props.newtaskdata){
      data[j] = this.props.newtaskdata[j]
    }
    for (let i in payload){
      data[i] = payload[i];
    }
    this.props.newtaskDataChange(data);
  }

  _formPayload(payload) {
    let data = {};
    for (let j in this.props.newtaskdata){
      data[j] = this.props.newtaskdata[j]
    }

    for (let i in payload){
      if(payload[i] != ""){
        data[i] = payload[i]
      }else{
        data[i] ? delete data[i] : ""
      }
    }
    this.props.newtaskDataChange(data);
  }

  componentDidMount() {

    this._formPayload({
      priority: TASK_PRIORITY[0].id,
      complexity: TASK_COMPLEXITY[0].id,
      status: TASK_STATUS[0].id,
      wricefType: TASK_WRICEF[0].id,
      categoryId: this.state.category[0].id,
      subcategoryId: this.state.sub[0].id,
      developerId: this.state.devAssigned.value
    });
    this.props.setTaskErrorMessage({fsi: "", mandatory: ""});
  }

  _category() {
    return this.state.category.map( (item, index) => {
      return <MenuItem key={item.id} eventKey={item}>{item.name}</MenuItem>
    })
  }

  _subCategory() {
    return this.state.sub.map( (item, index) => {
      return <MenuItem key={item.id} eventKey={item}>{item.name}</MenuItem>
    })
  }

  _projects() {
    return this.state.project.map( (item, index) => {
      return <MenuItem key={item.id} eventKey={item}>{item.name}</MenuItem>
    })
  }

  onClose() {
    this.props.closeDetails();
  }

  _onCategorySelect(key) {
    this._formPayload({
      categoryId: key.id,
      project: ""
    });

    let project = [],
    subSelected = this.state.subSelected;

    this.state.allProjects.forEach((item) => {
      if(key.id == item.category._id && (item.subCategory != "" && item.subCategory._id == subSelected.id))
        project.push({name: item.name , id: item.id});
    });

    this.setState({
      categorySelected: key,
      project: project,
      projectSelected: {name: '', id: ''},
      devAssigned: null,
      leadAssigned: null
    });
  }

  _onSubCategorySelect(key) {
    this._formPayload({
      subcategoryId: key.id,
      projectId: ""
    });

    let project = [],
    categorySelected = this.state.categorySelected;

    this.state.allProjects.forEach((item) => {
      if(item.category._id == categorySelected.id && (item.subCategory != "" && item.subCategory._id == key.id)){
        project.push({name: item.name, id: item.id});
      }
    });

    this.setState({
      subSelected: key,
      project: project,
      projectSelected: {name: '', id: ''}
    })

  }

  _onProjectSelect(key) {
    this._formPayload({
      projectId: key.id
    });
    this.setState({projectSelected: key})
  }

  _onDeveloperChange (key) {
    this._formPayload({
      developerId: key.value
    });
    this.setState({
      devAssigned: key,
      showATList: false,
      assignedToList: []
    });
	}

  _onLeadChange (key) {
    this._formPayload({
      leadId: key.value
    });
		this.setState({
			leadAssigned: key,
      showLeadList: false,
      leadList: []
		});
	}

  _onReviewerChange (key) {
    this._formPayload({
      reviewerId: key.value
    });
		this.setState({
			reviewerAssigned: key,
      showReviewerList: false,
      reviewerList: []
		});
	}

  _onFCChange (key) {
    this._formPayload({
       functionalConsultant: key.value
    });
		this.setState({
			functionalConsultant: key,
      showConsultantList: false,
      consultantList: [],
		});
	}

  _onInputassignedToChange(e) {
    this.setState({showATList: true});
    let _this = this;
    axios.get(`${API_URL}/api/users?role=DEVELOPER,LEAD&status=active`)
      .then((response) => {
        let list = response.data.data.map((user) => {
          return {value: user._id, label: user.firstName+" "+user.lastName};
        })

        _this.setState({showATList: false, assignedToList: list})
      })
  }

  _onInputleadChange(e) {
    this.setState({showLeadList: true});
    let _this = this;
    axios.get(`${API_URL}/api/users?role=LEAD&status=active`)
      .then((response) => {
        let list = response.data.data.map((user) => {
          return {value: user._id, label: user.firstName+" "+user.lastName};
        })

        _this.setState({showLeadList: false, leadList: list})
      })
  }

  _onInputReviewerChange(e) {
    this.setState({showReviewerList: true});
    let _this = this;
    axios.get(`${API_URL}/api/users?role=MANAGER,LEAD,DEVELOPER,ADMIN&status=active`)
      .then((response) => {
        let list = response.data.data.map((user) => {
          return {value: user._id, label: user.firstName+" "+user.lastName};
        })

        _this.setState({showReviewerList: false, reviewerList: list})
      })
  }

  _onInputConsultantChange(e) {
    this.setState({showConsultantList: true});
    let _this = this;
      axios.get(`${API_URL}/api/search-fc`)
      .then((response) => {
        let list = response.data.data.map((user) => {
          return {value: user._id, label: user.functionalConsultant};
        })

        _this.setState({showConsultantList: false, consultantList: list})
      })
  }

  _onNewInputChange(type, e) {
    let payload = {};
    payload[type] = e.target.value;
    this._formPayload(payload);
  }

  _onSnowNumberChange(e) {
    this._formPayload({snowTaskNumber: e.target.value});
  }

  _handleDateChange(type, date) {
    let payload = {},
    statePayload = {},
    mandatoryFields = this.state.mandatoryFields;
    statePayload[type] = date;
    payload[type] = moment(date).format("YYYY-MM-DD");


    if(_.includes(['plannedStartDate', 'plannedEndDate', 'actualStartDate', 'actualEndDate'], type)){
      if(date != null && date != ""){
        type == "plannedStartDate" ? mandatoryFields = _.remove(mandatoryFields, function(field) { return field != "psd"; }) : "";
        type == "plannedEndDate" ? mandatoryFields = _.remove(mandatoryFields, function(field) { return field != "ped"; }) : "";
        type == "actualStartDate" ? mandatoryFields = _.remove(mandatoryFields, function(field) { return field != "asd"; }) : "";
        type == "actualEndDate" ? mandatoryFields = _.remove(mandatoryFields, function(field) { return field != "aed"; }) : "";
        this._formPayload(payload);
      }else if((date == null || date == "") &&  _.intersection(['DELIVERED','TEST-ON-HOLD', 'FUT-IN-PROGRESS', 'TESTING-IN-PROGRESS'], [this.state.statusSelected.id]).length > 0) {
        type == "plannedStartDate" ? mandatoryFields.push("psd") : "";
        type == "plannedEndDate" ? mandatoryFields.push("ped") : "";
        type == "actualStartDate" ? mandatoryFields.push("asd") : "";
        type == "actualEndDate" ? mandatoryFields.push("aed") : "";
      }else {
        this._formPayload(payload);
      }
    }else{
      this._formPayload(payload);
    }
    let messageObj = {
      fsi: this.props.taskError.fsi,
      mandatory: ""
    }

    if(mandatoryFields.length != 0){
      messageObj = {
        fsi: this.props.taskError.fsi,
        mandatory: "Please fill all Mandatory Fields and then update the status"
      }
    }

    this.props.setTaskErrorMessage(messageObj);
    statePayload["mandatoryFields"] = mandatoryFields;
    this.setState(statePayload);
  }

  _onFSIChange(e) {
    let reg = /^(?:5(?:\.0)?|[1-4](?:\.[0-9])?|)$/;
    if(reg.test(e.target.value)){
      this._formPayload({fsiScore: e.target.value});
      let messageObj = {
        fsi: "",
        mandatory: this.props.taskError.mandatory
      }
      this.props.setTaskErrorMessage(messageObj);
    }else{
      let messageObj = {
        fsi: "FSI Score should range between 1.0-5.0",
        mandatory: this.props.taskError.mandatory
      }
      this.props.setTaskErrorMessage(messageObj);
    }
  }

  _onHoursChange(e) {
    this._formPayload({estimatedHours: e.target.value});
    let mandatoryFields = this.state.mandatoryFields;
    if(e.target.value != "" && _.includes(this.state.mandatoryFields, "eh")){
       mandatoryFields = _.remove(this.state.mandatoryFields, function(field) { return field != "eh"; });
       let messageObj = {
         fsi: this.props.taskError.fsi,
         mandatory: ""
       }
       mandatoryFields.length == 0 ? this.props.setTaskErrorMessage(messageObj) : "";
       this.setState({estimatedHours: e.target.value, mandatoryFields: mandatoryFields});
    }else if(e.target.value == ""){
      if(_.intersection(['DELIVERED','TEST-ON-HOLD', 'FUT-IN-PROGRESS', 'TESTING-IN-PROGRESS'], [this.state.statusSelected.id]).length > 0){
        _.includes(mandatoryFields, "eh") ? "" : mandatoryFields.push("eh");
        let messageObj = {
          fsi: this.props.taskError.fsi,
          mandatory: "Please fill all Mandatory Fields and then update the status"
        }
        this.props.setTaskErrorMessage(messageObj)
        this.setState({estimatedHours: e.target.value, mandatoryFields: mandatoryFields});
      }else {
        this._updateTask({"estimatedHours": e.target.value});
        this.setState({estimatedHours: e.target.value, mandatoryFields: mandatoryFields});
      }
    }else {
      this._updateTask({"estimatedHours": e.target.value});
      this.setState({estimatedHours: e.target.value, mandatoryFields: mandatoryFields});
    }

  }

  _handleClickOutside() {
    this.setState({showATList: false, showConsultantList: false, showLeadList: false, showReviewerList: false})
  }

  render() {
    let {taskDetail,
      closeError,
      prioritySelected,
      statusSelected,
      wricefSelected,
      complexSelected} = this.state;
    let {taskError} = this.props;
    return (
      <Col className="task-detail" lg={6} sm={12} xs={12} md={12}>
        <TaskDetailDropDowns
          onDDChange={this._onDDChange.bind(this)}
          prioritySelected={prioritySelected}
          statusSelected={statusSelected}
          wricefSelected={wricefSelected}
          complexSelected={complexSelected}/>
        <Row>
          <div className={taskError && (taskError.fsi != "" || taskError.mandatory != "") ? "slideDown" : "modal-error"}
            style={(taskError.fsi != "" || taskError.mandatory != "") ? {"zIndex": "90"} : {}}>
            {taskError.fsi}
            {taskError.fsi != "" && <br/>}
            {taskError.mandatory}
          </div>
        </Row>
        <div className="nav-close-trigger" onClick={this.onClose.bind(this)}>
          <span></span>
        </div>
        <Row className="td-info">

          <h4 className="td-desc">
            <input type="text"
              placeholder="Task Description"
              ref={(desc) => {this.desc = desc}}
              onChange={this._onNewInputChange.bind(this, "taskDescription")}
              value={this.props.newtaskdata.taskDescription || ''}/>

          </h4>

          {this.state.subSelected.name.toLowerCase() == "projects" || this.state.subSelected.name.toLowerCase() == "bundled rfcs" ?
            <Row>
              <Col xs={4}>
                <label>Task - Category</label>

              </Col>
              <Col xs={4}>
                <label>Task - Sub Category</label>

              </Col>
              <Col xs={4}>
                <label>Project Name</label>

              </Col>
            </Row>

            :<Row>
              <Col xs={6}>
                <label>Task - Category</label>

              </Col>
              <Col xs={6}>
                <label>Task - Sub Category</label>

              </Col>
            </Row>
          }

          {this.state.subSelected.name.toLowerCase() == "projects" || this.state.subSelected.name.toLowerCase() == "bundled rfcs" ?
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
                  title={this.state.projectSelected.name ? this.state.projectSelected.name : ""}
                  id={`dropdown-basic-2`}
                  onSelect={this._onProjectSelect.bind(this)}>
                  {this._projects()}

                </DropdownButton>
              </div>
            </Row>

          :<Row className="td-categories left-border">
            <div style={{width: "50%", display: "inline-block"}}>
                <DropdownButton
                  title={this.state.categorySelected.name}
                  id={`dropdown-basic-1`}
                  onSelect={this._onCategorySelect.bind(this)}>
                  {this._category()}

                </DropdownButton>
            </div>
            <div style={{width: "50%", display: "inline-block"}}>
              <DropdownButton
                title={this.state.subSelected.name}
                id={`dropdown-basic-2`}
                onSelect={this._onSubCategorySelect.bind(this)}>
                {this._subCategory()}

              </DropdownButton>
            </div>

          </Row>}

          <Row style={{marginTop: "15px"}} className="left-border">
            <Col xs={6}>
              <label onClick={this._handleClickOutside.bind(this)}>Assigned To</label>
              <TaskInputField
                className="td-icon-user"
                key={this.state.devAssigned}
                value={this.state.devAssigned}
                onChange={this._onDeveloperChange.bind(this)}
                onFocus={this._onInputassignedToChange.bind(this)}
                isLoading={this.state.showATList}
                list={this.state.assignedToList}
                handleClickOutside={this._handleClickOutside.bind(this)}
              />

            </Col>
            <Col xs={6}>
              <label >Due Date</label>
                <DatePicker
                    fixedHeight
                    className="td-icon-calendar"
                    selected={this.state.dueDate}
                    dateFormat="DD MMM YYYY"
                    placeholderText="Unassigned"
                    onChange={this._handleDateChange.bind(this, "dueDate")}
                />
            </Col>


          </Row>

          <hr />

          <Row style={{marginTop: "15px"}} className="left-border">
            <Col xs={4}>
              <label onClick={this._handleClickOutside.bind(this)}>Lead</label>
                <TaskInputField
                  className="td-icon-user"
                  key={this.state.leadAssigned}
                  value={this.state.leadAssigned}
                  onChange={this._onLeadChange.bind(this)}
                  onFocus={this._onInputleadChange.bind(this)}
                  isLoading={this.state.showLeadList}
                  list={this.state.leadList}
                  handleClickOutside={this._handleClickOutside.bind(this)}
                />

            </Col>
            <Col xs={4}>
              <label onClick={this._handleClickOutside.bind(this)}>Reviewer</label>
                <TaskInputField
                  className="td-icon-user"
                  key={this.state.reviewerAssigned}
                  value={this.state.reviewerAssigned}
                  onChange={this._onReviewerChange.bind(this)}
                  onFocus={this._onInputReviewerChange.bind(this)}
                  isLoading={this.state.showReviewerList}
                  list={this.state.reviewerList}
                  handleClickOutside={this._handleClickOutside.bind(this)}
                />

            </Col>
            <Col xs={4}>
              <label onClick={this._handleClickOutside.bind(this)}>Functional Consultant</label>
                <TaskInputField
                  className="td-icon-user"
                  key={this.state.functionalConsultant}
                  value={this.state.functionalConsultant}
                  onChange={this._onFCChange.bind(this)}
                  onFocus={this._onInputConsultantChange.bind(this)}
                  isLoading={this.state.showConsultantList}
                  list={this.state.consultantList}
                  handleClickOutside={this._handleClickOutside.bind(this)}
                />

            </Col>

          </Row>

          <hr />

          <Row style={{marginTop: "15px"}} className="left-border">
            <Col xs={4}>
              <label>RFC Number</label>
                <input type="text"
                  className="td-icon-task"
                  placeholder="Unassigned"
                  ref={(rfc) => {this.rfcNumber = rfc}}
                  onChange={this._onNewInputChange.bind(this, "rfcNumber")}
                  value={this.props.newtaskdata.rfcNumber || ''}/>
            </Col>
            <Col xs={4}>
              <label>SNOW Task Number</label>
              <input type="text"
                className="td-icon-task"
                ref={(snow)=>{this.snow = snow}}
                placeholder="Unassigned"
                onChange={this._onSnowNumberChange.bind(this)}
                value={ this.props.newtaskdata.snowTaskNumber || ""}/>
            </Col>
            <Col xs={4}>
              <label>FSI Score</label>
                <input type="text"
                  className="td-icon-time"
                  ref={(fsi)=>{this.fsi = fsi}}
                  placeholder="Unassigned"
                  style={{width: "100%"}}
                  onBlur={this._onFSIChange.bind(this)}
                  defaultValue={ this.props.newtaskdata.fsiScore || ""}/>
            </Col>

          </Row>

          <hr />

          <Row style={{marginTop: "15px"}} className="left-border">
            <Col xs={4}>
              <label className={_.includes(this.state.mandatoryFields, 'psd') ? 'mandate' : ''} >Planned Start Date</label>
                <DatePicker
                    fixedHeight
                    className="td-icon-calendar"
                    selected={this.state.plannedStartDate}
                    placeholderText="Unassigned"
                    maxDate={this.state.plannedEndDate != "" || this.state.plannedEndDate != null ? moment(this.state.plannedEndDate) : null}
                    dateFormat="DD MMM YYYY"
                    ref={(psd)=>{this.psd = psd}}
                    onChange={this._handleDateChange.bind(this, "plannedStartDate")} />
            </Col>
            <Col xs={4}>
              <label className={_.includes(this.state.mandatoryFields, 'ped') ? 'mandate' : ''}>Planned End Date</label>
                <DatePicker
                    fixedHeight
                    className="td-icon-calendar"
                    selected={this.state.plannedEndDate}
                    placeholderText="Unassigned"
                    ref={(ped)=>{this.ped = ped}}
                    minDate={this.state.plannedStartDate != "" || this.state.plannedStartDate != null ? moment(this.state.plannedStartDate) : null}
                    dateFormat="DD MMM YYYY"
                    onChange={this._handleDateChange.bind(this, "plannedEndDate")}/>
            </Col>
            <Col xs={4}>
              <label className={_.includes(this.state.mandatoryFields, 'eh') ? 'mandate' : ''}>Estimated Hours</label>
              <input type="text"
                ref={(hrs)=>{this.hrs = hrs}}
                className="td-icon-time"
                onInput={() => {this.hrs.value=this.hrs.value.replace(/[^0-9]/g,'');}}
                placeholder="Unassigned"
                style={{width: "100%"}}
                onBlur={this._onHoursChange.bind(this)}
                defaultValue={ this.props.newtaskdata.estimatedHours || ""}/>
            </Col>

          </Row>

          <hr />

          <Row style={{marginTop: "15px"}} className="left-border">
            <Col xs={4}>
              <label className={_.includes(this.state.mandatoryFields, 'asd') ? 'mandate' : ''}>Actual Start Date</label>
                <DatePicker
                    fixedHeight
                    className="td-icon-calendar"
                    selected={this.state.actualStartDate}
                    placeholderText="Unassigned"
                    ref={(asd)=>{this.asd = asd}}
                    maxDate={this.state.actualEndDate != "" || this.state.actualEndDate != null ? moment(this.state.actualEndDate) : null}
                    dateFormat="DD MMM YYYY"
                    onChange={this._handleDateChange.bind(this, "actualStartDate")}/>
            </Col>
            <Col xs={4}>
              <label className={_.includes(this.state.mandatoryFields, 'aed') ? 'mandate' : ''}>Actual End Date</label>
                <DatePicker
                    fixedHeight
                    className="td-icon-calendar"
                    selected={this.state.actualEndDate}
                    placeholderText="Unassigned"
                    ref={(aed)=>{this.aed = aed}}
                    minDate={this.state.actualStartDate != "" || this.state.actualStartDate != null ? moment(this.state.actualStartDate) : null}
                    dateFormat="DD MMM YYYY"
                    onChange={this._handleDateChange.bind(this, "actualEndDate")}/>
            </Col>
            <Col xs={4}>
              <label>FS Received Date</label>
                <DatePicker
                    fixedHeight
                    className="td-icon-calendar"
                    selected={this.state.fsRecievedDate}
                    placeholderText="Unassigned"
                    dateFormat="DD MMM YYYY"
                    onChange={this._handleDateChange.bind(this, "fsRecievedDate")}/>
            </Col>

          </Row>
        <hr />
        </Row>
      </Col>
    )
  }
}

function mapStateToProps(state) {
  return { taskList: state.task.tasks,
  showtask: state.task.showtask,
  taskError: state.task.genericErrorMsg,
  filter: state.task.filter,
  categories: state.generic.categories,
  subCategories: state.generic.subCategories,
  projects: state.generic.projects,
  profile: state.user.profile,
  userID: state.auth.userID,
  newtask: state.task.newtask,
  newtaskdata: state.task.newtaskdata};
}

export default connect(mapStateToProps, actions)(TaskDetail);
