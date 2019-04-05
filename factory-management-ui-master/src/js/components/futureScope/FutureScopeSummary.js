import React, { Component } from 'react';
import { Row, Col, Overlay, Popover } from 'react-bootstrap';
import axios from 'axios';
import { connect } from 'react-redux';
import moment from 'moment';

import FutureScopeHeader from '../general/layout_new/Header';
import FilterComponent from '../general/layout_new/FilterComponent';
import {
  isFetching
} from '../../actions/general';
import {
  filterFS,
  showFSDetail,
  setFSErrorMessage,
  deleteFS,
  showNewFS,
  newFSDataChange,
  addNewFS
} from '../../actions/futureScopeActions';

const FS_FILTER_DDMENU = [
  {name: "All", id: "ALL", default: true},
  {name: "IBM", id: "ibm", default: false},
  {name: "Heineken", id: "heineken", default: false},
  {name: "Third Party", id: "third-party", default: false}
]

const FS_PTYPE_DDMENU = [
  {name: "GIS", id: "gis", default: false},
  {name: "Opco", id: "opco", default: false},
  {name: "COE", id: "coe", default: false},
  {name: "AMS", id: "ams", default: false}
]

const FS_STATUS_DDMENU = [
  {name: "All", id: "ALL", default: true},
  {name: "Proposed", id: "proposed", default: false},
  {name: "Signed", id: "signed", default: false},
  {name: "In progress", id: "in-progress", default: false},
  {name: "Completed", id: "completed", default: false},
  {name: "Cancelled", id: "cancelled", default: false}
]


class FutureScopeSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filterID: 0,
      showMenuID: -1,
      selectedRow: props.showfs
    }
  }

  _onSelect(eventKey, event) {
    this.setState({
      filterID: eventKey
    })
  }

  componentDidMount() {
    let defaultFilter = {
      FILTER1: "ALL",
      FILTER2: "ALL",
      FILTER3: "ALL",
      FILTER4: "ALL"
    };
    this.props.filterFS(defaultFilter, null);
  }

  _onRowClick(item) {
    this.setState({selectedRow: item._id});
    this.props.showFSDetail(item._id);
  }

  _deleteFS(fsID, e) {
    e.preventDefault();
    let params = {
      filter: this.props.filter,
      fsID: fsID
    };
    this.props.deleteFS(params);
  }

  _subMenu(id, e) {
    e.stopPropagation();
    this.setState({showMenuID: id, toggle: !this.state.toggle})
  }

  _getList() {
    let _this = this;

    if(this.props.fsList && this.props.fsList.length > 0){
      return this.props.fsList.map( (item, index) => {
        let estimatedHours = item.estimatedHours ? parseFloat(item.estimatedHours) : 0,
        sn = item.projectManager ? item.projectManager.trim().split(" ") : [];
        return <div key={index}
          className={_this.props.showfs == item._id ? "d-row active" : "d-row"}
          onClick={_this._onRowClick.bind(_this, item, index)}>
          <div className={"logo-complete"}>
          </div>
          <div>{item.category[0].category}</div>
          <div>{item.projectName}</div>
          <div>{estimatedHours}</div>
          <div>{item.startDate ? moment(item.startDate).format('DD MMM') : ""}</div>
          <div className="short-name">
            { sn.length > 1 ? sn[0][0]+sn[1][0] : (sn.length == 1 ? sn[0][0] : "") }
          </div>
          {_this.props.userRole.indexOf('ADMIN') >= 0 &&
            <span className="menu-caret" onClick={_this._subMenu.bind(_this, item._id)}></span>}
          {_this.state.toggle && _this.state.showMenuID == item._id && _this.props.userRole.indexOf('ADMIN') >= 0?
            <div className="dropdown">
               <ul className="dropdown-menu submenu">
                 <li ><a href="#" onClick={_this._deleteFS.bind(_this, item._id)}>Delete FS</a>
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

    payload[filterType] = filter;
    this.props.isFetching();
    this.props.filterFS(payload, null);
  }

  _getCategories() {
    let category = [{name: 'All Categories', id: 'ALL'}];
    if(this.props.categories){
      this.props.categories.forEach((item) => {
        category.push({name: item.category, id: item._id})
      });
    }
    return category;
  }

  _getSubCategories() {
    let subcategory = [{name: 'Select All', id: 'ALL'}];
    if(this.props.subCategories){
      this.props.subCategories.forEach((item) => {
        subcategory.push({name: item.subCategory, id: item._id})
      });
    }
    return subcategory;
  }

  _showNewTask() {
    this.props.showNewFS();
  }

  getStatuses() {
    let status = [{name: 'Select All', id: 'ALL'}];
    if(this.props.fsStatus){
      this.props.fsStatus.forEach((item) => {
        status.push({name: item.status, id: item._id})
      });
    }
    return status;
  }

  _addNewFS() {
    //FS_MANDATORY
    if(!this.props.error.showMandatory && this.props.error.mandatory != ""){
      let error = {
        fte: this.props.error.fte,
        eh: this.props.error.eh,
        mandatory: this.props.error.mandatory,
        showMandatory: true
      }
      this.props.setFSErrorMessage(error);
    }else if(this.props.error.fte == "" && this.props.error.eh == "" && this.props.error.mandatory == ""){
      if(this.props.newfsdata.projectName && this.props.newfsdata.projectName.trim() != "" ){
        this.props.isFetching();
        let trimmedData = this.props.newfsdata.projectName.trim();
        this.props.newfsdata["projectName"] = trimmedData;
        this.props.addNewFS(this.props.newfsdata, this.props.filter);
      }else{
        this.setState({error: "Please fill Project Name"});
      }
    }
  }

  _onNewInputChange(type, e) {
    this.setState({error: ""})
    let data = {};
    let payload = {};
    payload[type] = e.target.value;
    for (let j in this.props.newfsdata){
      data[j] = this.props.newfsdata[j]
    }
    for (let i in payload){
      data[i] = payload[i];
    }
    this.props.newFSDataChange(data);
  }

  render() {
    let status = this.getStatuses(),
    categories = this._getCategories(),
    subCategories = this._getSubCategories();
    return (
        <Col xs={12} md={6} lg={6} sm={6} className="summary">
          <div>
            <FutureScopeHeader
              title="Future Scope"
              showDownload={true}
              totalCount={this.props.totalCount}
              downloadData={this.props.downloadData}/>
          </div>

          <Row>
            {subCategories.length > 1 ? <div className="filter-container">
              {status.length > 1 && <FilterComponent
                name="Status-"
                menu={[]}
                menuType={null}
                subMenuType="FILTER1"
                submenu={status}
                filter={this.props.filter}
                filterSelect={this._filterSelect.bind(this)}
                />}
              <FilterComponent
                name=""
                menuType="FILTER3"
                subMenuType="FILTER4"
                menu={categories}
                submenu={subCategories}
                filter={this.props.filter}
                filterSelect={this._filterSelect.bind(this)}
                />
            </div> :
            <div className="filter-container">
              <div className="grey-dropdown">
                <div className="dropdown open btn-group"><button className="dropdown-toggle btn btn-default">Status</button></div>
              </div>
              <div className="grey-dropdown">
                <div className="dropdown open btn-group"><button className="dropdown-toggle btn btn-default">{categories[0].name}</button></div>
              </div>
            </div>}
          </Row>

            <div className="new-task">
              {_.intersection(this.props.userRole, ['ADMIN', 'MANAGER', 'LEAD']).length > 0 && <span onClick={this._showNewTask.bind(this)}>Add Future Scope</span>}
            </div>


            <Row className="newfs-container">
              {this.props.newfs ?
                <div className={"d-row active"} >
                  <div className="logo-complete">
                  </div>
                  <div> {this.props.newfsdata.categoryId ? _.filter(this.props.categories, { '_id': this.props.newfsdata.categoryId})[0].category : 'Service'} </div>
                  <div>
                    <input
                      type="text"
                      style={{width: "100%"}}
                      placeholder="Project Name"
                      ref={(desc) => {this.pn = desc}}
                      onChange={this._onNewInputChange.bind(this, "projectName")}
                      value={this.props.newfsdata.projectName ? this.props.newfsdata.projectName : ''}/>
                  </div>
                  <div style={{textAlign: "center"}}>
                    <button style={{color: "#28AFB0", fontWeight: "bold"}}
                    onClick={this._addNewFS.bind(this)}>Add</button>
                  </div>
                  <Overlay
                    show={this.props.error.newfs || this.state.error ? true : false}
                    target={this.pn}
                    placement="top"
                    containerPadding={20}
                    animation={false}
                  >
                    <Popover id="popover-contained" className="error-popup" title="">
                      {this.state.error || this.props.error.newfs}
                    </Popover>
                  </Overlay>
                </div>
                :
                ""
              }
            </Row>

          <Row className="summary-list">
            {this._getList()}
          </Row>
        </Col>
    )
  }
}

function mapStateToProps(state) {
  return { fsList: state.futureScope.fsList,
  totalCount: state.futureScope.totalCount,
  filter: state.futureScope.filter,
  error: state.futureScope.genericErrorMsg,
  newfs: state.futureScope.newfs,
  newfsdata: state.futureScope.newfsdata,
  showfs: state.futureScope.showfs,
  categories: state.generic.categories,
  subCategories: state.generic.subCategories,
  downloadData: state.futureScope.downloadData,
  fsStatus: state.generic.fsStatus,
  userRole: state.auth.userRole
 };
}

let actions = {
  filterFS,
  showFSDetail,
  deleteFS,
  showNewFS,
  newFSDataChange,
  setFSErrorMessage,
  isFetching,
  addNewFS
};

export default connect(mapStateToProps, actions)(FutureScopeSummary);
