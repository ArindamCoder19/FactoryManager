import React, { Component } from 'react';
import { connect } from 'react-redux';

import NewNotification from './detail/NewNotification';
import ArchivedNotification from './detail/ArchivedNotification';
import SentNotification from './detail/SentNotification';
import ComposeNotification from './detail/ComposeNotification';
import SuccessNotification from './detail/SuccessNotification';

class NotificationBody extends Component {
  render() {
    let { tabSelected, socket } = this.props;
    return(
      <div className="notification-body">
        <NewNotification show={tabSelected === 0} socket={socket}/>
        <ArchivedNotification show={tabSelected === 1}/>
        <SentNotification show={tabSelected === 2} socket={socket}/>
        {tabSelected === 3 && <ComposeNotification show={true}/>}
        <SuccessNotification show={tabSelected === 4}/>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    tabSelected: state.notification.tabSelected
  };
}

export default connect(mapStateToProps, {})(NotificationBody);
