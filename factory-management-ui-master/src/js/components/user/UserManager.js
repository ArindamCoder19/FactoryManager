import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  currentPage,
  getUsersInitialData } from '../../actions/general';

import BackdropLoader from '../general/BackdropLoader';
import UsersSummary from './UsersSummary';
import UserDetail from './UserDetail';

class UserManager extends Component {

  componentWillMount() {
    let defaultFilter = {
      FILTER1: "active",
      FILTER2: "ALL",
      FILTER3: "ALL",
      FILTER4: "ALL",
      FILTER5: "ALL"
    };
    // this.props.filterUsers(defaultFilter, null);
    this.props.currentPage("users");
    this.props.getUsersInitialData(this.props.userID, defaultFilter);
  }

  render() {
    if(this.props.initialdataload)
      return (
        <div className="user-wrapper">
          <UsersSummary />
          {this.props.showuser != null ? <UserDetail key={this.props.showuser}/> : ""}
        </div>
      )
    else
      return <BackdropLoader show={true}/>
  }
}

function mapStateToProps(state) {
  return {
    userID: state.auth.userID,
    showuser: state.user.showuser,
    initialdataload: state.generic.initialdataload };
}

let actions = {
  currentPage,
  getUsersInitialData
};

export default connect(mapStateToProps, actions)(UserManager);
