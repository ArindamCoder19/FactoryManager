import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import _ from 'lodash';

import Dropdown from '../../general/dropdown/Dropdown';
import * as actions from '../../../actions/taskActions';
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

            {_.includes(this.props.userInfo.userRole, 'GUEST') ?

              <button id="dropdown-basic-1"
                role="button"
                type="button"
                className="dropdown-toggle btn btn-default btn-noedit">
                {"PRIORTIY: "+this.props.prioritySelected.name}
              </button>

              : <Dropdown
                data={TASK_PRIORITY}
                selected={this.props.prioritySelected.name}
                title="PRIORTIY: "
                select={this.props.onDDChange.bind(this, "prioritySelected", "priority")}
              />}

          </div>
          <div className="yellow-dropdown">

            {_.includes(this.props.userInfo.userRole, 'GUEST') ?

              <button id="dropdown-basic-1"
                role="button"
                type="button"
                className="dropdown-toggle btn btn-default btn-noedit">
                {"STATUS: "+this.props.statusSelected.name}
              </button>

              :

              <Dropdown
                data={TASK_STATUS}
                selected={this.props.statusSelected.name}
                title="STATUS: "
                select={this.props.onDDChange.bind(this, "statusSelected", "status")}
                />}


          </div>
        </Row>
        <Row>
          <div className="blue-dropdown">
            {_.includes(this.props.userInfo.userRole, 'GUEST') ?

              <button id="dropdown-basic-1"
                role="button"
                type="button"
                className="dropdown-toggle btn btn-default btn-noedit">
                {"WRICEF TYPE: "+this.props.wricefSelected.name}
              </button>

              :

              <Dropdown
                data={TASK_WRICEF}
                selected={this.props.wricefSelected.name}
                title="WRICEF TYPE: "
                select={this.props.onDDChange.bind(this, "wricefSelected", "wricefType")}
                />
          }

          </div>
          <div className="orange-dropdown">
            {_.includes(this.props.userInfo.userRole, 'GUEST') ?

              <button id="dropdown-basic-1"
                role="button"
                type="button"
                className="dropdown-toggle btn btn-default btn-noedit">
                {"COMPLEXITY: "+this.props.complexSelected.name}
              </button>

              :

              <Dropdown
                data={TASK_COMPLEXITY}
                selected={this.props.complexSelected.name}
                title="COMPLEXITY: "
                select={this.props.onDDChange.bind(this, "complexSelected", "complexity")}
                />
            }

          </div>
        </Row>
      </div>
    )
  }
}

export default connect(null, actions)(TaskDetailDropDowns);
