import React, { Component } from 'react';

import Loader from './Loader';

export default class BackdropLoader extends Component {
  render() {
    return (
      <div 
        className="backdrop"
        style={this.props.show ? {display: "block"} : {display: "none"}}>
        <Loader />
      </div>
    )
  }
}
