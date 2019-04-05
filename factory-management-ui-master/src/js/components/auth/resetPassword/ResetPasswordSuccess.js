import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class ResetPasswordSuccess extends Component {

  render() {
    return (
      <section className="intro">
        <div className="col-md-6 left  hidden-xs hidden-sm">
        </div>
        <div className="col-md-6 col-sm-12 right">
          <div id="logo">
            <b>FACTORY</b>
            <br/>MANAGER
          </div>

          <div className="success">
            <img id="success" src="/src/images/success.png" alt="Success"></img>
            <h2>Great! Congratulations on resetting you password.</h2>
          </div>
          <div className="end">
            <span>Already have an account? <Link to={'/signin'}>Sign In</Link></span>
          </div>
        </div>
      </section>
    );
  }
}

export default ResetPasswordSuccess ;
