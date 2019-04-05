import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import { getSentNotifications, notifyAgain, updateSentReceipients } from "../../../actions/notificationActions";
import Loader from '../../general/Loader';

class SentNotification extends Component {
  constructor() {
    super();

    this.state = {receipientId : -1, clickedId: -1};
  }
  componentWillMount() {
    // this.props.getSentNotifications()
    let _this = this;
    this.props.socket.on('archivedACK', (data) => {
      _this.props.updateSentReceipients(data, _this.props.sentNotif);

    })
  }

  _showReceipients(id, e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({receipientId: id});
  }

  _getReceipients(users) {
    return users.map((item, index) => {
      return <li key={index} className={item.status === "archived" ? 'status-done': ''}>
      {item.user && item.user.firstName[0]+""+item.user.lastName[0]}
      <div><span className="green-triangle"></span>{item.user && item.user.firstName+" "+item.user.lastName}</div>
      </li>
    })
  }

  _hideNotifybutton(id, e) {
    e.stopPropagation();
    if(id !== this.state.receipientId){
      this.setState({receipientId: -1});
    }
  }

  _onNotifyAgainClick(id, users) {
    console.log(id)
    let nonArchivedUsers = users.filter((user)=> {return user.status === "new"});
    let nonArchivedUsersIds = nonArchivedUsers.map((user) => {
      return user.user._id;
    })

    this.setState({clickedId: id});
    this.props.notifyAgain(id, this.props.socket, nonArchivedUsersIds);
  }

  _showNotifications() {
    let _this = this,
    { clickedId, receipientId } = this.state,
    { isloading, profile } = this.props;

    return this.props.sentNotif.map((item, index) => {
      let createdAtDate = item.created_at ? moment(item.created_at).format("DD MMM YYYY") : item.created_at,
       createdAtDateString = createdAtDate && moment().isSame(item.created_at, "day") === true ? "Today" : createdAtDate;

      return <div key={index} className="notif-list-item sent" onMouseEnter={_this._hideNotifybutton.bind(this, item._id)}>
        <div className="notif-bottle-full"></div>
        <div>
          <div><span>{profile.firstName+" "+profile.lastName}</span><span>{createdAtDateString}</span></div>
          <div><p>{item.message}</p></div>
          {receipientId === item._id ?
              <div>
                <ul className="notif-user-list">{_this._getReceipients(item.users)}</ul>
              </div>
              : 
              <div>
                <span>Receipt: </span>
                <span style={{cursor: "pointer"}} onClick={_this._showReceipients.bind(this, item._id)}>{item.archivedCount + "/" +item.users.length}</span>
              </div>}
            {receipientId === item._id && item.archivedCount < item.users.length &&
            (clickedId === item._id && isloading ? <button className="notif-green-button loading"><Loader /></button> :<button className="notif-green-button" onClick={_this._onNotifyAgainClick.bind(this, item._id, item.users)}>Notify Again</button>)}
        </div>
      </div>
    })
  }
  render() {
    if(this.props.show)
    return(
      <div className="notif-list">
        {this.props.sentNotif.length > 0 ? this._showNotifications() : <div className="no-data">No Sent Notifications</div>}
      </div>
    )
    else
    return null;
  }
}

function mapStateToProps(state) {
  return {
    sentNotif: state.notification.sentNotif,
    isloading: state.notification.isUpdateLoading,
    profile: state.user.profile
  };
}

export default connect(mapStateToProps, {getSentNotifications, notifyAgain, updateSentReceipients})(SentNotification);
