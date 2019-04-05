import React, { Component } from 'react';
import { Row, Col, Overlay, Popover } from 'react-bootstrap';
import axios from 'axios';
import _ from 'lodash';
import moment from 'moment';
import { connect } from 'react-redux';

import TaskHeader from '../general/layout_new/Header';
import FilterComponent from '../general/layout_new/FilterComponent';
import FilterCalendarComponent from '../general/layout_new/FilterCalendar';
import {
  showTaskDetail,
  filterTasks,
  addNewTask,
  showNewTask,
  newtaskDataChange,
  deleteTask,
  setTaskErrorMessage
} from '../../actions/taskActions';
import { isFetching } from '../../actions/general';
import {
  TASK_DDMENU_DEV,
  TASK_DDMENU_LEAD,
  TASK_DDMENU_MANAGER,
  TASK_DDMENU_ADMIN,
  TASK_SUB_DDMENU
} from '../../util/constants';


class TaskSummary extends Component {

  constructor(props) {
    super(props);
    this.state = {
      filterID: 0,
      selectedRow: props.showtask,
      response: [],
      addNewTask: false,
      showMenuID: -1,
      toggle: false,
      error: ""
    }
  }

  _onRowClick(item) {
    this.props.showTaskDetail(item._id);
    this.setState({selectedRow: item._id});
  }

  _deleteTask(id, e) {
    e.preventDefault();
    let args = {
      filter: this.props.filter,
      taskID: id
    };
    this.props.deleteTask(args);
  }

  _subMenu(id, e) {
    e.stopPropagation();
    this.setState({showMenuID: id, toggle: !this.state.toggle})
  }

  _getList() {
    let _this = this;
    if(this.props.taskList && this.props.taskList.length > 0){

      return this.props.taskList.map( (item, index) => {
        let hoursSpent = item.hoursSpend ? parseFloat(item.hoursSpend) : 0,
        estimatedHours = item.estimatedHours ? parseFloat(item.estimatedHours) : 0,
        hasUtilizedMore = hoursSpent > estimatedHours;
        return <div key={index}
          className={_this.props.showtask == item._id ? "d-row active" : "d-row"}
          onClick={_this._onRowClick.bind(_this, item, index)}>
          <div className={(item.status == "CANCELLED" || item.status == "DELIVERED") ? "logo-complete" : ""}>
          </div>
          <div>{item.rfcNumber}</div>
          <div>{item.taskDescription}</div>
          <div className={hasUtilizedMore ? "red-bottom" : ""}>{hoursSpent+"/"+estimatedHours}</div>
          <div>{item.plannedEndDate ? moment(item.plannedEndDate).format('DD MMM') : ""}</div>
          <div className="short-name">
            {item.assignedTo.length > 0 ?
              item.assignedTo[0].firstName[0].toUpperCase()+item.assignedTo[0].lastName[0].toUpperCase()
            :""}
          </div>
          {_this.props.userRole.indexOf('ADMIN') >= 0 &&
            <span className="menu-caret" onClick={_this._subMenu.bind(_this, item._id)}></span>}
          {_this.state.toggle && _this.state.showMenuID == item._id && _this.props.userRole.indexOf('ADMIN') >= 0?
            <div className="dropdown">
               <ul className="dropdown-menu submenu">
                 <li ><a href="#" onClick={_this._deleteTask.bind(_this, item._id)}>Delete Task</a>
                </li>
              </ul>
            </div> : ""}
        </div>
      });
    }else {
      return <div className="no-data">No Data</div>
    }
  }

  _filterSelect(filter) {
    // let payload = {};
    // payload['FILTER1'] = this.props.filter['FILTER1'];
    // payload['FILTER2'] = this.props.filter['FILTER2'];
    // payload['FILTER3'] = this.props.filter['FILTER3'];
    // payload['FILTER4'] = isMenuSelected ? "ALL" : this.props.filter['FILTER4'];
    // payload['FILTER5'] = this.props.filter['FILTER5'];
    // payload['FILTER6'] = this.props.filter['FILTER6'];
    // payload['FILTER7'] = this.props.filter['FILTER7'];
    // payload['FILTER8'] = this.props.filter['FILTER8'];
    // payload[filterType] = filter;

    this.props.setTaskErrorMessage({fsi: "", mandatory: ""});
    this.props.isFetching();
    this.props.filterTasks(filter, null);
  }

  _getCategories() {
    let category = [{name: 'All Categories', id: 'ALL'}];
    if(this.props.categories){
      this.props.categories.forEach((item) => {
        category.push({name: item.category, id: item._id})
      });
    }
    return category;
  }

  _getSubCategories() {
    let subcategory = [{name: 'Select All', id: 'ALL'}];
    if(this.props.subCategories){
      this.props.subCategories.forEach((item) => {
        subcategory.push({name: item.subCategory, id: item._id})
      });
    }
    return subcategory;
  }

  _getDDMenu() {
    if(_.includes(this.props.userRole, 'LEAD')){
      return TASK_DDMENU_LEAD
    }else if (_.includes(this.props.userRole, 'MANAGER')){
      return TASK_DDMENU_MANAGER
    }else if(_.includes(this.props.userRole, 'ADMIN') || _.includes(this.props.userRole, 'GUEST')) {
      return TASK_DDMENU_ADMIN
    }else {
      return TASK_DDMENU_DEV
    }
  }

  _showNewTask() {
    this.props.showNewTask();
  }

  _addNewTask() {
    if(this.rfcNumber.value == ""){
      this.setState({error: "Please fill RFC Number"})
    }else{
      if(this.props.taskError.fsi == "" && this.props.taskError.mandatory == ""){
        this.props.isFetching();
        this.props.addNewTask(this.props.newtaskdata, this.props.filter);
      }
    }
  }

  _onNewInputChange(type, e) {
    this.setState({error: ""})
    let data = {};
    let payload = {};
    payload[type] = e.target.value;
    for (let j in this.props.newtaskdata){
      data[j] = this.props.newtaskdata[j]
    }
    for (let i in payload){
      data[i] = payload[i];
    }
    this.props.newtaskDataChange(data);
  }

  render() {
    let filter1list = this._getDDMenu(),
    categories = this._getCategories(),
    subCategories = this._getSubCategories(),
    { filter, totalCount } = this.props;
    return (
      <Col className={filter["FILTER7"] === "ALL" && filter["FILTER8"] === "ALL" ? "summary" : "summary search" } xs={12} md={6} lg={6} sm={6}>
        <div>
          <TaskHeader
            title="Tasks"
            subTitle = {filter["FILTER7"] === "ALL" && filter["FILTER8"] === "ALL" ? "" : " (Search Results)" }
            showDownload={true}
            totalCount={totalCount}
            downloadData={this.props.downloadData}/>
        </div>

        <Row>
          {subCategories.length > 1 ? <div className="filter-container">
            <FilterComponent
              className="task-dd"
              name=""
              menu={filter1list}
              menuType="FILTER1"
              subMenuType="FILTER2"
              submenu={TASK_SUB_DDMENU}
              filter={this.props.filter}
              filterSelect={this._filterSelect.bind(this)}
              />
            <FilterComponent
              className="task-dd"
              name=""
              menuType="FILTER3"
              subMenuType="FILTER4"
              menu={categories}
              submenu={subCategories}
              filter={this.props.filter}
              filterSelect={this._filterSelect.bind(this)}
              />
            <FilterCalendarComponent
              className="task-dd"
              title="Planned End Date"
              menuType="FILTER5"
              subMenuType="FILTER6"
              menuSelected={{name: 'The Beginning', id: 'ALL'}}
              subMenuSelected={{name: 'The End', id: 'ALL'}}
              filter={this.props.filter}
              filterSelect={this._filterSelect.bind(this)}/>
          </div> :
          <div className="filter-container">
            <div className="grey-dropdown task-dd">
              <div className="dropdown open btn-group"><button className="dropdown-toggle btn btn-default">{filter1list[0].name}</button></div>
            </div>
            <div className="grey-dropdown task-dd">
              <div className="dropdown open btn-group"><button className="dropdown-toggle btn btn-default">{categories[0].name}</button></div>
            </div>
            <div className="grey-dropdown task-dd">
              <div className="dropdown open btn-group"><button className="dropdown-toggle btn btn-default">Planned End Date</button></div>
            </div>
          </div>
          }
        </Row>

          <div className="new-task">
            {_.includes(this.props.userRole, 'GUEST') ? "" : <span onClick={this._showNewTask.bind(this)}>Add New Task</span>}
          </div>

        <Row className="newtask-container">
          {this.props.newtask ?
            <div className={"d-row active"} >
              <div></div>
              <div>
                <input
                  type="text"
                  style={{width: "100%"}}
                  required
                  placeholder="RFC Number"
                  ref={(rfc) => {this.rfcNumber = rfc}}
                  onChange={this._onNewInputChange.bind(this, "rfcNumber")}
                  value={this.props.newtaskdata.rfcNumber ? this.props.newtaskdata.rfcNumber : ''}/>

              </div>
              <div>
                <input
                  type="text"
                  style={{width: "100%"}}
                  placeholder="Task Description"
                  ref={(desc) => {this.desc = desc}}
                  onChange={this._onNewInputChange.bind(this, "taskDescription")}
                  value={this.props.newtaskdata.taskDescription ? this.props.newtaskdata.taskDescription : ''}/>
              </div>
              <div></div>
              <div style={{textAlign: "center"}}>
                <button style={{color: "#28AFB0", fontWeight: "bold"}}
                onClick={this._addNewTask.bind(this)}>Add</button>
              </div>
                <Overlay
                  show={this.props.error.newtask || this.state.error ? true : false}
                  target={this.rfcNumber}
                  placement="top"
                  containerPadding={20}
                  animation={false}
                >
                  <Popover id="popover-contained" className="error-popup" title="">
                    {this.state.error || this.props.error.newtask}
                  </Popover>
                </Overlay>
              </div>
            :
            ""
          }
        </Row>

        <Row className="summary-list">
          {this._getList()}
        </Row>
      </Col>
    )
  }
}

function mapStateToProps(state) {
  return { taskList: state.task.tasks,
  downloadData: state.task.downloadData,
  totalCount: state.task.totalCount,
  filter: state.task.filter,
  showtask: state.task.showtask,
  userRole: state.auth.userRole,
  userID: state.auth.userID,
  newtask: state.task.newtask,
  newtaskdata: state.task.newtaskdata,
  categories: state.generic.categories,
  subCategories: state.generic.subCategories,
  taskError: state.task.genericErrorMsg,
  error: state.task.error};
}

let actions = {
  showTaskDetail,
  filterTasks,
  isFetching,
  addNewTask,
  showNewTask,
  newtaskDataChange,
  deleteTask,
  setTaskErrorMessage
};

export default connect(mapStateToProps, actions)(TaskSummary);
