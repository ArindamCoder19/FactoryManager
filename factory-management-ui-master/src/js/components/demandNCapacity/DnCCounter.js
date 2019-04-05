import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  LIST_DNC_COUNTER
} from '../../util/constants';

class DnCCounter extends Component {
  getCounters() {
    let props = this.props,
    width = 100/LIST_DNC_COUNTER.length;
    return LIST_DNC_COUNTER.map((item, id) => {
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
    developers: state.dnc.dncData.developers,
    leads: state.dnc.dncData.leads,
    taskInProgress: state.dnc.dncData.taskInProgress
  };
}

export default connect(mapStateToProps, null)(DnCCounter);
