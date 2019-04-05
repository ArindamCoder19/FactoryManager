import React, { Component } from 'react';
import { Col , DropdownButton } from 'react-bootstrap';
import { connect } from 'react-redux';

import Profile from './Profile' ;
import SearchBar from './general/SearchBar';
import Notification from './notification/Notification';
import { API_URL } from '../util/config';
import socketIOClient from "socket.io-client";

/**
 * Parent: PageContent
 * Desc: Top Search Bar
 */

class PageHeader extends Component {
  constructor() {
    super();

    this.state = {
      socket: null
    }
  }

  _toggle(e) {
    e.stopPropagation();
    this.props.toggle(true);
  }

  componentWillMount() {
    console.log("Page Header Will Mount");
    
    const socket = socketIOClient(API_URL, {
      query: {
        userID: this.props.userID
      }
    });

    this.setState({socket: socket});
  }

  render() {
    let { currentpage, profile } = this.props;
    let { socket } = this.state;
    return(
      <Col className="search-bar-wrapper" sm = {12}>
        <div className="nav-trigger" onClick={this._toggle.bind(this)}><span ></span></div>
        <Col xs={12} sm={6} style={{padding: 0}}>
          {_.includes(["tasks", "users", "userReq"], currentpage) && <SearchBar currentpage={currentpage}/>}
        </Col>
        <div style={{height: "100%", display: "flex"}}>
          {<Notification socket={socket}/>}
          <DropdownButton className="round-image" pullRight id="split-button-pull-right"
            title={profile ? profile.firstName[0].toUpperCase() + profile.lastName[0].toUpperCase() : ""}
            id={`profile-dropdown`}>
            <Profile socket={socket}/>
          </DropdownButton>
        </div>
      </Col>
    )
  }
}

function mapStateToProps(state) {
  return { profile: state.user.profile,
    currentpage: state.generic.currentpage,
    userID: state.auth.userID };
}

export default connect(mapStateToProps, null)(PageHeader);
