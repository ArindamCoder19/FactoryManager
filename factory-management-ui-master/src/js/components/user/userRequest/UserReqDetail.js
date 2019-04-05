import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
import DatePicker from 'react-datepicker';

import {
  userUpdate,
  closeDetails } from '../../../actions/userActions';

import Dropdown from '../../general/dropdown/Dropdown';
import DropdownChecked from '../../general/dropdown/DropdownChecked';

class UserReqDetail extends Component {
  constructor(props) {
    super(props);

    let userDetail = props.userList ? _.filter(props.userList, { '_id': props.showuser })[0] : null;
    let category = userDetail.categoryId && userDetail.categoryId.length ? userDetail.categoryId[0] : "" ;

    this.state = {
      roles: ["DEVELOPER", "LEAD", "MANAGER", "GUEST", "ADMIN"],
      status: [{name: "ACTIVE", id: "active"}, {name: "INACTIVE", id: "inactive"}],
      roleSelected: userDetail ? userDetail.role : null ,
      statusSelected: "FOR APPROVAL",
      userDetail: userDetail ? userDetail : null,
      endDate: userDetail ? moment(userDetail.endDate): moment(new Date()),
      categorySelected: category ? category : ""
    }
  }

  _onRoleSelect(role) {
    let params = {
      filter: this.props.filter,
      userID: this.state.userDetail._id,
      payload: {role: role},
      isStatus: false   // identifier to make showuser = userID
    };
    this.props.userUpdate(params);
  }

  _onStatusSelect(status) {
    let params = {
      filter: this.props.filter,
      userID: this.state.userDetail._id,
      payload: {status: status.id},
      isStatus: true   // identifier to make showuser = null
    };
    this.props.userUpdate(params);
    this.setState({statusSelected: status.name});
  }

  onClose() {
    this.props.closeDetails();
  }

  _handleDateChange(date) {
    let params = {
      filter: this.props.filter,
      userID: this.state.userDetail._id,
      payload: {endDate: date.format("YYYY-MM-DD")},
      isStatus: false   // identifier to make showuser = userID
    };
    this.props.userUpdate(params);
    this.setState({endDate: date})
  }

  _onCategorySelect(item) {
    let params = {
      filter: this.props.filter,
      userID: this.state.userDetail._id,
      payload: {categoryId: item._id},
      isStatus: false   // identifier to make showuser = null
    };
    this.props.userUpdate(params);
    this.setState({categorySelected: item})
  }

  render() {
    const { userDetail } = this.state;
    if(userDetail && userDetail != null){
      return (
        <Col lg={6} sm={12} xs={12} md={12} className="user-detail">
          <Row className="dropdown-container">
            <div className="navy-dropdown">
              <DropdownChecked
                data={this.state.roles}
                selected={this.state.roleSelected}
                categories={this.props.categories}
                categorySelected={this.state.categorySelected}
                onCategorySelect={this._onCategorySelect.bind(this)}
                select={this._onRoleSelect.bind(this)}
                title="USER ROLE: "
                checkbox={4}
                />
            </div>
            <div className="yellow-dropdown">
              <Dropdown
                data={this.state.status}
                selected={this.state.statusSelected}
                title="USER STATUS: "
                select={this._onStatusSelect.bind(this)}
                />
            </div>
          </Row>

          <Row className="detail-wrapper">
            <div className="nav-close-trigger" onClick={this.onClose.bind(this)}>
              <span></span>
            </div>
            <div className="user-img">
              <h1>{userDetail.firstName[0].toUpperCase() + userDetail.lastName[0].toUpperCase()}</h1>
            </div>
            <div className="user-info">
              <div>
                <h5>{userDetail.firstName + " " + userDetail.lastName}</h5>
                <div className="dash"></div>
                <h5>{userDetail.email}</h5>
                <h5>+91-9999999999</h5>
              </div>
              <hr />
              <Row className="user-date">
                <Col xs={6}>
                  <label>Member Since</label>
                  <div>{moment(userDetail.created_at).format("DD MMM, YYYY")}</div>
                </Col>
                <Col xs={6}>
                  <label>Valid Till</label>
                  <DatePicker
                      customInput={<div>{this.state.endDate.format("DD MMM, YYYY")}</div>}
                      dateFormat="YYYY-MM-DD"
                      selected={this.state.endDate}
                      onChange={this._handleDateChange.bind(this)}
                      minDate={moment(new Date())}
                  />
                </Col>
              </Row>
              <hr />

            </div>

          </Row>
        </Col>
      )
    }else{
      return <Col lg={6} sm={12} xs={12} md={12} className="user-detail">
        <div className="nav-close-trigger" onClick={this.onClose.bind(this)}>
          <span></span>
        </div>
        <div className="no-data">Select a User</div>
       </Col>
    }
  }
}

function mapStateToProps(state) {

  return { userList: state.user.users,
  showuser: state.user.showuser,
  filter: state.user.filter,
  categories: state.generic.categories };
}

let actions = {
  userUpdate,
  closeDetails
};

export default connect(mapStateToProps, actions)(UserReqDetail);
