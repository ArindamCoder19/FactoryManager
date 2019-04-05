import React, { Component } from 'react';
import _ from 'lodash';
import moment from 'moment';
import onClickOutside from 'react-onclickoutside';
import { Row, Col, Overlay, Popover } from 'react-bootstrap';

import {
  populatePreviousTasks,
  onTimesheetSubmit } from '../../../actions/timesheetActions';

class AddTaskDropdown extends Component {

  constructor() {
    super();

    this.state = {
      newInput: '',
      showTasks: false,
      navSelected: 0, //0-Productive, 1-Non-Productive
      navSubSelected: 0 //0-Inprogress, 1-Delivered
    }
  }

  onNavSelect(navSelected) {
    this.setState({navSelected: navSelected});
  }

  onNavSubSelect(navSubSelected) {
    this.setState({navSubSelected: navSubSelected});
  }

  onDropdownClose() {
    this.setState({
      navSelected: 0, //0-Productive, 1-Non-Productive
      navSubSelected: 0 //0-Inprogress, 1-Delivered
    })
  }

  filterOptions(options, e) {
    this.setState({newInput: e.target.value})
  }

  _onToggleShowtasks() {
    this.setState({showTasks: true})
  }

  _menuItems(options, onClick, timesheetdata) {
    let ids = Object.keys(timesheetdata);

    //Filter Data based on input
    let value = this.state.newInput,
      newSet = options;
    if(value != ""){
      newSet = _.filter(options, function(o) {
        return (o.addInfo && o.addInfo.taskDescription.toLowerCase().indexOf(value.toLowerCase()) >= 0 ) ||
        o.label.toLowerCase().indexOf(value.toLowerCase()) >= 0 });
    }

    return newSet.map( (item, index) => {
      if(item.isProductive)
        if(ids.indexOf(item.value) >= 0 ){
          return <div key={item.value} className="d-row disabled" >
            <div>{item.label}</div>
            <div>{item.addInfo ? item.addInfo.taskDescription: ""}</div>
            <div>{item.addInfo ? item.addInfo.timespent: ""}</div>
          </div>
        }else {
          return <div key={item.value} className="d-row" onClick={onClick.bind(this, item)}>
            <div>{item.label}</div>
            <div>{item.addInfo ? item.addInfo.taskDescription: ""}</div>
            <div>{item.addInfo ? item.addInfo.timespent: ""}</div>
          </div>
        }
      else {
        if(ids.indexOf(item.value) >= 0 ){
          return <div key={item.value} className="d-nonprodrow disabled" >
            <div>{item.label}</div>
          </div>
        }else {
          return <div key={item.value} className="d-nonprodrow" onClick={onClick.bind(this, item)}>
            <div>{item.label}</div>
          </div>
        }
      }
    })
  }

  onTaskSelect(item) {
    this.props.onTaskSelect(item);
    this.setState({
      showTasks: false
    })
  }

  menuRenderer(param) {
    return <div className="ts-search-list">
      <div className="ts-search-header">
        <div className={this.state.navSelected == 0 ? 'active' : ''} onClick={this.onNavSelect.bind(this, 0)}>Productive</div>
        <div>|</div>
        <div className={this.state.navSelected == 1 ? 'active' : ''} onClick={this.onNavSelect.bind(this, 1)}>Non-Productive</div>
      </div>
      <hr />
      {
        this.state.navSelected == 0 &&
        <div className="ts-subheader">

          <div onClick={this.onNavSubSelect.bind(this, 0)}><input type="radio" onChange={() => {}} checked={this.state.navSubSelected == 0 ? true : false} /> In-Progress</div>
          <div onClick={this.onNavSubSelect.bind(this, 1)}><input type="radio" onChange={() => {}} checked={this.state.navSubSelected == 1 ? true : false} /> Delivered</div>
          <hr />
        </div>
      }
      <div className="ts-list">{this._menuItems(param.options, this.onTaskSelect.bind(this), this.props.timesheetdata)}</div>
    </div>
  }

  handleClickOutside = evt => {
   this.setState({
     showTasks:false,
     navSelected: 0, //0-Productive, 1-Non-Productive
     navSubSelected: 0 //0-Inprogress, 1-Delivered
   });
 }

  render () {

    let {navSelected, navSubSelected} = this.state,
    {
      taskInprogress,
      taskDelivered,
      taskNonprod,
      newTaskSelected
    } = this.props,
    options = navSelected == 0 ? ( navSubSelected == 0 ? taskInprogress : taskDelivered ) : taskNonprod;

    return (
      <div className="ts-dropdown-container" style={{display: "inline-block"}}>
          <div ref={(task) => {this.task = task}} className="ts-dropbtn" onClick={this._onToggleShowtasks.bind(this)}>
            <div>
              <input
                style={{width: "100%", border: "0px", outline: "none"}}
                key={newTaskSelected == "" ? "" : newTaskSelected.label}
                type="text" placeholder="Add Task"
                defaultValue={newTaskSelected == "" ? "" : newTaskSelected.label}
                onChange={this.filterOptions.bind(this, options)}/>
            </div>
            <div>0/0</div>
          </div>

          <div className="ts-droplist">
            {options && this.state.showTasks && this.menuRenderer({options: options})}
          </div>
          <Overlay
            show={this.props.error ? true : false}
            target={this.task}
            placement="top"
            containerPadding={20}
            animation={false}
          >
            <Popover id="popover-contained" className="error-popup" title="">
              {this.props.error}
            </Popover>
          </Overlay>
          <div></div>
      </div>
    )
  }
}



export default onClickOutside(AddTaskDropdown);
