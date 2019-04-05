import React, { Component } from 'react';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import {CSVLink} from 'react-csv';

export default class Header extends Component {
  render() {
    return (
      <div className="header-container">
        <label>{ this.props.title} <span>{"("+this.props.totalCount+")"}</span><span>{this.props.subTitle}</span></label>
        <div style={{display: "flex", justifyContent: "space-between" }}>
          {this.props.showDownload && this.props.downloadData &&
            <div className="download-logo"><CSVLink data={this.props.downloadData} filename={this.props.title+".csv"}>Download</CSVLink>
          </div>}
        </div>
      </div>
    )
  }
}
