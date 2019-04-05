import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class SignupSuccess extends Component {
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
              <img id="success" src="/src/images/auth/icon-hero-email.svg" alt="Success"></img>
              <h2>Verify your email address.</h2>
              <h4>A confirmation email is on its way!. The email contains a link to verify your email address.</h4>
                <h4>Cheers.</h4>
            </div>
            <div className="end">
              <span>Already have an account? <Link to={'/signin'}>Sign In</Link></span>
            </div>
          </div>
        </section>
      );
    }
}

export default SignupSuccess ;
