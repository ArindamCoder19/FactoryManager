import axios from 'axios';

import {
  API_URL,
  CONFIG
} from '../util/config';
import {
  FILTER_USERS_FULFILLED,
  SHOW_USER_DETAIL,
  DELETE_USER_FULFILLED,
  HIDE_USER_DETAIL,
  IS_FETCHING,
  IS_PROFILE_FETCHING,
  IS_FETCHED,
  VIEW_PROFILE,
  USER_SELECTED_TIMESHEET
} from './types/index';
import { authToken, signoutUser } from './auth';

/*
 * Generic filter method for Users and User Requests
 * difference: users(status: active/inactive), userReq(status: approval-pending)
 */
export const filterUsers = (payload, userID) => {
  return (dispatch) => {
    dispatch(authToken());
    dispatch({type: IS_FETCHING});
    let queryBuilder = [],
        filterNames = {FILTER1: "status", FILTER2: "", FILTER3: "role", FILTER4: "subRole", FILTER5: "userId"}, //FILTER2: NA
        getURL = `${API_URL}/api/users`;

    for(let i in payload) {
      // Apply filters which are not "ALL"
      if(payload[i] != 'ALL') {
        queryBuilder.push(filterNames[i]+"="+payload[i]);
      }
    }

    if(queryBuilder.length > 0){
      getURL += "?"+queryBuilder.join("&");
    }

    axios.get(getURL)
    .then(function (response) {
      let data = response.data.data;
      dispatch({type: IS_FETCHED});
      dispatch({
        type: FILTER_USERS_FULFILLED, payload:{
        data: data,
        totalCount: data.length,
        showuser: (userID && userID!= null) ? userID : (response.data.data.length > 0 ? response.data.data[0]._id : null),
        filter: {
          FILTER1: payload.FILTER1,
          FILTER2: payload.FILTER2,
          FILTER3: payload.FILTER3,
          FILTER4: payload.FILTER4,
          FILTER5: payload.FILTER5
        }}
      })
    })
    .catch(function (error) {
      console.log(error);
    });

  }
}

export const deleteUser = (args) => {
  return (dispatch) => {
    dispatch({type: IS_FETCHING});
    axios.delete(`${API_URL}/api/user/${args.userID}`)
    .then(function (response) {
      dispatch(filterUsers(args.filter, null));
    })
    .catch(function (error) {
      console.log(error);
    });
  }
}

export const userUpdate = (args) => {
  return (dispatch) => {
    dispatch({type: IS_FETCHING});
    axios.put(`${API_URL}/api/user/${args.userID}`, args.payload)
    .then(function (response) {
      let showuser = args.isStatus ? null : args.userID;
      dispatch(filterUsers(args.filter, showuser))
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
  }
}

export const closeDetails = () => {
  return (dispatch) => {
    dispatch({type: HIDE_USER_DETAIL});
  }
}

export const showUserDetail = (userID) => {
  return (dispatch) => {
    dispatch({type: SHOW_USER_DETAIL, payload: userID})
  }
}

export function userProfileView(userID) {
  return function(dispatch) {
    axios.get(`${API_URL}/api/user/${userID}`)
    .then(function (response) {
      let data = response.data.data;
      dispatch({type: VIEW_PROFILE, payload: data});
      dispatch({type: USER_SELECTED_TIMESHEET, payload: {
        label: data.firstName+ " " +data.lastName,
        value: data._id,
        sn: data.firstName[0].toUpperCase()+data.lastName[0].toUpperCase()
      }});
      console.log(response.data.data);
    })
    .catch(function (error) {
      console.log(error);
    });
  }
}

export function updateProfile(userID, payload) {
  return function(dispatch) {
    axios.put(`${API_URL}/api/user/${userID}`, payload)
    .then(function (response) {
      let data = response.data.data;
      dispatch({type: VIEW_PROFILE, payload: response.data.data});

      console.log(response.data.data);
    })
    .catch(function (error) {
      console.log(error);
    });
  }
}


export function isProfileFetching() {
  return function(dispatch) {
    dispatch({type: IS_PROFILE_FETCHING});
  }
}
