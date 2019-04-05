import React from 'react';
import { Row, Col } from 'react-bootstrap';
import moment from 'moment';
import { connect } from 'react-redux';
import _ from 'lodash';

import {
  currentPage,
  getTimesheetInitialData } from '../../actions/general';
import {
  setWeekData,
  closeTSPopup,
  addPrevTimes } from '../../actions/timesheetActions';

import TimesheetHeader from './TimesheetHeader';
import TimesheetSummary from './TimesheetSummary';
import TimesheetDetail from './TimesheetDetail';
import Popup from './Popup';
import BackdropLoader from '../general/BackdropLoader';

class Timesheet extends React.Component {

  componentWillMount() {
    this.props.currentPage("timesheet");

    this.props.setWeekData(moment().weekday(5));

    let userDetails = {
      userRole: this.props.userRole,
      userID: this.props.userID //Logged-in user
     },
     showUserTasks = false,
     showOnUserChange = false,
     showUserList = false;

    if(_.includes(this.props.userRole, 'DEVELOPER')){
      showUserTasks = true;
      showOnUserChange = true;
      showUserList = false;
    } else {
      showUserTasks = _.includes(this.props.userRole, 'LEAD');
      showUserList = true;
      showOnUserChange = false;
    }

    this.props.getTimesheetInitialData(userDetails, showUserTasks, showOnUserChange, showUserList);
  }

  _onAddPrevTasks(checkedList) {
    //Form Promise payload
    let payload = [],
    _this = this;
    payload = checkedList.map((item) => {
      let dates = {};
      dates["Mon"] = {
        date: moment(_this.props.weekSelected).startOf("week").weekday(1).format("YYYY-MM-DD"),
        hours: "1.00"
      }
      dates["Tue"] = {
        date: moment(_this.props.weekSelected).startOf("week").weekday(2).format("YYYY-MM-DD"),
        hours: "0.00"
      }
      dates["Wed"] = {
        date: moment(_this.props.weekSelected).startOf("week").weekday(3).format("YYYY-MM-DD"),
        hours: "0.00"
      }
      dates["Thu"] = {
        date: moment(_this.props.weekSelected).startOf("week").weekday(4).format("YYYY-MM-DD"),
        hours: "0.00"
      }
      dates["Fri"] = {
        date: moment(_this.props.weekSelected).startOf("week").weekday(5).format("YYYY-MM-DD"),
        hours: "0.00"
      }

      let payload = {};
      if(item.data.isProductive){
        payload = {
          taskId: item.id,
          dates: dates,
          user: _this.props.userSelected,
          weekSelected: _this.props.weekSelected,
          isProductive:item.data.isProductive
        };
      }else {
        payload = {
          type: item.id == "vacation" || item.id == "holiday" ? item.id : "non-productive",
          subType: item.id == "vacation" || item.id == "holiday" ? "" : item.id,
          dates: dates,
          user: _this.props.userSelected,
          weekSelected: _this.props.weekSelected,
          isProductive: item.data.isProductive
        };
      }

      return payload;
    });
    payload.length > 0 && this.props.addPrevTimes(payload);
  }
  render () {
    if(this.props.initialdataload)
      return (
        <div className="timesheet-container">
          <Col className="summary" xs={12}>
            <TimesheetHeader />
            <TimesheetSummary />
            <TimesheetDetail key={this.props.weekSelected}/>
            <Popup
              key={this.props.showprevdata}
              show={this.props.showprevdata}
              prevweekproddata={this.props.prevweekproddata}
              prevweeknonproddata={this.props.prevweeknonproddata}
              timesheetdata={this.props.timesheetdata}
              onAddPrevTasks={this._onAddPrevTasks.bind(this)}
              close={this.props.closeTSPopup.bind(this)}/>
          </Col>
        </div>
      )
    else {
      return <BackdropLoader show={true}/>
    }
  }
}

function mapStateToProps(state) {
  return { userID: state.auth.userID,
  userRole: state.auth.userRole,
  userSelected: state.timesheet.userSelected,
  timesheetdata: state.timesheet.timesheetdata,
  weekSelected: state.timesheet.weekSelected,
  prevweekproddata: state.timesheet.prevweekproddata,
  prevweeknonproddata: state.timesheet.prevweeknonproddata,
  showprevdata: state.timesheet.showprevdata,
  initialdataload: state.generic.initialdataload };
}

let actions = {
  currentPage,
  setWeekData,
  closeTSPopup,
  addPrevTimes,
  getTimesheetInitialData
};

export default connect(mapStateToProps, actions)(Timesheet);
