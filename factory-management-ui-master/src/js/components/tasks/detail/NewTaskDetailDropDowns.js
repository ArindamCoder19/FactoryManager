import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';

import Dropdown from '../../general/dropdown/Dropdown';
import {
  TASK_PRIORITY,
  TASK_COMPLEXITY,
  TASK_WRICEF,
  TASK_STATUS
} from '../../../util/constants';

class TaskDetailDropDowns extends Component {

  render() {
    return (
      <div className="td-dropdowns">
        <Row>
          <div className="navy-dropdown">
            <Dropdown
              data={TASK_PRIORITY}
              selected={this.props.prioritySelected.name}
              title="PRIORTIY: "
              select={this.props.onDDChange.bind(this, "prioritySelected", "priority")}
              />

          </div>
          <div className="yellow-dropdown">
            <Dropdown
              data={TASK_STATUS}
              selected={this.props.statusSelected.name}
              title="STATUS: "
              select={this.props.onDDChange.bind(this, "statusSelected", "status")}
              />

          </div>
        </Row>
        <Row>
          <div className="blue-dropdown">
            <Dropdown
              data={TASK_WRICEF}
              selected={this.props.wricefSelected.name}
              title="WRICEF TYPE: "
              select={this.props.onDDChange.bind(this, "wricefSelected", "wricefType")}
              />

          </div>
          <div className="orange-dropdown">
            <Dropdown
              data={TASK_COMPLEXITY}
              selected={this.props.complexSelected.name}
              title="COMPLEXITY: "
              select={this.props.onDDChange.bind(this, "complexSelected", "complexity")}
              />

          </div>
        </Row>
      </div>
    )
  }
}

export default TaskDetailDropDowns;
