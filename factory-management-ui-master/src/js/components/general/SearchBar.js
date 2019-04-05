import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import onClickOutside from 'react-onclickoutside';
import _ from 'lodash';

import { API_URL } from "../../util/config";
import { filterTasks } from "../../actions/taskActions";
import { filterUsers } from "../../actions/userActions";
import { isFetching } from "../../actions/general";

class SearchBar extends Component {
  constructor() {
    super();

    this.state = {
      showDD: false,
      userSearchInfo: {},
      newSearchString: "",
      searchList: [],
      searchedInfo: []
    }
  }

  _filterTaskData(payload) {
    this.props.isFetching();
    this.props.filterTasks(payload, null);
  }

  _filterUserData(payload) {
    this.props.isFetching();
    this.props.filterUsers(payload, null);
  }

  _asyncSearch(e) {
    let _this = this,
        userSearchInfo = this.state.userSearchInfo;
    if(_.includes(["users", "userReq"], this.props.currentpage)){
      if(userSearchInfo.id == undefined){
        axios.get(`${API_URL}/api/search-users?n=${e.target.value}`)
        .then((response) => {
          _this.setState({
            searchList: response.data.data,
            showDD: true
          })
        });
      }
      this.setState({newSearchString: e.target.value});
    }else {
      if(e.keyCode != 13){
        let splitValue = e.target.value.split(" "),
        value = splitValue[splitValue.length-1];

        if(userSearchInfo.id == undefined){
          axios.get(`${API_URL}/api/search-users?n=${value}`)
          .then((response) => {
            _this.setState({
              searchList: response.data.data,
              showDD: true
            })
          });
          this.setState({newSearchString: e.target.value});
        }else {
          // debugger;
          this.setState({newSearchString: e.target.value, showDD: false});
        }
      }else {
        let showtask = null;
        this.props.taskfilter["FILTER8"] = e.target.value.trim() === "" ? "ALL" : e.target.value.trim();
        this.setState({newSearchString: e.target.value.trim(), showDD: false});

        this._filterTaskData(this.props.taskfilter);
      }
    }
  }

  _selectUser(item, e) {
    let { currentpage, userfilter, taskfilter } = this.props;
    let userSearchInfo = this.state.userSearchInfo;

    if(_.includes(["users", "userReq"], currentpage)){
      let userSearchInfo = {label: item.firstName+" "+item.lastName, id: item._id};

      this.props.userfilter["FILTER5"] = item._id;
      this._filterUserData(this.props.userfilter);

      this.searchstr.value = "";

      this.setState({
        showDD: false,
        searchList: [],
        newSearchString: "",
        userSearchInfo: userSearchInfo
      })
    }else {

      let splitValue = this.state.newSearchString.split(" "),
          value = splitValue[splitValue.length-1],
          stringArr = [],
          userSearchInfo = {label: item.firstName+" "+item.lastName, id: item._id};

      splitValue.forEach((item, index) => {
        (index != splitValue.length-1) ? stringArr.push(item) : "";
      });

      // debugger;
      // TODO: Better approach to set empty string

      stringArr.length > 0 ? this.props.taskfilter["FILTER8"] = stringArr.join(" ") : "";
      this.props.taskfilter["FILTER7"] = item._id;
      this._filterTaskData(this.props.taskfilter);

      this.searchstr.value = stringArr.join(" ");

      this.setState({
        showDD: false,
        searchList: [],
        newSearchString: stringArr.join(" "),
        userSearchInfo: userSearchInfo
      });
    }
  }

  _removeUser() {
    if(_.includes(["users", "userReq"], this.props.currentpage)){
      this.props.userfilter["FILTER5"] = "ALL";
      this._filterUserData(this.props.userfilter);
    }else {
      // debugger;
      // console.log(this.state.newSearchString);
      this.state.newSearchString.trim() === "" ? this.props.taskfilter["FILTER8"] = "ALL" : ""
      this.props.taskfilter["FILTER7"] = "ALL";
      this._filterTaskData(this.props.taskfilter);
    }

    this.setState({
      userSearchInfo: {}
    })
  }

  _menuRenderer() {
    let _this = this;
    return this.state.searchList.map((item) => {
      return <div key={item._id} className="d-row" onClick={_this._selectUser.bind(_this, item)}>
        <div>{item.firstName+" "+item.lastName}</div>
        <div>{item.role.join(',')}</div>
        <div>{item.email}</div>
      </div>
    })
  }

  _getSearchedString() {

    if(this.state.userSearchInfo.label){
     return <div className="search-user-label">
        {this.state.userSearchInfo.label}
        <div
          className="nav-close-trigger"
          style={{display: "inline-block"}}
          onClick={this._removeUser.bind(this)}>
          <span ></span>
        </div>
      </div>
    }else {

    }
  }

  _clearSearch() {
    if(_.includes(["users", "userReq"], this.props.currentpage)){
      this.props.userfilter["FILTER5"] = "ALL";
      this._filterUserData(this.props.userfilter);
    } else {
      this.props.taskfilter["FILTER7"] = "ALL";
      this.props.taskfilter["FILTER8"] = "ALL";
      this._filterTaskData(this.props.taskfilter);
    }

    // TODO: Better approach to set empty string
    this.searchstr.value = "";
    this.setState({
      userSearchInfo: {},
      newSearchString: ""
    })
  }

  handleClickOutside() {

    this.setState({
     showDD: false,
     searchList: []
    });
 }

 _focusInput(e) {
   e.stopPropagation();
   this.searchstr.focus();
 }

  render() {
    let { showDD, userSearchInfo, searchList, newSearchString } = this.state,
        { currentpage } = this.props;

    return (
      <div className="search-container" onClick={this._focusInput.bind(this)}>
        <div className="search-bar">
          {!(userSearchInfo.label || newSearchString.length > 0) && <div className="search-placeholder">Search </div>}
          <div className="search-input">
            <div className="search-strings" ref={(test) => {this.test = test}}>
              {this._getSearchedString()}
            </div>
            <input
              style={{width: this.test ? "calc(100% - "+this.test.offsetWidth+"px)": "70%"}}
              ref={(searchstr) => {this.searchstr = searchstr}}
              defaultValue={newSearchString.trim() == "" ? "" : newSearchString}
              onKeyUp={this._asyncSearch.bind(this)} />
          </div>
          {(userSearchInfo.label || newSearchString.length > 0) && <div className="search-clear" onClick={this._clearSearch.bind(this)}><span></span>Clear search</div>}
        </div>
        {showDD && searchList.length > 0 && <div className="search-list">
          <div className="search-header">USERS({searchList.length})</div>
          {this._menuRenderer()}
        </div>}
      </div>
    )
  }
}

function mapStateToProps(state) {
  return { taskfilter: state.task.filter,
    userfilter: state.user.filter,
    currentpage: state.generic.currentpage };
}

let actions = {
  filterTasks,
  filterUsers,
  isFetching
};

export default connect(mapStateToProps, actions)(onClickOutside(SearchBar));
