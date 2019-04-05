import React, { Component } from 'react';
import { Route, Router, Switch } from "react-router-dom";
import { connect } from 'react-redux';
import _ from 'lodash';
import Loadable from 'react-loadable';

import browserHistory from './general/BrowserHistory';

import {
  closeModal,
  addTaskItems,
  closeModalError,
  deleteModalItem } from '../actions/general';

import EditableItems from './general/EditableItems';
import BackdropLoader from './general/BackdropLoader';

/**
 * Parent: AppLayout
 * Desc: Page Content => Search Bar
 *                          +
 *                      Routes (Dashboard, Tasks, Timesheet, Vacation & Training Plan, System Improvements, Users)
 */

const Loading = () => <span></span>;

const Dashboard = Loadable({
  loader: () => import('./dashboard/DashboardManager'),
  loading: Loading,
});

const TaskManager = Loadable({
  loader: () => import('./tasks/TaskManager'),
  loading: Loading,
});

const Timesheet = Loadable({
  loader: () => import('./timesheet/Timesheet'),
  loading: Loading,
});

const UserManager = Loadable({
  loader: () => import('./user/UserManager'),
  loading: Loading,
});

const UserRequest = Loadable({
  loader: () => import('./user/userRequest/UserReqManager'),
  loading: Loading,
});

const FutureScopeManager = Loadable({
  loader: () => import('./futureScope/FutureScopeManager'),
  loading: Loading,
});

const DnCManager = Loadable({
  loader: () => import('./demandNCapacity/DnCManager'),
  loading: Loading,
});

const ProductivityManager = Loadable({
  loader: () => import('./productivity/ProductivityManager'),
  loading: Loading,
});

class PageRoutes extends Component {
  _closeModal() {
    this.props.closeModal();
  }

  _addTaskItems(value) {
    this.props.addTaskItems(value, this.props.modalInfo);
  }

  _closeError() {
    this.props.closeModalError();
  }

  _deleteModalItem(id) {
    this.props.deleteModalItem(id, this.props.modalInfo);
  }

  render() {
     return (
       <div className="content-wrapper">
        <Route exact path="/dashboard" component={Dashboard} />
        <Route exact path="/tasks" component={TaskManager} />
        <Route exact path="/timesheet" component={Timesheet} />
        <Route exact path="/users" component={UserManager} />
        <Route exact path="/users/userReq" component={UserRequest} />
        <Route exact path="/future-scope" component={FutureScopeManager} />
        <Route exact path="/dnc" component={DnCManager} />
        <Route exact path="/productivity" component={ProductivityManager} />
        <BackdropLoader show={this.props.isfetching}/>
        {_.includes(this.props.userRole, "ADMIN") &&
          <EditableItems
            data={this.props.modaldata}
            show={this.props.showmodal}
            info={this.props.modalInfo}
            loading={this.props.showModalLoading}
            close={this._closeModal.bind(this)}
            add={this._addTaskItems.bind(this)}
            closeError={this._closeError.bind(this)}
            deleteItem={this._deleteModalItem.bind(this)}
            error={this.props.error}/>}
       </div>
     )
  }
 }

 function mapStateToProps(state) {
   return { userRole: state.auth.userRole,
     showmodal: state.generic.showmodal,
     modaldata: state.generic.modaldata,
     modalInfo: state.generic.modalInfo,
     showModalLoading: state.generic.showloading,
     isfetching: state.generic.isfetching,
     error: state.generic.error };
 }

 let actions = {
   closeModal,
   addTaskItems,
   closeModalError,
   deleteModalItem
 }

 export default connect(mapStateToProps, actions)(PageRoutes);
