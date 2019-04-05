import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import Select from 'react-select';
import _ from 'lodash';
import moment from 'moment';

import { addNewTime,
  deleteTimesheet,
  updateTimesheet,
  onTimesheetSubmit,
  addOldTimesheet } from '../../actions/timesheetActions';

import TSTableHeader from './detail/TSTableHeader';
import AddTaskDropdown from './detail/AddTaskDropdown';

class TimesheetDetail extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      open: false,
      newTaskSelected: "",
      newdata: {
        mon: "0.00",
        tue: "0.00",
        wed: "0.00",
        thu: "0.00",
        fri: "0.00"
      },
      selectedRow: -1,
      showMenuID: -1,
      toggle: false,
      error: "",
      genericError: ""
    }
  }

  _toggleMenu() {
    this.setState({open: !this.state.open})
  }

  onTaskSelect(item) {
    this.setState({
      newTaskSelected: item,
      error: "",
      newdata: {
        mon: "0.00",
        tue: "0.00",
        wed: "0.00",
        thu: "0.00",
        fri: "0.00"
      }
    });
  }

  onNewTSChange(day, e) {
    //let reg = /^\d{0,2}(?:\.\d{0,2})?$/; ///^[0-9]?.\d{0,2}$/;
    let reg=/^[0-9]?.\d{0,2}$/;

    if(this.state.newTaskSelected.value == "vacation" || this.state.newTaskSelected.value == "holiday"){
      reg = /^[0, 8](?:\.[0]{0,2})?$/;
    }

    let newdata = this.state.newdata;

    if(reg.test(e.target.value)){
      newdata[day] = e.target.value == "" ? "0.00" : e.target.value;
      this.setState({
        newdata: newdata
      })
    }else{
        this.setState({newdata: this.state.newdata})
    }
  }

  submitNewTime() {
    if(this.state.newTaskSelected != ""){
      let newdatafilled = false;

      for(let i in this.state.newdata) {
        if(this.state.newdata[i] != "0.00"){
          newdatafilled = true;
          break;
        }
      }
      if(newdatafilled){
        let dates = {},
          selectedTask = this.state.newTaskSelected;
        dates["Mon"] = {
          date: moment(this.props.weekSelected).startOf("week").weekday(1).format("YYYY-MM-DD"),
          hours: parseFloat(this.state.newdata.mon).toFixed(2)
        }
        dates["Tue"] = {
          date: moment(this.props.weekSelected).startOf("week").weekday(2).format("YYYY-MM-DD"),
          hours: parseFloat(this.state.newdata.tue).toFixed(2)
        }
        dates["Wed"] = {
          date: moment(this.props.weekSelected).startOf("week").weekday(3).format("YYYY-MM-DD"),
          hours: parseFloat(this.state.newdata.wed).toFixed(2)
        }
        dates["Thu"] = {
          date: moment(this.props.weekSelected).startOf("week").weekday(4).format("YYYY-MM-DD"),
          hours: parseFloat(this.state.newdata.thu).toFixed(2)
        }
        dates["Fri"] = {
          date: moment(this.props.weekSelected).startOf("week").weekday(5).format("YYYY-MM-DD"),
          hours: parseFloat(this.state.newdata.fri).toFixed(2)
        }

        let payload = {};
        if(selectedTask.isProductive){
          payload = {
            taskId: selectedTask.value,
            dates: dates,
            user: this.props.userSelected,
            weekSelected: this.props.weekSelected,
            isProductive: selectedTask.isProductive
          };
        }else {
          payload = {
            type: selectedTask.value == "vacation" || selectedTask.value == "holiday" ? selectedTask.value : "non-productive",
            subType: selectedTask.value == "vacation" || selectedTask.value == "holiday" ? "" : selectedTask.value,
            dates: dates,
            user: this.props.userSelected,
            weekSelected: this.props.weekSelected,
            isProductive: selectedTask.isProductive
          };
        }

        this.props.addNewTime(payload);
        this.setState({
          newTaskSelected: "",
          newdata: {
            mon: "0.00",
            tue: "0.00",
            wed: "0.00",
            thu: "0.00",
            fri: "0.00"
        }})
      }else {
        this.setState({genericError: "Please fill in data for at least a day"});
      }
    }else {
      this.setState({error: "Please Add a Task"});
    }
  }

  _onRowClick(item) {
    this.setState({selectedRow: item._id, showMenuID: null, toggle: false})
  }

  _subMenu(item, id, e) {
    e.stopPropagation();
    this.setState({showMenuID: item, toggle: !this.state.toggle})
  }
  _deleteTimesheet(payload, isProductive, e) {
    e.preventDefault();
    let currentSelection = {
      user: this.props.userSelected,
      weekSelected: this.props.weekSelected,
      isProductive: isProductive
    };
    this.props.deleteTimesheet(payload, currentSelection);
  }
  _autosave(day, taskId, data, e) {
    let reg =/^[0-9]?.\d{0,2}$/;     ///^\d{0,2}(?:\.\d{0,2})?$/,
    errorMsg = "Please fill numbers in 0.00 format";

    if(taskId == "vacation" || taskId == "holiday"){
      reg = /^[0, 8](?:\.[0]{0,2})?$/;
      errorMsg = "Only 0 or 8 can be filled for Vacation/Holiday";
    }

    if(reg.test(e.target.value)){
      if(data.details[day].id != null){
        let payload = {hours: parseFloat(e.target.value).toFixed(2)},
        args = {
          user: this.props.userSelected,
          weekSelected: this.props.weekSelected,
          isProductive: data.isProductive
        };
        this.props.updateTimesheet(data.details[day].id, payload, args);
      }else{
        let payload = {};
        let dates = {},
          weekDays = ["", "Mon", "Tue", "Wed", "Thu", "Fri"]

        dates[day] = {
          date: moment(this.props.weekSelected).startOf("week").weekday(weekDays.indexOf(day)).format("YYYY-MM-DD"),
          hours: parseFloat(e.target.value).toFixed(2)
        }
        if(data.isProductive){
          payload = {
            taskId: taskId,
            dates: dates,
            user: this.props.userSelected,
            weekSelected: this.props.weekSelected,
            isProductive: data.isProductive
          };
        }else {
          payload = {
            type: taskId == "vacation" || taskId == "holiday" ? taskId : "non-productive",
            subType: taskId == "vacation" || taskId == "holiday" ? "" : taskId,
            dates: dates,
            user: this.props.userSelected,
            weekSelected: this.props.weekSelected,
            isProductive: data.isProductive
          };
        }

        this.props.addOldTimesheet(payload, day);
      }
      this.setState({genericError: ""});
    }else {
      this.setState({genericError: errorMsg});
    }

  }

  getOlderTimesheetData() {
    let data = this.props.timesheetdata,
    weekSelected = this.props.weekSelected,
    key = moment(weekSelected).startOf("week").weekday(1).format("YYYY-MM-DD"),
    userCreatedAt = moment(this.props.userSelected.created_at).format('YYYY-MM-DD'),
    _this = this,
    prev3weeks = moment().weekday(-1-21),
    ids = Object.keys(data),
    allowEdit = (moment(prev3weeks).isBefore(moment(weekSelected).weekday(1)) || !this.props.isSubmitted);
    return ids.map((item, index) => {
      let weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri"],
      payloadToDelete = [],
      tooltip = !data[item].isProductive && (data[item].nonProdID === "holiday" || data[item].nonProdID === "vacation") ? "0.00/8.00" : "";

      weekDays.forEach((day) => {
        if(data[item].details[day].id != null){
          payloadToDelete.push(data[item].details[day].id)
        }
      })

      return (

        <div key={key+item} onClick={_this._onRowClick.bind(_this, item)}>
        <div>
          <div>{data[item].isProductive ? data[item].rfcNumber : data[item].nonProdName}</div>
          <div className={data[item].hasUtilizedMore ? "red-bottom" : ""}>{data[item].isProductive && data[item].utilized}</div>
        </div>
        <div className="ts-table-week">

          <div></div>
          <div></div>
          {moment(userCreatedAt).isSameOrBefore(moment(weekSelected).weekday(1)) ? <div title={tooltip}>
            { _this.props.userID === _this.props.userSelected.value && allowEdit ?
              <input key={data[item].details["Mon"].hours}
                defaultValue={data[item].details["Mon"] && data[item].details["Mon"].hours}
                onBlur={_this._autosave.bind(this, "Mon", item, data[item])}/>
              : data[item].details["Mon"] && data[item].details["Mon"].hours
            }
          </div> : <div style={{backgroundColor: "#F9F9F9"}}></div>}
          {moment(userCreatedAt).isSameOrBefore(moment(weekSelected).weekday(2))  ? <div title={tooltip}>
            {  _this.props.userID === _this.props.userSelected.value  && allowEdit?
              <input  key={data[item].details["Tue"].hours}
                defaultValue={data[item].details["Tue"] && data[item].details["Tue"].hours}
                onBlur={_this._autosave.bind(this, "Tue", item, data[item])}/>
              :data[item].details["Tue"] && data[item].details["Tue"].hours
            }
          </div> : <div style={{backgroundColor: "#F9F9F9"}}></div>}
          {moment(userCreatedAt).isSameOrBefore(moment(weekSelected).weekday(3))  ? <div title={tooltip}>
            {  _this.props.userID === _this.props.userSelected.value  && allowEdit?
              <input  key={data[item].details["Wed"].hours}
                defaultValue={data[item].details["Wed"] && data[item].details["Wed"].hours}
                onBlur={_this._autosave.bind(this, "Wed", item, data[item])}/>
              :data[item].details["Wed"] && data[item].details["Wed"].hours
            }
          </div> : <div style={{backgroundColor: "#F9F9F9"}}></div>}
          {moment(userCreatedAt).isSameOrBefore(moment(weekSelected).weekday(4))  ? <div title={tooltip}>
            {  _this.props.userID === _this.props.userSelected.value  && allowEdit?
              <input  key={data[item].details["Thu"].hours}
                defaultValue={data[item].details["Thu"] && data[item].details["Thu"].hours}
                onBlur={_this._autosave.bind(this, "Thu", item, data[item])}/>
              :data[item].details["Thu"] && data[item].details["Thu"].hours
            }
          </div> : <div style={{backgroundColor: "#F9F9F9"}}></div>}
          {moment(userCreatedAt).isSameOrBefore(moment(weekSelected).weekday(5))  ? <div title={tooltip}>
            {  _this.props.userID === _this.props.userSelected.value  && allowEdit?
              <input  key={data[item].details["Fri"].hours}
                defaultValue={data[item].details["Fri"] && data[item].details["Fri"].hours}
                onBlur={_this._autosave.bind(this, "Fri", item, data[item])}/>
              :data[item].details["Fri"] && data[item].details["Fri"].hours
            }
          </div> : <div style={{backgroundColor: "#F9F9F9"}}></div>}
          <div className="ts-alltotal">{data[item].rowtotal.toFixed(2)}</div>
        </div>
        <div>
        {_this.props.userID === _this.props.userSelected.value && allowEdit &&
          <span className="menu-caret" onClick={_this._subMenu.bind(_this, item, index)}></span>}
        </div>

        {_this.state.toggle &&
        _this.state.showMenuID == item &&
        _this.props.userID === _this.props.userSelected.value &&
        allowEdit?
          <div className="dropdown">
             <ul className="dropdown-menu submenu">
               <li ><a href="#" onClick={_this._deleteTimesheet.bind(_this, payloadToDelete, data[item].isProductive)}>Delete </a>
              </li>
            </ul>
          </div> : ""}

        </div>
      )
    })
  }

  _onSubmit() {
    this.props.onTimesheetSubmit(this.props.weekSelected, this.props.userSelected);
  }

  render () {
    let {newdata, navSelected, navSubSelected, newTaskSelected} = this.state,
    {
      userRole,
      userID,
      userSelected,
      taskInprogress,
      taskDelivered,
      taskNonprod,
      coltotal,
      alltotal,
      isfetching,
      weekSelected,
      profile,
      timesheetdata
    } = this.props,
    newTotal = parseFloat(newdata.mon) + parseFloat(newdata.tue) + parseFloat(newdata.wed) + parseFloat(newdata.thu) + parseFloat(newdata.fri),
    prev3weeks = moment().weekday(-1-21),
    tooltip = newTaskSelected === "" ? "Please Add a task" : (newTaskSelected.value === "holiday" || newTaskSelected.value === "vacation") ? "0.00/8.00" : "" ,
    allowAddTask =  (_.includes(userRole, 'DEVELOPER') ||
      _.includes(userRole, 'LEAD')) &&
      userID === userSelected.value &&
      ((moment(prev3weeks).isBefore(moment(weekSelected).weekday(1)) || !this.props.isSubmitted || Object.keys(timesheetdata).length <= 0) ),
    userCreatedAt = moment(userSelected.created_at).format('YYYY-MM-DD');
    return (
      <Col xs={12} className="timesheet-detail">
        <TSTableHeader allowAddTask={allowAddTask}/>
          { allowAddTask && <div className="newts-table-body">

            <AddTaskDropdown
              taskInprogress={taskInprogress}
              taskDelivered={taskDelivered}
              taskNonprod={taskNonprod}
              newTaskSelected={newTaskSelected}
              timesheetdata={timesheetdata}
              error={this.state.error}
              onTaskSelect={this.onTaskSelect.bind(this)}
              />

            <div className="ts-table-week">
              <div></div>
              <div></div>
              {moment(userCreatedAt).isSameOrBefore(moment(weekSelected).weekday(1)) ? <div title={tooltip}>
                <input key={isfetching}
                  ref={(mon) => {this.mon = mon}} onFocus={() => {this.mon.select()}}
                  value={newdata.mon}
                  type="text" placeholder="0.00"
                  onChange={this.onNewTSChange.bind(this, "mon")} />
              </div> : <div style={{backgroundColor: "#F9F9F9"}}></div>}
              {moment(userCreatedAt).isSameOrBefore(moment(weekSelected).weekday(2)) ? <div title={tooltip}>
                <input key={isfetching}
                  value={newdata.tue}
                  ref={(tue) => {this.tue = tue}} onFocus={() => {this.tue.select()}}
                  type="text"
                  placeholder="0.00"
                  onChange={this.onNewTSChange.bind(this, "tue")}/>
              </div> : <div style={{backgroundColor: "#F9F9F9"}}></div>}
              {moment(userCreatedAt).isSameOrBefore(moment(weekSelected).weekday(3)) ? <div title={tooltip}>
                <input key={isfetching}
                  value={newdata.wed}
                  ref={(wed) => {this.wed = wed}} onFocus={() => {this.wed.select()}}
                  type="text"
                  placeholder="0.00"
                  onChange={this.onNewTSChange.bind(this, "wed")}/>
              </div> : <div style={{backgroundColor: "#F9F9F9"}}></div>}
              {moment(userCreatedAt).isSameOrBefore(moment(weekSelected).weekday(4)) ? <div title={tooltip}>
                <input key={isfetching}
                  value={newdata.thu}
                  ref={(thu) => {this.thu = thu}} onFocus={() => {this.thu.select()}}
                  type="text"
                  placeholder="0.00"
                  onChange={this.onNewTSChange.bind(this, "thu")}/>
              </div> : <div style={{backgroundColor: "#F9F9F9"}}></div>}
              {moment(userCreatedAt).isSameOrBefore(moment(weekSelected).weekday(5)) ? <div title={tooltip}>
                <input key={isfetching}
                  value={newdata.fri}
                  ref={(fri) => {this.fri = fri}} onFocus={() => {this.fri.select()}}
                  type="text"
                  placeholder="0.00"
                  onChange={this.onNewTSChange.bind(this, "fri")}/>
              </div> : <div style={{backgroundColor: "#F9F9F9"}}></div>}
              <div className="ts-alltotal">{newTotal.toFixed(2)}</div>
            </div>
            <div className="add-icon" ><div onClick={this.submitNewTime.bind(this)}><span></span></div></div>
          </div>}
          <div className="oldts-table-body">
            {this.getOlderTimesheetData()}
          </div>
          {this.props.timesheetdata && Object.keys(this.props.timesheetdata).length > 0 && <div className="ts-total-column">
            <div >
              <div>Total</div>
              <div></div>
            </div>
            <div className="ts-table-week">

              <div></div>
              <div></div>
              {moment(userCreatedAt).isSameOrBefore(moment(weekSelected).weekday(1)) ?
                <div className={this.props.timevalidstatus.invalidDays.indexOf(1) >= 0 ? 'red-border' : ""}>{coltotal ? coltotal.Mon.toFixed(2) : 0}</div>
                 : <div style={{backgroundColor: "#F9F9F9"}}></div>}
              {moment(userCreatedAt).isSameOrBefore(moment(weekSelected).weekday(2)) ?
                <div className={this.props.timevalidstatus.invalidDays.indexOf(2) >= 0 ? 'red-border' : ""}>{coltotal ? coltotal.Tue.toFixed(2) : 0}</div>
                : <div style={{backgroundColor: "#F9F9F9"}}></div>}
              {moment(userCreatedAt).isSameOrBefore(moment(weekSelected).weekday(3)) ?
                <div className={this.props.timevalidstatus.invalidDays.indexOf(3) >= 0 ? 'red-border' : ""}>{coltotal ? coltotal.Wed.toFixed(2) : 0}</div>
                : <div style={{backgroundColor: "#F9F9F9"}}></div>}
              {moment(userCreatedAt).isSameOrBefore(moment(weekSelected).weekday(4)) ?
                <div className={this.props.timevalidstatus.invalidDays.indexOf(4) >= 0 ? 'red-border' : ""}>{coltotal ? coltotal.Thu.toFixed(2) : 0}</div>
                : <div style={{backgroundColor: "#F9F9F9"}}></div>}
              {moment(userCreatedAt).isSameOrBefore(moment(weekSelected).weekday(5)) ?
                <div className={this.props.timevalidstatus.invalidDays.indexOf(5) >= 0 ? 'red-border' : ""}>{coltotal ? coltotal.Fri.toFixed(2) : 0}</div>
                : <div style={{backgroundColor: "#F9F9F9"}}></div>}
              <div>{alltotal ? alltotal : 0}</div>
            </div>
            <div></div>
          </div>}
          <div style={{textAlign: "right"}}>
            <span style={this.props.timevalidstatus && this.props.timevalidstatus.status ? {color: "green", textAlign: "right"} : {color: "red", textAlign: "right"}}>
              {this.state.genericError || (this.props.timevalidstatus && this.props.timevalidstatus.message)}
            </span>
            {Object.keys(this.props.timesheetdata).length > 0 && allowAddTask &&
              <button className="ts-submit"
                style={{color: "#FFFFFF", cursor: "pointer"}}
                onClick={this._onSubmit.bind(this)}
                >Submit</button>}
          </div>
      </Col>
    )
  }
}

function mapStateToProps(state) {
  return {
    taskInprogress: state.timesheet.taskInprogress,
    taskDelivered: state.timesheet.taskDelivered,
    taskNonprod: state.timesheet.taskNonprod,
    userRole: state.auth.userRole,
    userID: state.auth.userID,
    timesheetdata: state.timesheet.timesheetdata,
    weekSelected: state.timesheet.weekSelected,
    userSelected: state.timesheet.userSelected,
    profile: state.user.profile,
    isfetching: state.generic.isfetching,
    coltotal: state.timesheet.coltotal,
    alltotal: state.timesheet.alltotal,
    isSubmitted: state.timesheet.isSubmitted,
    timevalidstatus: state.timesheet.timevalidstatus
  }
}

let actions = {
  addNewTime,
  deleteTimesheet,
  updateTimesheet,
  onTimesheetSubmit,
  addOldTimesheet
}

export default connect(mapStateToProps, actions)(TimesheetDetail);
