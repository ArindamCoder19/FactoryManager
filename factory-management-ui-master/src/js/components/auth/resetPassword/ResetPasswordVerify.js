import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { resetPassword } from '../../../actions/resetPassword';

class ResetPasswordVerify extends Component {
  constructor(props) {
    super(props);

    this.state = { resend: false };
  }

  componentWillMount() {
    // TO_DO: a better approach on parsing query string
    this.email = this.props.location.search.split('=')[1];

  }

  resendEmail(props) {
    this.setState({ resend: true });
    this.props.resetPassword(props);
  }

  render() {
    return (
      <section className="intro">
        <div className="col-md-6 left hidden-xs hidden-sm">
        </div>
        <div className="col-md-6 col-sm-12 right verify-pwd">
          <div id="logo">
            <b>FACTORY</b>
            <br/>MANAGER
          </div>
          <div className="success">
            <img id="success" src="/src/images/auth/icon-hero-email.svg" alt="Success"></img>
            <h2>Check your email</h2>
            <h4>If <b>{ this.email && this.email }</b> is associated with an account, you should receive an email containing instructions on how to create a new password</h4>
            <h4>Cheers.</h4>
            {
              this.props.errorMessage && this.props.errorMessage.resetPassword &&
                <div className="error-container">{ this.props.errorMessage.resetPassword }</div>
            }
          </div>
          <div className="end">
            <span>Already have an account? <Link to={'/signin'}>Sign In</Link></span>
          </div>
      </div>
      </section>

    )
  }
}

function mapStateToProps(state) {
  return { resetPasswordProgress: state.resetPass.resetPassword, errorMessage: state.resetPass.error };
}

let actions = { resetPassword };

export default connect(mapStateToProps, actions)(ResetPasswordVerify);
