import React, { Component } from 'react';

class SuccessNotification extends Component {

  render() {
    if(this.props.show)
    return(
      <div style={{padding: "65px"}}>
        <div className="success">
          <img id="success" src="/src/images/icon-bottle-full.svg" alt="Success"></img>
          <h2>Notification Sent!</h2>
          <h4>Let's wait to hear back.</h4>
            <h4>Cheers.</h4>
        </div>
      </div>
    )
    else {
      return null
    }
  }
}

export default (SuccessNotification);
