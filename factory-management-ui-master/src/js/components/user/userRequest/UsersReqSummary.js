import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { connect } from 'react-redux';

import {
  USER_DDMENU,
  USER_CATEGORY,
  USER_SUBCATEGORY } from '../../../util/constants';
import { filterUsers, showUserDetail, deleteUser } from '../../../actions/userActions';

import UserHeader from '../../general/layout_new/Header';
import FilterComponent from '../../general/layout_new/FilterComponent';

class UserReqSummary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ddMenu: USER_DDMENU,
      category: USER_CATEGORY,
      subCategory: USER_SUBCATEGORY,
      filterID: 0,
      header: ["", "NAME", "EMAIL", "ROLE", ""],
      selectedRow: props.showuser,
      showMenuID: -1,
      toggle: false
    }
  }

  _onSelect(eventKey, event) {
    this.setState({
      filterID: eventKey
    })
  }

  _onRowClick(item) {

    this.setState({selectedRow: item._id, showMenuID: null, toggle: false});
    this.props.showUserDetail(item._id);
  }

  _getHeader() {
    let _this = this;

      return this.state.header.map( (item, index) => {

        return <div key={index}>{item}</div>
      });
  }

  _subMenu(item, id, e) {
    e.stopPropagation();
    this.setState({showMenuID: item._id, toggle: !this.state.toggle})
  }

  _deleteUser(userID, e) {
    e.preventDefault();
    let params = {
      filter: this.props.filter,
      userID: userID
    };
    this.props.deleteUser(params);
  }

  _getList() {
    let _this = this;

    if(this.props.userList && this.props.userList.length > 0){
      return this.props.userList.map( (item, index) => {
        return <div key={item._id} className={_this.props.showuser == item._id ? "d-row active" : "d-row"} onClick={_this._onRowClick.bind(_this, item)}>
          <div>
            <div className="short-name">
            {item.firstName[0].toUpperCase() + item.lastName[0].toUpperCase()}
          </div>
        </div>
          <div>{item.firstName + " " + item.lastName}</div>
          <div>{item.email}</div>
          <div>{item.role.toString()}</div>
          <div>
          {item.role.indexOf('ADMIN') < 0 &&
            <span className="menu-caret" onClick={_this._subMenu.bind(_this, item, index)}></span>}
          </div>

          {_this.state.toggle && _this.state.showMenuID == item._id && item.role.indexOf('ADMIN') < 0?
            <div className="dropdown">
               <ul className="dropdown-menu submenu">
                 <li ><a href="#" onClick={_this._deleteUser.bind(_this, item._id)}>Delete User</a>
                </li>
              </ul>
            </div> : ""}
        </div>
      });
    }else{
      return <div className="no-data">No Data</div>
    }
  }

  _filterSelect(filter, filterType, isMenuSelected) {
    let payload = {};
    payload['FILTER1'] = this.props.filter['FILTER1'];
    payload['FILTER2'] = this.props.filter['FILTER2'];
    payload['FILTER3'] = this.props.filter['FILTER3'];
    payload['FILTER4'] = isMenuSelected ? "ALL" : this.props.filter['FILTER4'];
    payload['FILTER5'] = this.props.filter['FILTER5'];
    payload[filterType] = filter;
    this.props.filterUsers(payload, null);
  }

  render() {
    let { filter, totalCount } = this.props;
    return (
        <Col xs={12} md={6} lg={6} sm={6} className={(filter && filter["FILTER5"] === "ALL") ? "summary": "summary search"}>
          <div>
            <UserHeader
              title="Users Requests"
              subTitle={(filter && filter["FILTER5"] === "ALL") ? "": " (Search Results)"}
              showDownload={false}
              totalCount={totalCount}
              downloadData={[]}/>
          </div>

          <Row>
            <div className="filter-container">
              <FilterComponent
                name="Status-"
                menu={[{name: 'Approval Pending', id: 'admin-approval-pending'}]}
                menuType="FILTER1"
                subMenuType={null}
                submenu={[]}
                filter={this.props.filter}
                filterSelect={this._filterSelect.bind(this)}
                />
              <FilterComponent
                name=""
                menuType="FILTER3"
                subMenuType="FILTER4"
                menu={USER_CATEGORY}
                submenu={USER_SUBCATEGORY}
                filter={this.props.filter}
                filterSelect={this._filterSelect.bind(this)}
                />
            </div>
          </Row>

          <Row className="summary-header">
              <div className="d-row">{this._getHeader()}</div>
            </Row>
            <Row className="summary-list">
              {this._getList()}
            </Row>
        </Col>
    )
  }
}

function mapStateToProps(state) {
  return { userList: state.user.users,
  totalCount: state.user.totalCount,
  filter: state.user.filter,
  showuser: state.user.showuser };
}

let actions = {
  filterUsers,
  showUserDetail,
  deleteUser
};

export default connect(mapStateToProps, actions)(UserReqSummary);
