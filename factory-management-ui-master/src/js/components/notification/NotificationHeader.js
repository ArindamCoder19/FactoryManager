import React, { Component } from 'react';
import { connect } from 'react-redux';

import { updateTabSelected, sendNotification, sendNotFilledError } from '../../actions/notificationActions';

class NotificationHeader extends Component {
  constructor() {
    super();

    this.state = {
      composeReady: false
    }
  }
  onSendClick() {
    let {composeNotif, socket} = this.props,
    notFilled = [];

    if(composeNotif.user.length <= 0){
      notFilled.push("user");
    }

    if(composeNotif.dueDate === null){
      notFilled.push("dueDate");
    }

    if(composeNotif.message.trim() === ""){
      notFilled.push("message");
    }

    if(notFilled.length === 0){
      this.props.sendNotification(composeNotif, socket);
    }else {
      this.props.sendNotFilledError(notFilled);
    }

  }
  onComposeClick() {
    this.props.updateTabSelected(3);
    this.setState({composeReady: true});
  }

  componentWillUnmount() {
    console.log("unmounted");
    this.props.updateTabSelected(0);
  }
  render() {
    let { composeReady } = this.state,
    { tabSelected } = this.props;
    return(
      <div className="notification-header">
        <div></div>
        <div>Notifications</div>
        {composeReady && tabSelected === 3 ?
          <div className="green-label"><span onClick={this.onSendClick.bind(this)}>Send</span></div> :
          <div><span onClick={this.onComposeClick.bind(this)}>Compose</span></div>}
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    tabSelected: state.notification.tabSelected,
    composeNotif: state.notification.composeNotif
  };
}

export default connect(mapStateToProps, {updateTabSelected, sendNotification, sendNotFilledError})(NotificationHeader);
