import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import moment from 'moment';
import Select from 'react-select';
import _ from 'lodash';

import {
  setWeekData,
  onUserChange } from '../../actions/timesheetActions';

import WeekDropdown from './header/WeekDropdown';

class TimesheetHeader extends React.Component {
  onPaginate(state) {
    let showSubmittedTS = (this.props.userSelected.value == this.props.profile._id) ? false : true;
    switch (state) {
      case "prev":{
        this.props.setWeekData(moment(this.props.weekSelected).weekday(-2));
        this.props.onUserChange(this.props.userSelected, moment(this.props.weekSelected).weekday(-2), showSubmittedTS);
        break;
      }
      case "next":{
        this.props.setWeekData(moment(this.props.weekSelected).weekday(5+7));
        this.props.onUserChange(this.props.userSelected, moment(this.props.weekSelected).weekday(5+7), showSubmittedTS);
        break;
      }
      default: console.log("Week Paginate error");
    }
  }

  onUserChange(key) {
    // logged-in user's timesheet to be editable
    let showSubmittedTS = (key.value == this.props.profile._id) ? false : true;
    let weekSelected = showSubmittedTS ? moment().weekday(5) : this.props.weekSelected;
    this.props.onUserChange(key, weekSelected, showSubmittedTS);
  }
  render () {
    return (
      <div className="timesheet-header">
        <Col xs={4}>
          <label>TIMESHEET</label>
        </Col>
        <Col xs={4} className="week-DD-container">
          <div className="left-paginate" onClick={this.onPaginate.bind(this, "prev")}>
            <span className="caret"></span>
          </div>
          <WeekDropdown userSelected={this.props.userSelected}/>
          <div className="right-paginate" onClick={this.onPaginate.bind(this, "next")}>
            <span className="caret"></span>
          </div>
          <div className="week-number">
            <label>WEEK {moment(this.props.weekSelected).weeks()}</label>
          </div>
        </Col>
        <Col xs={4}>
          <div>
            {!_.includes(this.props.userRole, 'DEVELOPER') && <Select
              name="form-field-name"
              value={this.props.userSelected}
              className="ts-search"
              clearable={false}
              options={this.props.userlist}
              onChange={this.onUserChange.bind(this)}
              />}
          </div>
        </Col>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return { weekSelected: state.timesheet.weekSelected,
  userSelected: state.timesheet.userSelected,
  userlist: state.timesheet.userlist,
  profile: state.user.profile,
  userRole: state.auth.userRole};
}

let actions = {
  setWeekData,
  onUserChange
};

export default connect(mapStateToProps, actions)(TimesheetHeader);
