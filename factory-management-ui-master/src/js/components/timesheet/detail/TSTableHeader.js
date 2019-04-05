import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import moment from 'moment';
import {CSVLink} from 'react-csv';

import { populatePreviousTasks } from '../../../actions/timesheetActions';

class TSTableHeader extends React.Component {

  _onPopulateFromPrevWeek() {
    let prevWeek = moment(this.props.weekSelected).weekday(-2);
    this.props.populatePreviousTasks(this.props.userSelected, prevWeek);
  }

  render () {
    let {userRole, userID, userSelected, weekSelected, allowAddTask} = this.props,
    week = moment(this.props.weekSelected).weeks();

    return (
        <div className="ts-table-header">
          <div>
            <div>
              <div>Tasks</div>
              { allowAddTask && <div>|</div>}
              { allowAddTask && <div style={{color: "#28AFB0", cursor: "pointer"}} onClick={this._onPopulateFromPrevWeek.bind(this)}>Populate</div>}
            </div>
            <div>Hrs. Utilized</div>
          </div>
          <div className="ts-table-week">

            <div>Sat</div>
            <div>Sun</div>
            <div>{moment(weekSelected).weekday(1).format("DD")+ " Mon"}</div>
            <div>{moment(weekSelected).weekday(2).format("DD")+ " Tue"}</div>
            <div>{moment(weekSelected).weekday(3).format("DD")+ " Wed"}</div>
            <div>{moment(weekSelected).weekday(4).format("DD")+ " Thu"}</div>
            <div>{moment(weekSelected).weekday(5).format("DD")+ " Fri"}</div>
            <div>Total</div>
          </div>
          <div>
            {this.props.downloadData.length > 0 && _.intersection(this.props.userRole, ['ADMIN', 'MANAGER']).length > 0 &&
              <div className="download-logo"><CSVLink data={this.props.downloadData} filename={"TS_"+userSelected.label.replace(" ","")+"_"+week+".csv"}>Download</CSVLink></div>}
          </div>
        </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    userRole: state.auth.userRole,
    userID: state.auth.userID,
    userSelected: state.timesheet.userSelected,
    weekSelected: state.timesheet.weekSelected,
    downloadData: state.timesheet.downloadData
  }
}

export default connect(mapStateToProps, {populatePreviousTasks})(TSTableHeader);
