import React, { Component } from 'react';
import { connect } from 'react-redux';

import UsersReqSummary from './UsersReqSummary';
import UserReqDetail from './UserReqDetail';
import { currentPage, getUsersInitialData } from '../../../actions/general';
import Loader from '../../general/Loader';

class UserReqManager extends Component {

  componentWillMount() {
    let defaultFilter = {
      FILTER1: "admin-approval-pending",
      FILTER2: "ALL",
      FILTER3: "ALL",
      FILTER4: "ALL",
      FILTER5: "ALL"
    };
    this.props.currentPage("userReq");
    this.props.getUsersInitialData(this.props.userID, defaultFilter);
  }

  render() {
    return (
      <div className="user-wrapper">
        <UsersReqSummary />
        {this.props.showuser != null ? <UserReqDetail key={this.props.showuser}/> : ""}
      </div>
    )
  }
}

function mapStateToProps(state) {

  return { userID: state.auth.userID,
  showuser: state.user.showuser };
}

export default connect(mapStateToProps, {currentPage, getUsersInitialData})(UserReqManager);
