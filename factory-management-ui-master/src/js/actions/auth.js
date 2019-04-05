import axios from 'axios';
import jwtDecode from 'jwt-decode';
import {
  API_URL
} from '../util/config';
import {
  SIGNUP_SUCCESS,
  SIGNUP_FAILURE,
  SIGNIN_FAILURE,
  AUTH_USER,
  UNAUTH_USER,
  AUTH_LOADER,
  IS_ADMIN,
  NOT_ADMIN,
  IS_CAT_FETCHING,
  SHOW_CATEGORIES,
  VERIFY_FAILURE,
  IS_FETCHING,
  IS_FETCHED,
  VERIFY_SUCCESS
} from './types/index';

import { userProfileView } from './userActions';
import { getNotifications } from './notificationActions';

export function authToken() {
  let token = jwtDecode(localStorage.token);
  return function (dispatch) {

    if(token && (token.exp*1000 > new Date().getTime())){
    }else {
      dispatch(signoutUser)
    }
  }
}


/**
 * Error helper
 */
export function authError(CONST, error) {
  return {
    type: CONST,
    payload: error,
  };
}

/**
 * Sign up
 */
export function signupUser(props, history) {
  return function (dispatch) {

    dispatch({type: AUTH_LOADER, payload: {isloading: true}});
    
    axios.post(`${API_URL}/api/user`, props)
      .then((response) => {
        if(response.status){
          dispatch({ type: SIGNUP_SUCCESS });
          history.push(`/signup/success`);
        }else {
          dispatch(authError(SIGNUP_FAILURE, response.data.message));
        }
      })
      .catch((response) => {
          dispatch(authError(SIGNUP_FAILURE, response.response.data.message))
        }
      );
  }
}

/**
 * Sign in
 */
export function signinUser(props, history) {
  const { email, password } = props;
  return function (dispatch) {
    dispatch({type: AUTH_LOADER, payload: {isloading: true}});
    
    axios.post(`${API_URL}/api/auth`, { email, password })
      .then(response => { 
        if(response.data.success){
          localStorage.setItem('token', response.data.token);
          axios.defaults.headers.common['X-Access-Token']=localStorage.token;
          axios.defaults.headers.common['Cache-Control']='no-cache';
          dispatch(getNotifications());
          let decodeData = jwtDecode(response.data.token)
          dispatch({ type: AUTH_USER, payload: decodeData});
          dispatch(userProfileView(decodeData.userId));
        }else{
          dispatch(authError(SIGNIN_FAILURE, response.data.message));
        }
      })
      .catch((response) => dispatch(authError(SIGNIN_FAILURE, response.response.data.message)));
  }
}



/**
 * Sign out
 */
export function signoutUser(socket) {
  console.log("Signout");
  
  localStorage.clear();
  socket !== undefined && socket.disconnect();

  return {
    type: UNAUTH_USER,
  }
}

/**
 * Check Admin
 */

//TO_DO : Catch error
 export function checkAdmin() {
   return function (dispatch) {

     axios.get(`${API_URL}/api/users-verify`)
       .then(response => {
          if(response.data.status === "false"){
            dispatch({ type: IS_ADMIN });
          }else {
            dispatch({ type: NOT_ADMIN });
          }
       })
       .catch(response => {console.log("Admin error");});
   }
 }

 export function getCategories() {
   return function dispatch(dispatch) {
    dispatch({type: IS_CAT_FETCHING});
     axios.get(`${API_URL}/api/users-verify`)
     .then(function(response) {
       console.log("get requested initiated sorted");
       console.log(response.data.category);
       dispatch({type: SHOW_CATEGORIES, payload: response.data.category});
     })
     .catch(function(error) {
       console.log("ERROR!!!");
       console.log(error);
     })
   }
 }

 export function Fetching() {
   return function(dispatch) {
     dispatch({type: IS_CAT_FETCHING});
   }
 }

 export function verifyUser(token) {
   return function(dispatch) {
     dispatch({type: IS_FETCHING})
     axios.get(`${API_URL}/api/verify-user?token=${token}`)
     .then(function(response) {
       dispatch({type: IS_FETCHED})
       if(response.data.status){
         dispatch({type: VERIFY_SUCCESS});
       }else {
         dispatch({type: VERIFY_FAILURE, payload: response.data.code});
       }

     })
     .catch((response) => {
       dispatch({type: IS_FETCHED})
       dispatch(authError(VERIFY_FAILURE, response.response.data.code))
     });
   }
 }
