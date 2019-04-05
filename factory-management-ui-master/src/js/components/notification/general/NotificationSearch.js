import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import onClickOutside from 'react-onclickoutside';

import { API_URL } from "../../../util/config";

// import { filterUsers } from "../../../actions/userActions";
import { updateComposeData, sendNotFilledError } from "../../../actions/notificationActions";

class NotificationSearch extends Component {

  constructor() {
    super();

    this.state = {
      showGeneric: true,
      newSearchString: "",
      showDD: false,
      selectedList: [],
      subSelectedList: []
    }
  }
  _asyncSearch(e) {
    let _this = this;
    if(e.target.value.length > 2){
      axios.get(`${API_URL}/api/search-users?status=active&n=${e.target.value}`)
      .then((response) => {
        _this.setState({
          searchList: response.data.data,
          showDD: true,
          showGeneric: false
        })
      });
    }else {
      this.setState({showGeneric: true})
    }
  }

  _updateUserListPayload(list) {
    let { composeNotif, notFilledFields } = this.props;

    composeNotif["user"] = list.map((item) => {
      return item.id;
    });

    if(notFilledFields.indexOf("user") >= 0 && list.length > 0){

      notFilledFields.splice(notFilledFields.indexOf("user"), 1);
      this.props.sendNotFilledError(notFilledFields);
    }
    this.props.updateComposeData(composeNotif);
  }

  _updateCategoryListPayload(list) {
    let { composeNotif, notFilledFields } = this.props;

    composeNotif["category"] = list.map((item) => {
      return item._id;
    });

    if(notFilledFields.indexOf("category") >= 0 && list.length > 0){

      notFilledFields.splice(notFilledFields.indexOf("category"), 1);
      this.props.sendNotFilledError(notFilledFields);
    }
    this.props.updateComposeData(composeNotif);
  }

  _onSelect(item, e) {
    let {selectedList, subSelectedList} = this.state;

    if(!_.some(selectedList, item)){
      selectedList.push(item);
      if(item.id === 'DEVELOPER') {
        subSelectedList = this.props.categories;
      }
    }else {
      selectedList = _.reject(selectedList, function(o) { return item.id == o.id });
      if(item.id === 'DEVELOPER') {
        subSelectedList = [];
      }
    }
    this._updateUserListPayload(selectedList);
    this.setState({selectedList: selectedList, subSelectedList: subSelectedList});
  }

  _onSubSelect(item, e) {
    e.stopPropagation();
    let { selectedList, subSelectedList } = this.state;
    let { categories } = this.props;

    if(!_.some(subSelectedList, item)){
      subSelectedList.push(item);
    }else {
      subSelectedList = _.reject(subSelectedList, function(o) { return item._id == o._id });
      if(subSelectedList.length === 0) {
        selectedList = _.reject(selectedList, function(o) { return o.id == 'DEVELOPER' });
      }
    }


    subSelectedList.length != categories.length && this._updateCategoryListPayload(subSelectedList);
    this.setState({subSelectedList: subSelectedList, selectedList: selectedList});
  }

  _getSubList(list) {
    let _this = this,
    { subSelectedList } = this.state;

    return list.map((item, index) => {
      return  <li key={item._id} id={item._id} onClick={_this._onSubSelect.bind(this, item)}>
        <input type="radio" checked={_.some(subSelectedList, item)} readOnly />
        {_.some(subSelectedList, item) ? <svg height="20" width="20" style={{position: "absolute", left: "0", top: "0"}}>
          <rect x="6" y="6" width="10" height="10" fill="none" strokeWidth="1" stroke="#28AEAF"/>
          <rect x="8" y="8" width="6" height="6" fill="#28AEAF" stroke="none"/>
        </svg> : <svg height="20" width="20" style={{position: "absolute", left: "0", top: "0"}}>
          <rect x="8" y="8" width="6" height="6" fill="#D8D8D8" stroke="none"/>
        </svg>}
        <span>{item.category}</span>
      </li>
    })
  }

  _getGenericList(){
    let _this = this,
    { categories } = this.props,
    { selectedList, subSelectedList } = this.state;
    let genericList = [
      {label: "Managers", id: "MANAGER", subList: []},
      {label: "Leads", id: "LEAD", subList: []},
      {label: "Developers", id: "DEVELOPER", subList: categories} 
    ];

    return genericList.map((item, index) => {
      return <li key={item.id} id={item.id} onClick={_this._onSelect.bind(this, item)}>
        <input type="radio" checked={_.some(selectedList, item)} readOnly />
        {_.some(selectedList, item) ? <svg height="20" width="20" style={{position: "absolute", left: "0", top: "0"}}>
          <rect x="6" y="6" width="10" height="10" fill="none" strokeWidth="1" stroke="#28AEAF"/>
          <rect x="8" y="8" width="6" height="6" fill="#28AEAF" stroke="none"/>
        </svg> : <svg height="20" width="20" style={{position: "absolute", left: "0", top: "0"}}>
          <rect x="8" y="8" width="6" height="6" fill="#D8D8D8" stroke="none"/>
        </svg>}
        <span>{item.label}</span>
        {item.subList && item.subList.length > 0 && 
          <div className={subSelectedList.length > 0 ? 'show-subList': 'hide-subList'}>
            <ul style={{marginTop: 0}}>{_this._getSubList(item.subList)}</ul>
          </div>}
      </li>
    })
  }

  _removeFromList(item, e) {
    e.stopPropagation();
    let subSelectedList = this.state.subSelectedList;
    let newSelectedList = _.reject(this.state.selectedList, function(o) { return item.id == o.id });
    if(item.id === 'DEVELOPER') {
      subSelectedList = [];
    }
    this._updateUserListPayload(newSelectedList);
    this.setState({selectedList: newSelectedList, subSelectedList: subSelectedList});
  }

  _getUserList() {
    let _this = this,
    { selectedList } = this.state;
    return this.state.searchList.map((item, index) => {
      let dataObj = {label: item.firstName+" "+item.lastName, id: item._id};
      return <li key={item._id} onClick={_this._onSelect.bind(this, dataObj)}>
        <input type="radio" checked={_.some(selectedList, dataObj)}  readOnly/>
        {_.some(selectedList, dataObj) ? <svg height="20" width="20" style={{position: "absolute", left: "0", top: "0"}}>
          <rect x="6" y="6" width="10" height="10" fill="none" strokeWidth="1" stroke="#28AEAF"/>
          <rect x="8" y="8" width="6" height="6" fill="#28AEAF" stroke="none"/>
        </svg> : <svg height="20" width="20" style={{position: "absolute", left: "0", top: "0"}}>
          <rect x="8" y="8" width="6" height="6" fill="#D8D8D8" stroke="none"/>
        </svg>}
        <span>{item.firstName+" "+item.lastName}</span>
      </li>
    })
  }
  _getNamesList() {
    let { selectedList, subSelectedList } = this.state;
    let { categories } = this.props;

    return selectedList.map((item, index) => {
      let label = item.label;
      if(item.subList && item.subList.length > 0 && subSelectedList.length > 0) {
        let subList = subSelectedList.length === categories.length ? "ALL" : subSelectedList.map((sub) => sub.category).join(',');
        label = item.label+" - "+subList;
      }
      
      return <div key={index} className="search-user-label">
        {label}
        <div className="nav-close-trigger" onClick={this._removeFromList.bind(this, item)}><span ></span></div>
    </div>
    })
  }

  handleClickOutside() {
    this.searchstr.value = "";
    this.setState({showDD: false, newSearchString: ""});
 }

 _showStaticList() {
   this.setState({showGeneric: true, showDD: !this.state.showDD})
 }
  render() {
    let { showGeneric, newSearchString, showDD, selectedList} = this.state,
    { notFilledFields } = this.props;

    return(
      <div className={notFilledFields.indexOf("user") >= 0 ? "notif-red-border" : ""}>
        <div className={selectedList.length > 0 ? "search-strings full" : "search-strings empty"}>{this._getNamesList()}</div>
        <input
          placeholder="Type 3 characters to search / select from the list"
          ref={(searchstr) => {this.searchstr = searchstr}}
          defaultValue={newSearchString.trim()}
          onFocus={this._showStaticList.bind(this)}
          onKeyUp={this._asyncSearch.bind(this)}/>
        <div className="grey-caret" style={{display: "inline-block"}}>
        </div>
        {showDD && <div className="notif-dd">
          <ul>{!showGeneric ? this._getUserList(): this._getGenericList()}</ul>
        </div>}
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    composeNotif: state.notification.composeNotif,
    notFilledFields: state.notification.notFilledFields,
    categories: state.generic.categories
  };
}

export default connect(mapStateToProps, {updateComposeData, sendNotFilledError})(onClickOutside(NotificationSearch));
