import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
import DatePicker from 'react-datepicker';

import {
  userUpdate,
  closeDetails
} from '../../actions/userActions';

import Dropdown from '../general/dropdown/Dropdown';
import DropdownChecked from '../general/dropdown/DropdownChecked';

class UserDetail extends Component {
  constructor(props) {
    super(props);
    let userDetail = props.userList ? _.filter(props.userList, { '_id': props.showuser})[0] : null;
    let category = userDetail.categoryId && userDetail.categoryId.length ? userDetail.categoryId[0] : "";

    this.state = {
      roles: ["DEVELOPER", "LEAD", "MANAGER", "GUEST", "ADMIN"],
      status: [{name: "ACTIVE", id: "active"}, {name: "INACTIVE", id: "inactive"}],
      roleSelected: userDetail ? userDetail.role : null ,
      statusSelected: userDetail ? userDetail.status.toUpperCase() : null,
      userDetail: userDetail ? userDetail : null,
      endDate: userDetail ? moment(userDetail.endDate): moment(new Date()),
      categorySelected: category ? category : ""
    }
  }

  _onRoleSelect(role, event) {
    let params = {
      filter: this.props.filter,
      userID: this.state.userDetail._id,
      payload: {role: role},
      isStatus: false   // identifier to make showuser = userID
    };
    this.props.userUpdate(params);
  }

  _onStatusSelect(status, event) {
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
    this.setState({endDate: date});
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
                {userDetail.role.length == 1 &&
                  _.includes(userDetail.role, 'ADMIN') ?
                  <button id="dropdown-basic-1"
                    role="button"
                    type="button"
                    className="dropdown-toggle btn btn-default">
                      {"USER ROLE: "+this.state.roleSelected}
                  </button>
                  :
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
                }
              </div>

              <div className="yellow-dropdown">
                {userDetail.role.length == 1 &&
                  _.includes(userDetail.role, 'ADMIN') ?
                  <button id="dropdown-basic-1"
                    role="button"
                    type="button"
                    className="dropdown-toggle btn btn-default">
                      {"USER STATUS: "+this.state.statusSelected}
                  </button>
                  :
                  <Dropdown
                    data={this.state.status}
                    selected={this.state.statusSelected}
                    title="USER STATUS: "
                    select={this._onStatusSelect.bind(this)}
                    />
                }
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
                  {_.intersection(this.state.roleSelected, ["DEVELOPER", "LEAD"]).length > 0 ?
                  <h5>{this.state.roleSelected.join(',')}
                    {
                      this.state.categorySelected ? <span>,{this.state.categorySelected.category}</span> : ""
                    }
                  </h5>
                  :
                  <h5>{this.state.roleSelected.join(',')}</h5>
                  }
                  <div className="dash"></div>
                  <h5>{userDetail.email}</h5>
                  <h5>{userDetail.phoneNo || 9999999999}</h5>
                </div>

                <hr />
                <Row className="user-date">
                  {!(userDetail.role.length == 1 &&
                    _.includes(userDetail.role, 'ADMIN')) ?
                    <Col xs={6}>
                      <label>Member Since</label>
                      <div ><span className="td-icon-calendar">{moment(userDetail.created_at).format("DD MMM YYYY")}</span></div>
                    </Col>
                    :
                    <Col xs={12}>
                      <label>Member Since</label>
                      <div ><span className="td-icon-calendar">{moment(userDetail.created_at).format("DD MMM YYYY")}</span></div>
                    </Col>
                  }
                  {!(userDetail.role.length == 1 &&
                    _.includes(userDetail.role, 'ADMIN')) &&
                  <Col xs={6}>
                    <label>Valid till</label>
                    <div>
                    <DatePicker
                      className="td-icon-calendar calendar-editable"
                      dateFormat="DD MMM YYYY"
                      selected={this.state.endDate}
                      onChange={this._handleDateChange.bind(this)}
                    />
                  </div>
                  </Col>
                }
                </Row>
                <hr />
                <Row>
                  <div style={{color: "#888888"}}>{userDetail.location}</div>
                </Row>
              </div>

            </Row>
          </Col>
        )}
        else{
        return <Col lg={6} sm={12} xs={12} md={12} className="user-detail">
          <div className="no-data">Select a User</div>
        </Col>
      }

  }
}

function mapStateToProps(state) {
  return { userList: state.user.users,
  showuser: state.user.showuser,
  filter: state.user.filter,
  categories: state.generic.categories};
}

let actions = {
  userUpdate,
  closeDetails
};

export default connect(mapStateToProps, actions)(UserDetail);
