import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';

class TimesheetSummary extends React.Component {
  getProductiveTasksCount() {
    let count = 0, i,
      data = this.props.timesheetdata;
    for(let i in data) {
      data[i].isProductive ? count++ : "";
    }

    return count;
  }
  render () {
    return (
      <Col xs={12} className="timesheet-summary">
          <div>
            <div className="user-img">
              <h7>{this.props.userSelected && this.props.userSelected.sn}</h7>
            </div>
            <h7>{this.props.userSelected && this.props.userSelected.label}</h7>
          </div>
          <div>
            <div><h2> {this.getProductiveTasksCount()} </h2></div>
            <h7>Tasks Worked</h7>
          </div>
          <div>
            <div><h2> {this.props.alltotal} </h2></div>
            <h7>Total Hours</h7>
          </div>

      </Col>
    )
  }
}

function mapStateToProps(state) {
  return {
  timesheetdata: state.timesheet.timesheetdata,
  alltotal: state.timesheet.alltotal,
  userSelected: state.timesheet.userSelected};
}

export default connect(mapStateToProps, null)(TimesheetSummary);
