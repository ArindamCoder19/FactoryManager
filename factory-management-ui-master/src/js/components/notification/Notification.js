import React, { Component } from 'react';
import { connect } from 'react-redux';
import onClickOutside from 'react-onclickoutside';

import NotificationHeader from './NotificationHeader';
import NotificationTabs from './NotificationTabs';
import NotificationBody from './NotificationBody';
import { updateTabSelected, pushNewNotif, updateCounter } from '../../actions/notificationActions';

class Notification extends Component {
  constructor(props) {
    super(props) ;
    this.state = {
      showNotif: false
    }
  }

  componentDidMount() {
    console.log("Notification Mounted");
    let _this = this;
    this.props.socket.on('newNotif', (data) => {
      console.log("newNotif");
      
      _this.props.pushNewNotif(data);
      let count = _this.props.count + 1;
      _this.props.updateCounter(count)

      _this.setState({})
    })
  }

  onClickNotif() {
    this.setState({showNotif: !this.state.showNotif});
  }

  handleClickOutside(e) {
    if(!e.currentTarget.activeElement.classList.contains("react-datepicker-ignore-onclickoutside")){
       this.setState({ showNotif: false });
      //  console.log("handleClickOutside notification");
    }
 }

  render() {
    
    let { showNotif } = this.state;
    let { count, socket } = this.props;
    return(
      <div className="notification">
        <div className="notif-icon" style = {{position: "relative"}} onClick={this.onClickNotif.bind(this)}>
          {count > 0 && <div className="notif-pop" >
            <span>{count}</span>
          </div>}
        </div>
        {showNotif && <div className="notif-main">
          <NotificationHeader socket={socket}/>
          <NotificationTabs />
          <NotificationBody socket={socket}/>
        </div>}

      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    count: state.notification.count,
    userID: state.auth.userID
  };
}

export default connect(mapStateToProps, {updateTabSelected, pushNewNotif, updateCounter})(onClickOutside(Notification));
