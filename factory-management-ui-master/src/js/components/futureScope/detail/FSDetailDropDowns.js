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
  constructor(props) {
    super(props);

    let taskDetail = props.taskDetail,
    statusSelected = "",
    prioritySelected = "",
    wricefSelected = "",
    complexSelected = "";

    TASK_STATUS.forEach((item) => {
      if(taskDetail.status && item.id == taskDetail.status){
        statusSelected = {name: item.name, id: item.id}
      }
    });

    TASK_PRIORITY.forEach((item) => {
      if(taskDetail.priority && item.id == taskDetail.priority){
        prioritySelected = {name: item.name, id: item.id}
      }
    });

    TASK_WRICEF.forEach((item) => {
      if(taskDetail.wricefType && item.id == taskDetail.wricefType){
        wricefSelected = {name: item.name, id: item.id}
      }
    });

    TASK_COMPLEXITY.forEach((item) => {
      if(taskDetail.complexity && item.id == taskDetail.complexity){
        complexSelected = {name: item.name, id: item.id}
      }
    });
    this.state = {
      status: TASK_STATUS,
      priority: TASK_PRIORITY,
      wricef: TASK_WRICEF,
      complex: TASK_COMPLEXITY,
      prioritySelected: prioritySelected != "" ? prioritySelected : TASK_PRIORITY[0],
      statusSelected: statusSelected != "" ? statusSelected : TASK_STATUS[0],
      wricefSelected: wricefSelected != "" ? wricefSelected : TASK_WRICEF[0],
      complexSelected: complexSelected != "" ? complexSelected : TASK_COMPLEXITY[0]
    }
  }

  _updateTask(payload) {
    let args = {
      filter: this.props.filter,
      taskID: this.props.taskDetail._id,
      payload: payload,
      flag: true  //TO_DO
    };
    // this.props.isFetching();
    this.props.taskUpdate(args);
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

            {_.includes(this.props.userInfo.userRole, 'GUEST') ?

              <button id="dropdown-basic-1"
                role="button"
                type="button"
                className="dropdown-toggle btn btn-default btn-noedit">
                {"PRIORTIY: "+this.state.prioritySelected.name}
              </button>

              : <Dropdown
                data={this.state.priority}
                selected={this.state.prioritySelected.name}
                title="PRIORTIY: "
                select={this._onPrioritySelect.bind(this)}
              />}

          </div>
          <div className="yellow-dropdown">

            {_.includes(this.props.userInfo.userRole, 'GUEST') ?

              <button id="dropdown-basic-1"
                role="button"
                type="button"
                className="dropdown-toggle btn btn-default btn-noedit">
                {"STATUS: "+this.state.statusSelected.name}
              </button>

              :

              <Dropdown
                data={this.state.status}
                selected={this.state.statusSelected.name}
                title="STATUS: "
                select={this._onStatusSelect.bind(this)}
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
                {"WRICEF TYPE: "+this.state.wricefSelected.name}
              </button>

              :

              <Dropdown
                data={this.state.wricef}
                selected={this.state.wricefSelected.name}
                title="WRICEF TYPE: "
                select={this._onWricefSelect.bind(this)}
                />
          }

          </div>
          <div className="orange-dropdown">
            {_.includes(this.props.userInfo.userRole, 'GUEST') ?

              <button id="dropdown-basic-1"
                role="button"
                type="button"
                className="dropdown-toggle btn btn-default btn-noedit">
                {"COMPLEXITY: "+this.state.complexSelected.name}
              </button>

              :

              <Dropdown
                data={this.state.complex}
                selected={this.state.complexSelected.name}
                title="COMPLEXITY: "
                select={this._onComplexSelect.bind(this)}
                />
            }

          </div>
        </Row>
      </div>
    )
  }
}

export default connect(null, actions)(TaskDetailDropDowns);
