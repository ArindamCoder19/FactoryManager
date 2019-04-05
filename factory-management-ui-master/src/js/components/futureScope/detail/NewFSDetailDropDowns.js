import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';

import Dropdown from '../../general/dropdown/Dropdown';
import * as actions from '../../../actions/taskActions';
import {
  TASK_PRIORITY,
  TASK_COMPLEXITY,
  TASK_WRICEF,
  TASK_STATUS
} from '../../../util/constants';

class TaskDetailDropDowns extends Component {
  constructor(props) {
    super(props);

    this.state = {
      status: TASK_STATUS,
      priority: TASK_PRIORITY,
      wricef: TASK_WRICEF,
      complex: TASK_COMPLEXITY,
      prioritySelected: TASK_PRIORITY[0],
      statusSelected: TASK_STATUS[0],
      wricefSelected: TASK_WRICEF[0],
      complexSelected: TASK_COMPLEXITY[0]
    }

    
  }

  _updateTask(payload) {
    let data = {};
    for (let j in this.props.newtaskdata){
      data[j] = this.props.newtaskdata[j]
    }
    for (let i in payload){
      data[i] = payload[i];
    }
    // this.props.isFetching();
    this.props.newtaskDataChange(data);
  }


  _onPrioritySelect(priority, event) {
    this._updateTask({priority: priority.id})
    this.setState({
      prioritySelected: priority
    })
  }

  _onComplexSelect(complex, event) {
    this._updateTask({complexity: complex.id})
    this.setState({
      complexSelected: complex
    })
  }

  _onStatusSelect(status, event) {
    this._updateTask({status: status.id})
    this.setState({
      statusSelected: status
    })
  }

  _onWricefSelect(wricef, event) {
    this._updateTask({wricefType: wricef.id})
    this.setState({
      wricefSelected: wricef
    })
  }

  render() {
    return (
      <div className="td-dropdowns">
        <Row>
          <div className="navy-dropdown">
            <Dropdown
              data={this.state.priority}
              selected={this.state.prioritySelected.name}
              title="PRIORTIY: "
              select={this._onPrioritySelect.bind(this)}
              />

          </div>
          <div className="yellow-dropdown">
            <Dropdown
              data={this.state.status}
              selected={this.state.statusSelected.name}
              title="STATUS: "
              select={this._onStatusSelect.bind(this)}
              />

          </div>
        </Row>
        <Row>
          <div className="blue-dropdown">
            <Dropdown
              data={this.state.wricef}
              selected={this.state.wricefSelected.name}
              title="WRICEF TYPE: "
              select={this._onWricefSelect.bind(this)}
              />

          </div>
          <div className="orange-dropdown">
            <Dropdown
              data={this.state.complex}
              selected={this.state.complexSelected.name}
              title="COMPLEXITY: "
              select={this._onComplexSelect.bind(this)}
              />

          </div>
        </Row>
      </div>
    )
  }
}

export default connect(null, actions)(TaskDetailDropDowns);
