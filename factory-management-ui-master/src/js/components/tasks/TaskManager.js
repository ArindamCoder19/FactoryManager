import React, { Component } from 'react';
import { connect } from 'react-redux';

import TasksSummary from './TasksSummary';
import TaskDetail from './TaskDetail';
import CreateNewTaskDetail from './CreateNewTaskDetail';
import { currentPage, getTaskInitialData, isFetching } from '../../actions/general';
import { filterTasks, setTaskErrorMessage } from '../../actions/taskActions';
import BackdropLoader from '../general/BackdropLoader';

const getFilterData = (role) => {
  let filter1 = 'ALL';

  if(_.includes(role, 'LEAD')){
    filter1 = "lead" //My Tasks
  }else if (_.includes(role, 'MANAGER')){
    filter1 = "ALL" //ALL Tasks
  }else if(_.includes(role, 'ADMIN') || _.includes(role, 'GUEST')){
    filter1 = "ALL"
  }else {
    filter1 = "assignedTo"; //My Tasks
  }

  return {
    FILTER1: filter1,
    FILTER2: "incompleted", //Initialize to In-progress tasks
    FILTER3: "ALL",
    FILTER4: "ALL",
    FILTER5: "ALL",
    FILTER6: "ALL",
    FILTER7: "ALL",
    FILTER8: "ALL"
  };
}

class TaskManager extends Component {

  componentWillMount() {
    this.props.currentPage("tasks");
    this.props.setTaskErrorMessage({fsi: "", mandatory: ""});
    this.props.getTaskInitialData(this.props.userID, getFilterData(this.props.userRole));
  }

  render() {
    if(this.props.initialdataload)
      return (
        <div className="tasks-wrapper">
          <TasksSummary />
          {!this.props.newtask && this.props.showtask != null ? <TaskDetail key={this.props.showtask}/> : ""}
          {this.props.newtask ? <CreateNewTaskDetail /> : ""}
        </div>
      )
    else
      return <BackdropLoader show={true}/>
  }
}

function mapStateToProps(state) {
  return { showtask: state.task.showtask,
    initialdataload: state.generic.initialdataload,
    newtask: state.task.newtask,
    userID: state.auth.userID,
    userRole: state.auth.userRole};
}

export default connect(mapStateToProps, {currentPage, filterTasks, isFetching, getTaskInitialData, setTaskErrorMessage})(TaskManager);
