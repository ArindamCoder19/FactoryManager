import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import { getArchivedNotifications } from "../../../actions/notificationActions";

class ArchivedNotification extends Component {
  // componentWillMount() {
  //   this.props.getArchivedNotifications()
  // }

  _showNotifications() {
    return this.props.archivedNotif.map((item, index) => {
      let createdDate = moment().isSame(moment(item.created_at), "day") ? "Today" : moment(item.created_at).format("DD MMM YYYY");
      let dueDate = moment().isSame(moment(item.dueDate), "day") ? "Today" : moment(item.dueDate).format("DD MMM YYYY");

      return <div key={index} className="notif-list-item">
        <div className="notif-bottle-empty"></div>
        <div>
          <div><span>{item.author[0].firstName+" "+item.author[0].lastName}</span><span>{createdDate}</span></div>
          <div><p>{item.message}</p></div>
          <div><span>Due By: </span><span>{dueDate}</span></div>
        </div>
      </div>
    })
  }
  render() {
    if(this.props.show)
    return(
      <div className="notif-list">
        {this.props.archivedNotif.length > 0 ? this._showNotifications() : <div className="no-data">No Archived Notifications</div>}
      </div>
    )
    else 
    return null
  }
}

function mapStateToProps(state) {
  return {
    archivedNotif: state.notification.archivedNotif
  };
}

export default connect(mapStateToProps, {getArchivedNotifications})(ArchivedNotification);
