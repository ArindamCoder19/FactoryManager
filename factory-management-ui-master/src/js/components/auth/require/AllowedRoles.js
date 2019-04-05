import React, { Component } from 'react';
import { connect } from 'react-redux';

export default function(ComposedComponent, allowedRoles) {
  class CheckRoles extends Component {
    static contextTypes = {
      router: React.PropTypes.object
    }
    constructor(props) {
      super(props);

      let allowed = true;
      if(this.props.userRole){
        this.props.userRole.forEach( (role) => {
          if(_.includes(allowedRoles, role))
            allowed = true
          else
            allowed = false

        })
      }else {
        allowed = false;
      }
      this.state = {
        allowed: allowed
      }
    }
    _checkAuth(props) {
      if(!props.authenticated)
        this.context.router.history.push('/signin');
    }
    componentWillMount() {
      this._checkAuth(this.props);
    }

    componentWillUpdate(nextProps) {
      this._checkAuth(nextProps);
    }
    render() {
      if(this.state.allowed)
        return (
          <ComposedComponent {...this.props} />
        )
      else
        return <div>Not Allowed</div>
    }
  }

  function mapStateToProps(state) {
    return {
      userRole: state.auth.userRole,
      authenticated: state.auth.authenticated
    };
  }

  return connect(mapStateToProps)(CheckRoles);
}
