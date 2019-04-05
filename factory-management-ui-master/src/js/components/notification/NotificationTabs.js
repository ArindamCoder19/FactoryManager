import React, { Component } from 'react';
import { connect } from 'react-redux';

import { updateTabSelected } from '../../actions/notificationActions';

class NotificationTabs extends Component {
  onTabSelect(state) {
    this.props.updateTabSelected(state);
    // this.setState({tabSelected: state})
  }
  render() {
    let { tabSelected } = this.props;
    return(
      <div className="notification-tabs">
        <div
          className={tabSelected === 0 ? "notif-active": ""}
          onClick={this.onTabSelect.bind(this, 0)}>
          New
          <span></span>
        </div>
        <div
          className={tabSelected === 1 ? "notif-active": ""}
          onClick={this.onTabSelect.bind(this, 1)}>
          Archived
        </div>
        <div
          className={tabSelected === 2 ? "notif-active": ""}
          onClick={this.onTabSelect.bind(this, 2)}>
          Sent
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    tabSelected: state.notification.tabSelected,
  };
}

export default connect(mapStateToProps, {updateTabSelected})(NotificationTabs);
