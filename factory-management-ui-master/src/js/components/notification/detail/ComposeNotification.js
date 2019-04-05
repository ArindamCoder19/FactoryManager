import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import DatePicker from 'react-datepicker';

import NotificationSearch from '../general/NotificationSearch';
import BackdropLoader from '../../general/BackdropLoader';

import { updateComposeData, sendNotFilledError } from "../../../actions/notificationActions";

class ComposeNotification extends Component {
  constructor() {
    super();

    this.state = {
      dueDate: null
    }
  }
  _handleDateChange(date, e) {
    e.stopPropagation();
    let { composeNotif, notFilledFields } = this.props;

    composeNotif["dueDate"] = date !== null ? date.format("YYYY-MM-DD") : null;


    if(notFilledFields.indexOf("dueDate") >= 0 && date != null){

      notFilledFields.splice(notFilledFields.indexOf("dueDate"), 1);
      this.props.sendNotFilledError(notFilledFields);
    }

    this.props.updateComposeData(composeNotif);
    this.setState({dueDate: date});
  }
  _showStaticList() {
    this.setState({showGeneric: true, showDD: !this.state.showDD})
  }

  _updateMessage(e) {
    // if(e.target.value.trim() !== ""){
      let { composeNotif, notFilledFields } = this.props;

      if(notFilledFields.indexOf("message") >= 0){

        notFilledFields.splice(notFilledFields.indexOf("message"), 1);
        this.props.sendNotFilledError(notFilledFields);
      }
      composeNotif["message"] = e.target.value.trim();
      this.setState({})
      this.props.updateComposeData(composeNotif);
    // }
  }

  render() {
    let { dueDate } = this.state,
    { notFilledFields, isLoading } = this.props;

    if(this.props.show)
      return(
        <div className="notif-compose">
          <NotificationSearch />
          <div className={notFilledFields.indexOf("dueDate") >= 0 ? "notif-red-border" : ""}>
            <DatePicker
                fixedHeight
                className={"icon-calendar"}
                selected={dueDate}
                dateFormat="DD MMM YYYY"
                placeholderText="Due date"
                onChange={this._handleDateChange.bind(this)}
            />
          </div>
          <div>
            <textarea className={notFilledFields.indexOf("message") >= 0 && "notif-red-border"} placeholder="Type your message here..." onKeyUp={this._updateMessage.bind(this)}></textarea>
          </div>
          {isLoading && <BackdropLoader show={true}/>}
        </div>
      )
    else {
      return null;
    }
  }
}

function mapStateToProps(state) {
  return {
    composeNotif: state.notification.composeNotif,
    notFilledFields: state.notification.notFilledFields,
    isLoading: state.notification.isLoading
  };
}

export default connect(mapStateToProps, {updateComposeData, sendNotFilledError})(ComposeNotification);
