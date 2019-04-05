import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import { updateNotification, socketNotifyAgainACK } from "../../../actions/notificationActions";
import Loader from '../../general/Loader';

class NewNotification extends Component {
  constructor() {
    super();

    this.state = {showButtonId: -1, data: [], clickedId: -1}
  }
  componentDidMount() {
    let _this = this;
    this.props.socket.on('notifyAgainACK', (uniqueId) => {
      _this.props.socketNotifyAgainACK(uniqueId, _this.props.newNotif);
    })
  }

  showDoneButton(id) {
    this.setState({showButtonId: id});
  }

  _onDoneClick(item) {
    this.setState({clickedId: item._id});
    let count = this.props.count > 0 ? this.props.count-1 : 0 ;

    this.props.updateNotification(item, {status: "archived"}, count, this.props.socket);
  }

  _showNotifications() {
    let _this = this,
    { clickedId, showButtonId } = this.state,
    { isloading, newUpdatedNotifIds } = this.props;

    return this.props.newNotif.map((item, index) => {

      let notifDate = moment(item.dueDate).format("DD MMM YYYY"),
       createdAtDate = item.created_at ? moment(item.created_at).format("DD MMM YYYY") : item.created_at,
       dateString = moment().isSame(item.dueDate, "day") === true ? "Today" : notifDate,
       createdAtDateString = createdAtDate && moment().isSame(item.created_at, "day") === true ? "Today" : createdAtDate;

      return <div className={(newUpdatedNotifIds.indexOf(item._id) > -1) ? "notif-list-item hide-slow" : "notif-list-item"} key={index} onMouseEnter={_this.showDoneButton.bind(this, item._id)} >
        <div className="notif-bottle-full"></div>
        <div>
          <div>
            <div>{item.author[0].firstName+" "+item.author[0].lastName}{item.status === "renotified" && <span className="renotif">Re-notified</span>}</div>
            <div>{createdAtDateString}</div>
          </div>
          <div><p>{item.message}</p></div>
          <div><span>Due By: </span><span>{dateString}</span></div>
          {
            showButtonId === item._id && 
            (clickedId === item._id && isloading ? <button className="notif-green-button loading"><Loader /></button> :  <button className="notif-green-button" onClick={_this._onDoneClick.bind(this, item)}>Done</button>)}
        </div>
      </div>
    })
  }
  render() {
    if(this.props.show)
    return(
      <div className="notif-list">
        {this.props.count > 0 ? this._showNotifications() : <div className="no-data">No New Notifications</div>}
      </div>
    )
    else 
    return null
  }
}

function mapStateToProps(state) {
  return {
    newNotif: state.notification.newNotif,
    count: state.notification.count,
    isloading: state.notification.isUpdateLoading,
    newUpdatedNotifIds: state.notification.newUpdatedNotifIds
  };
}

export default connect(mapStateToProps, {updateNotification, socketNotifyAgainACK})(NewNotification);
