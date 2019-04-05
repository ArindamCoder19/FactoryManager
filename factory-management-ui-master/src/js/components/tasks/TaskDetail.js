import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { connect } from 'react-redux';
import axios from 'axios';

import TaskDetailDropDowns from './detail/TaskDetailDropDowns';
import * as actions from '../../actions/taskActions';
import { API_URL } from '../../util/config';
import TaskInputField from './TaskInputField';
import Loader from '../general/Loader';
import {
  TASK_PROJECT_SUB,
  TASK_PRIORITY,
  TASK_COMPLEXITY,
  TASK_WRICEF,
  TASK_STATUS } from '../../util/constants';

class TaskDetail extends Component {

  constructor(props) {
    super(props);
    // props.setTaskErrorMessage({fsi: "", mandatory: ""});
    let taskDetail = props.taskList ? _.filter(props.taskList, { '_id': props.showtask})[0] : null,
      category = [],
      subCategory = [],
      filteredProjects = [],
      projects = [],
      categorySelected = {name: '', id: ''},
      subSelected = {name: '', id: ''},
      projectSelected = taskDetail.project.length > 0 ? {name: taskDetail.project[0].projectName, id: taskDetail.project[0]._id} : {name: '', id: ''},
      devAssigned = taskDetail.assignedTo.length > 0 ? {value: taskDetail.assignedTo[0]._id, label:taskDetail.assignedTo[0].firstName+" "+taskDetail.assignedTo[0].lastName} : null,
      leadAssigned = taskDetail.lead.length > 0 ? {value: taskDetail.lead[0]._id, label:taskDetail.lead[0].firstName+" "+taskDetail.lead[0].lastName} : null,
      reviewerAssigned = taskDetail.reviewer.length > 0 ? {value: taskDetail.reviewer[0]._id, label:taskDetail.reviewer[0].firstName+" "+taskDetail.reviewer[0].lastName} : null,
      functionalConsultant = taskDetail.functionalConsultant.length > 0 ? {value: taskDetail.functionalConsultant[0]._id, label: taskDetail.functionalConsultant[0].functionalConsultant} : null,
      statusSelected = _.filter(TASK_STATUS, { 'id': taskDetail.status})[0],
      prioritySelected = _.filter(TASK_PRIORITY, { 'id': taskDetail.priority})[0],
      wricefSelected = _.filter(TASK_WRICEF, { 'id': taskDetail.wricefType})[0],
      complexSelected = _.filter(TASK_COMPLEXITY, { 'id': taskDetail.complexity})[0];

    props.categories.forEach((item) => {
      if(taskDetail.categoryId && item._id == taskDetail.categoryId){
        categorySelected = {name: item.category, id: item._id}
      }
      category.push({name: item.category, id: item._id});
    });

    props.subCategories.forEach((item) => {
      if(taskDetail.subcategoryId && item._id == taskDetail.subcategoryId){
        subSelected = {name: item.subCategory, id: item._id}
      }
      subCategory.push({name: item.subCategory, id: item._id});
    });

    props.projects.forEach((item) => {
      projects.push({
        name: item.projectName,
        id: item._id, category: item.category[0],
        subCategory: item.subCategory[0] ? item.subCategory[0] : ""});
      if(item.category[0]._id == categorySelected.id && (item.subCategory[0] && item.subCategory[0]._id == subSelected.id)){
        filteredProjects.push({name: item.projectName, id: item._id});
      }
    })

    this.state = {
      category: category,
      sub: subCategory,
      project: filteredProjects,
      allProjects: projects,
      categorySelected: categorySelected,
      subSelected: subSelected,
      projectSelected: projectSelected,
      taskDetail: taskDetail,
      date: moment(),
      devAssigned: devAssigned,
      leadAssigned: leadAssigned,
      reviewerAssigned: reviewerAssigned,
      functionalConsultant: functionalConsultant,
      dueDate: taskDetail.dueDate ? moment(taskDetail.dueDate) : "",
      plannedStartDate: taskDetail.plannedStartDate ? moment(taskDetail.plannedStartDate) : "",
      plannedEndDate: taskDetail.plannedEndDate ? moment(taskDetail.plannedEndDate) : "",
      actualStartDate: taskDetail.actualStartDate ? moment(taskDetail.actualStartDate) : "",
      actualEndDate: taskDetail.actualEndDate ? moment(taskDetail.actualEndDate) : "",
      fsRecievedDate: taskDetail.fsRecievedDate ? moment(taskDetail.fsRecievedDate) : "",
      showATList: null,
      assignedToList: [],
      showLeadList: null,
      leadList: [],
      showReviewerList: null,
      reviewerList: [],
      showConsultantList: null,
      consultantList: [],
      closeError: false,
      estimatedHours: taskDetail.estimatedHours ? taskDetail.estimatedHours : "",
      prioritySelected: prioritySelected ? prioritySelected : TASK_PRIORITY[0],
      statusSelected: statusSelected ? statusSelected : TASK_STATUS[0],
      wricefSelected: wricefSelected ? wricefSelected : TASK_WRICEF[0],
      complexSelected: complexSelected ? complexSelected : TASK_COMPLEXITY[0],
      mandatoryFields: [] // 'ped', 'psd', 'eh', 'asd', 'aed'
    }
  }

  componentWillMount() {
    this.props.setTaskErrorMessage({fsi: "", mandatory: ""});
  }

  _onDDChange(type, payloadType, data, event){
    if(payloadType == "status" &&
    _.intersection(['DELIVERED','TEST-ON-HOLD', 'FUT-IN-PROGRESS', 'TESTING-IN-PROGRESS'], [data.id]).length > 0){
      if(!this._checkMandatoryFields()){
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

  componentDidMount() {
    !_.includes(this.props.userRole, 'GUEST') && this.props.getComments(this.state.taskDetail._id);
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

  _project() {
    return this.state.project.map( (item, index) => {
      return <MenuItem key={item.id} eventKey={item}>{item.name}</MenuItem>
    })
  }

  onClose() {
    this.props.closeDetails();
  }

  _onCategorySelect(key) {
    let projects = [],
    subSelected = this.state.subSelected;

    this.state.allProjects.forEach((item) => {
      if(item.category._id == key.id && (item.subCategory != "" && item.subCategory._id == subSelected.id)){
        projects.push({name: item.name, id: item.id});
      }
    });

    let payload = {
      "categoryId": key.id,
      "projectId": null
    };

    this._updateTask(payload);
    this.setState({categorySelected: key, project: projects, projectSelected: {name: "", id: ""}});
  }

  _onSubCategorySelect(key) {
    let payload = {
      "subcategoryId": key.id,
      "projectId": null
    },
    projects = [],
    categorySelected = this.state.categorySelected;

    this.state.allProjects.forEach((item) => {
      if(item.category._id == categorySelected.id && (item.subCategory != "" && item.subCategory._id == key.id)){
        projects.push({name: item.name, id: item.id});
      }
    });

    this._updateTask(payload);
    this.setState({subSelected: key, project: projects, projectSelected: {name: "", id: ""}})
  }

  _onProjectSelect(key) {
    let payload = {
      "projectId": key.id
    };

    this._updateTask(payload);
    this.setState({projectSelected: key})
  }

  _onDeveloperChange (key) {
    this._updateTask({
      developerId: key.value
    });
    this.setState({
      devAssigned: key,
      showATList: false,
      assignedToList: []
    });
	}

  _onLeadChange (key) {
    this._updateTask({
      leadId: key.value
    });
		this.setState({
			leadAssigned: key,
      showLeadList: false,
      leadList: []
		});
	}

  _onReviewerChange (key) {
    this._updateTask({
      reviewerId: key.value
    });
		this.setState({
			reviewerAssigned: key,
      showReviewerList: false,
      reviewerList: []
		});
	}

  _onFCChange (key) {
    this._updateTask({
       functionalConsultantId: key.value
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

  _handleDateChange(type, date) {
    let payload = {};
    let statePayload = {},
    mandatoryFields = this.state.mandatoryFields;
    payload[type] = (date == "" || date == null) ? "" : moment(date).format("YYYY-MM-DD");
    statePayload[type] = date;
    if(_.includes(['plannedStartDate', 'plannedEndDate', 'actualStartDate', 'actualEndDate'], type)){
      if(date != null && date != "" && mandatoryFields.length > 0){
        type == "plannedStartDate" ? mandatoryFields = _.remove(mandatoryFields, function(field) { return field != "psd"; }) : "";
        type == "plannedEndDate" ? mandatoryFields = _.remove(mandatoryFields, function(field) { return field != "ped"; }) : "";
        type == "actualStartDate" ? mandatoryFields = _.remove(mandatoryFields, function(field) { return field != "asd"; }) : "";
        type == "actualEndDate" ? mandatoryFields = _.remove(mandatoryFields, function(field) { return field != "aed"; }) : "";
        this._updateTask(payload);
      }else if((date == null || date == "") &&  _.intersection(['DELIVERED','TEST-ON-HOLD', 'FUT-IN-PROGRESS', 'TESTING-IN-PROGRESS'], [this.state.statusSelected.id]).length > 0) {
        type == "plannedStartDate" ? mandatoryFields.push("psd") : "";
        type == "plannedEndDate" ? mandatoryFields.push("ped") : "";
        type == "actualStartDate" ? mandatoryFields.push("asd") : "";
        type == "actualEndDate" ? mandatoryFields.push("aed") : "";
      }else {
        this._updateTask(payload);
      }
    }else {
      this._updateTask(payload);
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


    this.props.setTaskErrorMessage(messageObj)
    statePayload["mandatoryFields"] = mandatoryFields;
    this.setState(statePayload);
  }

  _onHoursChange(e) {

      let mandatoryFields = this.state.mandatoryFields;
      if(e.target.value != "" && _.includes(this.state.mandatoryFields, "eh")){
        this._updateTask({"estimatedHours": e.target.value});
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
          this.props.setTaskErrorMessage(messageObj);
          // this._updateTask({"estimatedHours": e.target.value});
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

  _updateTask(payload) {
    let args = {
      filter: this.props.filter,
      taskID: this.state.taskDetail._id,
      payload: payload,
      flag: true  //show data fetching
    };
    this.props.taskUpdate(args);
  }

  _autoSave(type, e) {
    let payload = {};
    payload[type] = e.target.value;
    this._updateTask(payload);
  }

  _autoSaveFSI(type, e) {
    let reg = /^(?:5(?:\.0)?|[1-4](?:\.[0-9])?|)$/;
    if(reg.test(e.target.value)){
      let payload = {};
      payload[type] = e.target.value;

      let messageObj = {
        fsi: "",
        mandatory: this.props.taskError.mandatory
      }
      this.props.setTaskErrorMessage(messageObj);
      this._updateTask(payload);
    }else {
      let messageObj = {
        fsi: "FSI Score should range between 1.0-5.0",
        mandatory: this.props.taskError.mandatory
      }
      this.props.setTaskErrorMessage(messageObj);
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
      estimatedHours === ""  && mandatoryFields.push('eh');

      this.setState({mandatoryFields: mandatoryFields});

      return true;
    }else {
      return false;
    }
  }

  _handleClickOutside() {
    this.setState({showATList: false, showConsultantList: false, showLeadList: false, showReviewerList: false})
  }

  _submitComment(e) {
    if(this.textarea.value != ""){
      let payload = {comment: this.textarea.value, taskId: this.state.taskDetail._id};
      this.props.submitAComment(payload, this.state.filter);
      this.textarea.value = ""
    }
  }

  _getOldComments() {
    let _this = this;
    return this.props.commentdetails.map((item, index) => {
      if(item.taskId == _this.state.taskDetail._id && item.comment != ""){
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
    let {taskDetail,
      closeError,
      subSelected,
      prioritySelected,
      statusSelected,
      wricefSelected,
      complexSelected} = this.state;
    let {userID, userRole, taskError} = this.props;
    return (
      <Col className="task-detail" lg={6} sm={6} xs={12} md={6}>
        <TaskDetailDropDowns
          onDDChange={this._onDDChange.bind(this)}
          prioritySelected={prioritySelected}
          statusSelected={statusSelected}
          wricefSelected={wricefSelected}
          complexSelected={complexSelected}
          userInfo={{userID: this.props.userID, userRole: this.props.userRole}}/>
        <Row>
        <div className={taskError && (taskError.fsi != "" || taskError.mandatory != "")? "slideDown" : "modal-error"}
            style={taskError && (taskError.fsi != "" || taskError.mandatory != "") ? {"zIndex": "90"} : {}}>
            {taskError.fsi}
            {taskError.fsi != "" && <br/>}
            {taskError.mandatory}
        </div>
        </Row>
        <div className="nav-close-trigger" onClick={this.onClose.bind(this)}>
          <span></span>
        </div>
        <Row className="td-info">

          {!_.includes(userRole, 'GUEST')?
            <div className="td-desc" style={{position: "relative"}}>
                <input
                  type="text"
                  defaultValue={taskDetail.taskDescription}
                  onBlur={this._autoSave.bind(this, "taskDescription")}/>
              {this.props.isdataloading && <Loader /> }
            </div>
              :
            <div className="td-desc">{taskDetail.taskDescription}</div>
          }

          {_.includes(TASK_PROJECT_SUB, subSelected.name.toLowerCase()) ?
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

          {this.state.subSelected.name.toLowerCase() == "projects" || subSelected.name.toLowerCase() == "bundled rfcs" ?
            <Row className="td-categories left-border">
              <div style={{width: "33.3%", display: "inline-block"}}>
                {!_.includes(userRole, 'GUEST')?
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
                  {!_.includes(userRole, 'GUEST')?
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
                  {!_.includes(userRole, 'GUEST')?
                  <DropdownButton
                    title={this.state.projectSelected.name}
                    id={`dropdown-basic-2`}
                    onSelect={this._onProjectSelect.bind(this)}>
                    {this._project()}

                  </DropdownButton>
                  : <div style={{paddingLeft: "15px"}}>{this.state.projectSelected.name != "" ? this.state.projectSelected.name : "Unassigned"}</div>
               }
             </div>
            </Row>

          :<Row className="td-categories left-border">
            <div style={{width: "50%", display: "inline-block"}}>
              {!_.includes(userRole, 'GUEST')?
              <DropdownButton
                title={this.state.categorySelected.name}
                id={`dropdown-basic-1`}
                onSelect={this._onCategorySelect.bind(this)}>
                {this._category()}

              </DropdownButton>
              : <div style={{paddingLeft: "15px"}}>{this.state.categorySelected.name}</div>
           }
         </div>
            <div style={{width: "50%", display: "inline-block"}}>
              {!_.includes(userRole, 'GUEST')?
              <DropdownButton
                title={this.state.subSelected.name}
                id={`dropdown-basic-2`}
                onSelect={this._onSubCategorySelect.bind(this)}>
                {this._subCategory()}

              </DropdownButton>
              : <div style={{paddingLeft: "15px"}}>{this.state.subSelected.name}</div>
           }
         </div>
          </Row>
        }

        {!_.includes(userRole, 'GUEST') ? "" :  <hr/>}

          <Row style={{marginTop: "15px"}} className="left-border">
            <Col xs={6}>
              <label onClick={this._handleClickOutside.bind(this)}>Assigned To</label>
              {!_.includes(userRole, 'GUEST') ?
                <TaskInputField
                  className="td-icon-user"
                  key={this.state.devAssigned}
                  value={this.state.devAssigned}
                  isLoading={this.state.showATList}
                  onChange={this._onDeveloperChange.bind(this)}
                  list={this.state.assignedToList}
                  onFocus={this._onInputassignedToChange.bind(this)}
                /> : <div className="icon-user">{taskDetail.assignedTo[0] ? (taskDetail.assignedTo[0].firstName+" "+taskDetail.assignedTo[0].lastName) : "Unassigned"}</div>
              }
            </Col>
            <Col xs={6}>
              <label>Due Date</label>
              {!_.includes(userRole, 'GUEST')?
                <DatePicker
                    fixedHeight
                    className="td-icon-calendar calendar-editable"
                    selected={this.state.dueDate}
                    dateFormat="DD MMM YYYY"
                    placeholderText="Unassigned"
                    onChange={this._handleDateChange.bind(this, "dueDate")}
                />
              : <div className="td-icon-calendar">{taskDetail.dueDate ? moment(taskDetail.dueDate).format("DD MMM YYYY") : "Unassigned"}</div>
            }
            </Col>

          </Row>

          <hr />

          <Row style={{marginTop: "15px"}} className="left-border">
            <Col xs={4}>
              <label onClick={this._handleClickOutside.bind(this)}>Lead</label>
                {
                  !_.includes(userRole, 'GUEST')?
                  <TaskInputField
                    className="td-icon-user"
                    key={this.state.leadAssigned}
                    value={this.state.leadAssigned}
                    onChange={this._onLeadChange.bind(this)}
                    onFocus={this._onInputleadChange.bind(this)}
                    isLoading={this.state.showLeadList}
                    list={this.state.leadList}
                    handleClickOutside={this._handleClickOutside.bind(this)}
                  /> :
                  <div className="icon-user">{taskDetail.lead[0] ? (taskDetail.lead[0].firstName+" "+taskDetail.lead[0].lastName) : "Unassigned"}</div>
                }
            </Col>
            <Col xs={4}>
              <label onClick={this._handleClickOutside.bind(this)}>Reviewer</label>
                {
                  !_.includes(userRole, 'GUEST')?
                  <TaskInputField
                    className="td-icon-user"
                    key={this.state.reviewerAssigned}
                    value={this.state.reviewerAssigned}
                    onChange={this._onReviewerChange.bind(this)}
                    onFocus={this._onInputReviewerChange.bind(this)}
                    isLoading={this.state.showReviewerList}
                    list={this.state.reviewerList}
                    handleClickOutside={this._handleClickOutside.bind(this)}
                  /> :
                  <div className="icon-user">{taskDetail.reviewer[0] ? (taskDetail.reviewer[0].firstName+" "+taskDetail.reviewer[0].lastName) : "Unassigned"}</div>
                }
            </Col>
            <Col xs={4}>
              <label onClick={this._handleClickOutside.bind(this)}>Functional Consultant</label>
              {
                !_.includes(userRole, 'GUEST')?
                <TaskInputField
                  className="td-icon-user"
                  key={this.state.functionalConsultant}
                  value={this.state.functionalConsultant}
                  onChange={this._onFCChange.bind(this)}
                  onFocus={this._onInputConsultantChange.bind(this)}
                  isLoading={this.state.showConsultantList}
                  list={this.state.consultantList}
                  handleClickOutside={this._handleClickOutside.bind(this)}
                />:
                <div className="icon-user">{taskDetail.functionalConsultant[0] ? (taskDetail.functionalConsultant[0].functionalConsultant) : "Unassigned"}</div>
              }
            </Col>

          </Row>

          <hr />

          <Row style={{marginTop: "15px"}} className="left-border">
            <Col xs={4}>
              <label>RFC Number</label>
              {!_.includes(userRole, 'GUEST')?
               <input className="input-rfc td-icon-task"
                 type="text"
                 disabled={taskDetail.rfcNumber.length > 0}
                 defaultValue={taskDetail.rfcNumber}
                 placeholder="Unassigned"
                 onBlur={this._autoSave.bind(this, "rfcNumber")}/>:
                <div className="td-icon-task">{taskDetail.rfcNumber || "Unassigned"}</div>
              }
            </Col>
            <Col xs={4}>
              <label>SNOW Task Number</label>
              {!_.includes(userRole, 'GUEST')?
               <input type="text"
                 className="td-icon-task"
                 ref={(snow)=>{this.snow = snow}}
                 placeholder="Unassigned"
                 defaultValue={taskDetail.snowTaskNumber}
                 onBlur={this._autoSave.bind(this, "snowTaskNumber")}/> :
              <div className="td-icon-task">{taskDetail.snowTaskNumber || "Unassigned"}</div>
              }

            </Col>
            <Col xs={4}>
              <label>FSI Score</label>
              {!_.includes(userRole, 'GUEST')?
                  <input type="text"
                    className="td-icon-time"
                    ref={(fsi)=>{this.fsi = fsi}}
                    style={{width: "100%"}}
                    placeholder="Unassigned"
                    defaultValue={taskDetail.fsiScore}
                    onBlur={this._autoSaveFSI.bind(this, "fsiScore")}/>
              : <div className="td-icon-time">{taskDetail.fsiScore || "Unassigned"}</div>
              }
            </Col>

          </Row>

          <hr />

          <Row style={{marginTop: "15px"}} className="left-border">
            <Col xs={4}>
              <label className={_.includes(this.state.mandatoryFields, 'psd') ? 'mandate' : ''}>Planned Start Date</label>
              {!_.includes(userRole, 'GUEST')?
                <DatePicker
                    fixedHeight
                    className="td-icon-calendar calendar-editable"
                    selected={this.state.plannedStartDate}
                    placeholderText="Unassigned"
                    dateFormat="DD MMM YYYY"
                    maxDate={this.state.plannedEndDate != "" || this.state.plannedEndDate != null ? moment(this.state.plannedEndDate) : null}
                    onChange={this._handleDateChange.bind(this, "plannedStartDate")} />
                  : <div className="td-icon-calendar">{taskDetail.plannedStartDate ? moment(taskDetail.plannedStartDate).format("DD MMM YYYY") : "Unassigned"}</div>
              }
            </Col>
            <Col xs={4}>
              <label className={_.includes(this.state.mandatoryFields, 'ped') ? 'mandate' : ''}>Planned End Date</label>
              {!_.includes(userRole, 'GUEST')?
                <DatePicker
                    fixedHeight
                    className="td-icon-calendar calendar-editable"
                    selected={this.state.plannedEndDate}
                    placeholderText="Unassigned"
                    dateFormat="DD MMM YYYY"
                    minDate={this.state.plannedStartDate != "" || this.state.plannedStartDate != null ? moment(this.state.plannedStartDate) : null}
                    onChange={this._handleDateChange.bind(this, "plannedEndDate")}/>
                  : <div className="td-icon-calendar">{taskDetail.plannedEndDate ? moment(taskDetail.plannedEndDate).format("DD MMM YYYY") : "Unassigned"}</div>
              }
            </Col>
            <Col xs={4}>
              <label className={_.includes(this.state.mandatoryFields, 'eh') ? 'mandate' : ''}>Estimated Hours</label>
              {!_.includes(userRole, 'GUEST')?
                <input type="text"
                  key={taskDetail.estimatedHours}
                  className="td-icon-time"
                  ref={(hrs)=>{this.hrs = hrs}}
                  onInput={() => {this.hrs.value=this.hrs.value.replace(/[^0-9]/g,'');}}
                  defaultValue={ taskDetail.estimatedHours || ""}
                  style={{width: "100%"}}
                  placeholder="Unassigned"
                  onBlur={this._onHoursChange.bind(this)}/>
                : <div className="td-icon-time">{taskDetail.estimatedHours ? taskDetail.estimatedHours : "Unassigned"}</div>
              }
            </Col>

          </Row>

          <hr />

          <Row style={{marginTop: "15px"}} className="left-border">
            <Col xs={4}>
              <label className={_.includes(this.state.mandatoryFields, 'asd') ? 'mandate' : ''}>Actual Start Date</label>
              {!_.includes(userRole, 'GUEST')?
                <DatePicker
                    fixedHeight
                    className="td-icon-calendar calendar-editable"
                    selected={this.state.actualStartDate}
                    placeholderText="Unassigned"
                    dateFormat="DD MMM YYYY"
                    maxDate={this.state.actualEndDate != "" || this.state.actualEndDate != null ? moment(this.state.actualEndDate) : null}
                    onChange={this._handleDateChange.bind(this, "actualStartDate")}/>
                  : <div className="td-icon-calendar">{taskDetail.actualStartDate ? moment(taskDetail.actualStartDate).format("DD MMM YYYY") : "Unassigned"}</div>
              }
            </Col>
            <Col xs={4}>
              <label className={_.includes(this.state.mandatoryFields, 'aed') ? 'mandate' : ''}>Actual End Date</label>
              {!_.includes(userRole, 'GUEST')?
                <DatePicker
                    fixedHeight
                    className="td-icon-calendar calendar-editable"
                    selected={this.state.actualEndDate}
                    placeholderText="Unassigned"
                    dateFormat="DD MMM YYYY"
                    minDate={this.state.actualStartDate != "" || this.state.actualStartDate != null ? moment(this.state.actualStartDate) : null}
                    onChange={this._handleDateChange.bind(this, "actualEndDate")}/>
                  : <div className="td-icon-calendar">{taskDetail.actualEndDate ? moment(taskDetail.actualEndDate).format("DD MMM YYYY") : "Unassigned"}</div>
                }
            </Col>
            <Col xs={4}>
              <label>FS Received Date</label>
              {!_.includes(userRole, 'GUEST')?
                <DatePicker
                    fixedHeight
                    className="td-icon-calendar calendar-editable"
                    selected={this.state.fsRecievedDate}
                    placeholderText="Unassigned"
                    dateFormat="DD MMM YYYY"
                    onChange={this._handleDateChange.bind(this, "fsRecievedDate")}/>
                  : <div className="td-icon-calendar">{taskDetail.fsRecievedDate ? moment(taskDetail.fsRecievedDate).format("DD MMM YYYY") : "Unassigned"}</div>
                }
            </Col>

          </Row>

          <hr />

          <div className="created-by">Created By: {taskDetail.createdBy[0].firstName+" "+taskDetail.createdBy[0].lastName}</div>


          {!_.includes(userRole, 'GUEST') ?
              <Row style={{marginTop: "15px"}}>
                <Col xs={12}>
                  <label>Comments</label>

                </Col>
                <Col xs={12} className="old-comments">
                  {this._getOldComments()}
                </Col>

                <Col xs={12} className="comment-section">
                  <textarea placeholder="Write a comment"
                    ref={(textarea) => {this.textarea = textarea}}/>
                    <button onClick={this._submitComment.bind(this)}>Submit</button>
                </Col>


              </Row>
            : "" }

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
  userID: state.auth.userID,
  userRole: state.auth.userRole,
  isdataloading: state.task.showdataloading,
  commentdetails: state.task.commentdetails};
}

export default connect(mapStateToProps, actions)(TaskDetail);
