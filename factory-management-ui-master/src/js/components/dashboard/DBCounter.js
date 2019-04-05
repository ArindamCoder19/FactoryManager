import React from 'react';
import { connect } from 'react-redux';

import {
  LIST_MANAGER_COUNTER,
  LIST_LEAD_COUNTER,
  LIST_DEVELOPER_COUNTER
} from '../../util/constants';

class DBCounter extends React.Component {
  constructor(props) {
    super(props);
    let list = [];
    if(_.intersection(props.userRole, ['ADMIN', 'MANAGER', 'GUEST']).length > 0) {
      list = LIST_MANAGER_COUNTER
    }else if(_.includes(props.userRole, 'LEAD')){
      list = LIST_LEAD_COUNTER
    }else if(_.includes(props.userRole, 'DEVELOPER')){
      list = LIST_DEVELOPER_COUNTER
    }

    this.state = {
      list: list
    }
  }
  getCounters() {
    let props = this.props,
    width = 100/this.state.list.length;
    return this.state.list.map((item, id) => {
      return <div key={id} style={{width: (width-2)+'%'}}>
        <div><span>-</span><span>{props[item.value]}</span><span>-</span></div>
        <div>{item.label}</div>
      </div>
    })
  }
  render () {
    return (
      <div className="db-counter">

        {this.getCounters()}

      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    userRole: state.auth.userRole,
    dueToday: state.dashboard.dashboardData.dueToday,
    dueWeek: state.dashboard.dashboardData.dueWeek,
    overDue: state.dashboard.dashboardData.overDue,
    taskCompleted: state.dashboard.dashboardData.taskCompleted,
    openNotifications: state.dashboard.dashboardData.openNotifications,
    taskILead: state.dashboard.dashboardData.taskPending,
  };
}

export default connect(mapStateToProps, null)(DBCounter);
