import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import moment from 'moment';

import {
  USER_DDMENU,
  USER_CATEGORY,
  USER_SUBCATEGORY
} from '../../util/constants';
import {
  filterUsers,
  deleteUser,
  showUserDetail } from '../../actions/userActions';

import UserHeader from '../general/layout_new/Header';
import FilterComponent from '../general/layout_new/FilterComponent';
// import UserHeader from '../general/layout/Header';
// import UserFilterContainer from '../general/layout/FilterContainer';

class UserSummary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filterID: 0,
      header: ["", "NAME", "EMAIL", "ROLE", ""],
      selectedRow: props.showuser,
      showMenuID: -1,
      toggle: false
    }

  }

  _onRowClick(item) {
    this.props.showUserDetail(item._id);
    this.setState({selectedRow: item._id, showMenuID: null, toggle: false})
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

        return <div key={item._id}
          className={_this.props.showuser == item._id ? "d-row active" : "d-row"}
          onClick={_this._onRowClick.bind(_this, item)}>
          <div className="short-name">
            {item.firstName[0].toUpperCase() + item.lastName[0].toUpperCase()}
          </div>
          <div>{item.firstName + " " + item.lastName}</div>
          <div>{item.email}</div>
          <div>{item.role.join(',')}</div>
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

  _getDataForDownload() {
    if(this.props.userList){
      let props = this.props;
      return (this.props.userList.map((item) => {

        return (
          {
            "Name": item.firstName + " " + item.lastName,
            "Email": item.email,
            "Role": item.role.join(','),
            "Category": item.categoryId && item.categoryId.length > 0 ? item.categoryId[0].category : "",
            "Status": item.status,
            "Phone Number": item.phoneNo ? item.phoneNo : "",
            "Member Since": moment(item.created_at).format('DD-MM-YYYY'),
            "Valid Till": moment(item.endDate).format('DD-MM-YYYY')
            }
        )
      }));
    }
  }

  render() {
    let { filter, totalCount } = this.props;
    return (
        <Col xs={12} md={6} lg={6} sm={6} className={(filter && filter["FILTER5"] === "ALL") ? "summary": "summary search"}>
          <div>
            <UserHeader
              title="Users"
              subTitle={(filter && filter["FILTER5"] === "ALL") ? "": " (Search Results)"}
              showDownload={true}
              totalCount={totalCount}
              downloadData={this._getDataForDownload()}/>
          </div>

          <Row>
            <div className="filter-container">
              <FilterComponent
                name="Status-"
                menu={USER_DDMENU}
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
  deleteUser,
  showUserDetail
};

export default connect(mapStateToProps, actions)(UserSummary);
