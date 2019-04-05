import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';

import authReducer from './authReducer';
import resetPasswordReducer from './resetPasswordReducer';
import userReducer from "./userReducer";
import taskReducer from "./taskReducer";
import generalReducer from "./generalReducer";
import timesheetReducer from "./timesheetReducer";
import dashboardReducer from "./dashboardReducer";
import futureScopeReducer from "./futureScopeReducer";
import dncReducer from "./dncReducer";
import productivityReducer from "./productivityReducer";
import notificationReducer from "./notificationReducer";

const appReducer = combineReducers({
  form,
  auth: authReducer,
  resetPass: resetPasswordReducer,
  user: userReducer,
  task: taskReducer,
  generic: generalReducer,
  timesheet: timesheetReducer,
  dashboard: dashboardReducer,
  futureScope: futureScopeReducer,
  dnc: dncReducer,
  productivity: productivityReducer,
  notification: notificationReducer
})

const rootReducer = (state, action) => {
  //w.r.t Dan Abramov's stackoverflow answer on resetting the state.
  if (action.type === 'UNAUTH_USER') {
    state = undefined;
  }

  return appReducer(state, action);
}

export default rootReducer;
