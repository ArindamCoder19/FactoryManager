import React, { Component } from 'react';
import { Grid, Row } from "react-bootstrap";
import { connect } from 'react-redux';

import SideBar from './SideBar';
import PageContent from './PageContent';

/**
 * Parent: App
 * Desc: Application Layout => Left Navigation Bar + Right Page Content
 */

class AppLayout extends Component {
  constructor(props) {
    super(props);

    this.state = {
      toggle: false
    }

  }

/**
 * Hide/Show Side-Bar.
 *
 * @param Boolean --> true - show, false - hide
 */
  _onToggle(toggle) {
    this.setState({toggle: toggle});
  }
  render() {
    let className = this.state.toggle ? 'show-sidebar' : '';
    return (
        <Grid id="wrapper" fluid={true} className={className}>
          <Row>
            <SideBar
              toggle={this._onToggle.bind(this)}/>
            <PageContent
              toggle={this._onToggle.bind(this)}/>
          </Row>
        </Grid>
    )
  }
}

function mapStateToProps(state) {
  return { userID: state.auth.userID };
}

export default connect(mapStateToProps, null)(AppLayout);
