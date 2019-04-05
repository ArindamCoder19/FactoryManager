import React, { Component } from 'react';
import { connect } from 'react-redux';

export default function(ComposedComponent, auth) {
  class Check extends Component {
    static contextTypes = {
      router: React.PropTypes.object
    }

    _checkAuth(props) {
      switch (auth) {
        case 'ADMIN':
          if(props.isadmin)
            this.context.router.history.push('/admin');
          break;
        case 'OTHERS':
          if(!props.isadmin)
            this.context.router.history.push('/signup');
          break;
        case 'SIGNIN':
          if(!props.authenticated)
            this.context.router.history.push('/signin');
          break;

        case 'SIGNUP':
          if(!props.signup)
            this.context.router.history.push('/signup');
          break;

        case 'RESET':
          if(!props.verifyResetPassword)
            this.context.router.history.push('/reset-password');
          break;

        case 'SIGNEDIN':
          if(props.authenticated)
            this.context.router.history.push('/dashboard');
          break;
        default:

      }
    }

    componentWillMount() {
      this._checkAuth(this.props);
    }

    componentWillUpdate(nextProps) {
      this._checkAuth(nextProps);
    }

    render() {
      return <ComposedComponent {...this.props} />
    }
  }

  function mapStateToProps(state) {
    return {
      signup: state.auth.signup,
      authenticated: state.auth.authenticated,
      role: state.auth.userRole,
      isadmin: state.auth.isadmin,
      verifyResetPassword: state.resetPass.resetPassword
    };
  }

  return connect(mapStateToProps)(Check);
}
