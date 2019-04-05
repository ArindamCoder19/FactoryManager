import React, { Component } from 'react';
import { Route } from "react-router-dom";
import { connect } from 'react-redux';
import Loadable from 'react-loadable';

import { checkAdmin } from './actions/auth';
import requireCheck from './components/auth/require/RequireCheck';
import allowedRoles from './components/auth/require/AllowedRoles';
import AppLayout from './components/AppLayout' ;
import 'react-datepicker/dist/react-datepicker-cssmodules.min.css';
import 'react-select/dist/react-select.min.css';

const Loading = () => <span></span>;

const Signin = Loadable({
  loader: () => import('./components/auth/signin/Signin'),
  loading: Loading,
});

const Signup = Loadable({
  loader: () => import('./components/auth/signup/Signup'),
  loading: Loading,
});

const AdminSignup = Loadable({
  loader: () => import('./components/auth/signup/AdminSignup'),
  loading: Loading,
});

const SignupSuccess = Loadable({
  loader: () => import('./components/auth/signup/SignupSuccess'),
  loading: Loading,
});

const VerifyUser = Loadable({
  loader: () => import('./components/auth/signup/VerifyUser'),
  loading: Loading,
});

const ResetPassword = Loadable({
  loader: () => import('./components/auth/resetPassword/ResetPassword'),
  loading: Loading,
});

const ResetPasswordVerify = Loadable({
  loader: () => import('./components/auth/resetPassword/ResetPasswordVerify'),
  loading: Loading,
});

const ResetPasswordNew = Loadable({
  loader: () => import('./components/auth/resetPassword/ResetPasswordNew'),
  loading: Loading,
});

const ResetPasswordSuccess = Loadable({
  loader: () => import('./components/auth/resetPassword/ResetPasswordSuccess'),
  loading: Loading,
});

class RouteList extends Component {
  constructor(props) {
    super(props);
    props.checkAdmin();
  }

  render() {
      return (
        <div>
          {/* After Signin Routes */}
          <Route exact path="/dashboard" component={allowedRoles(AppLayout, ["ADMIN", "DEVELOPER", "LEAD", "MANAGER", 'GUEST'])} />
          <Route exact path="/tasks" component={allowedRoles(AppLayout, ["ADMIN", "DEVELOPER", "LEAD", "MANAGER", "GUEST"])} />
          <Route exact path="/timesheet" component={allowedRoles(AppLayout, ["ADMIN", "DEVELOPER", "LEAD", "MANAGER"])} />
          <Route exact path="/users" component={allowedRoles(AppLayout, ["ADMIN"])} />
          <Route exact path="/users/userReq" component={allowedRoles(AppLayout, ["ADMIN"])} />
          <Route exact path="/future-scope" component={allowedRoles(AppLayout, ["ADMIN", "DEVELOPER", "LEAD", "MANAGER", 'GUEST'])} />
          {<Route exact path="/dnc" component={allowedRoles(AppLayout, ["ADMIN", "LEAD", "MANAGER", 'GUEST'])} />}
          {<Route exact path="/productivity" component={allowedRoles(AppLayout, ["ADMIN", "LEAD", "MANAGER", 'GUEST'])} />}

          {/* Signin, Signup, ResetPassword Routes */}
          <Route exact path="/" component={requireCheck(Signin, "SIGNEDIN")} />
          <Route exact path="/signin" component={requireCheck(Signin, "SIGNEDIN")} />
          <Route exact path="/signup" component={requireCheck(Signup, "ADMIN")} />
          <Route exact path="/admin" component={requireCheck(AdminSignup, "OTHERS")} />
          <Route exact path="/signup/success" component={SignupSuccess} />
          <Route exact path="/signup/verifyUser" component={VerifyUser} />
          <Route exact path="/reset-password" component={ResetPassword} />
          <Route exact path="/reset-password/verify/:email?" component={ResetPasswordVerify} />
          <Route exact path="/reset-password/new" component={ResetPasswordNew} />
          <Route exact path="/reset-password/new/success" component={ResetPasswordSuccess} />

        </div>
      )
    }
}


export default connect(null, { checkAdmin }, null, {pure: false})(RouteList);
