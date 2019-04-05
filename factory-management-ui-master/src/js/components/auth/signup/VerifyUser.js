import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { verifyUser } from '../../../actions/auth';
import BackdropLoader from '../../general/BackdropLoader';

class VerifyUser extends Component {
  constructor(props) {
    super(props);
    const token = props.location.search.split('=')[1];
    props.verifyUser(token);
  }

  getErrorMsg() {

    switch (this.props.errorMessage.verifyUser) {
      case "FM_ERROR_EXCEED_24":
        return <div className="success error-container">
          <img className="error-img" src="/src/images/auth/icon-broken-bottle.svg" alt="Error"></img>
            <h2>User account expired!</h2>
            <h4>Please sign up again. Remember, you only have 24 hours to validate your email address after you sign up.</h4>
            <h4>Cheers.</h4>
        </div>
        break;
      case "FM_ERROR_INVALID_TOKEN":
        return <div className="success error-container">Invalid Token</div>
        break;
      default:
        return <div className="success error-container">Error</div>
    }
  }

  render() {
    if(this.props.isfetching)
      return <BackdropLoader show={this.props.isfetching}></BackdropLoader>
    else
    return (
      <section className="intro">
        <div className="col-md-6 left hidden-xs hidden-sm">
        </div>
        <div className="col-md-6 col-sm-12 right signup-verify">
          <div id="logo">
            <b>FACTORY</b>
            <br/>MANAGER
          </div>
          {
            this.props.verify ?
            <div className="success">
              <img id="success" src="/src/images/auth/icon-hero-admin.svg" alt="Success"></img>
              <h2>Awaiting Admin Approval!</h2>
              <h4>Hello! The admin is notified and you will receive an email when approved</h4>
              <h4>Cheers.</h4>
            </div>
            :
            this.getErrorMsg()
          }
          <div className="end">
            <span>Already have an account? <Link to={'/signin'}>Sign In</Link></span>
          </div>
        </div>
    </section>
    )
  }
}

function mapStateToProps(state) {
  return { errorMessage: state.auth.error,
    verify: state.auth.verify,
    isfetching: state.generic.isfetching};
}

export default connect(mapStateToProps, {verifyUser})(VerifyUser);
