import axios from 'axios';
import _ from 'lodash';

import {
  API_URL
} from '../util/config';

import {
  NOTIF_TAB_SELECT,
  NOTIF_COMPOSE_NOTFILLED,
  NOTIF_SENT,
  NOTIF_COMPOSE_UPDATE,
  NOTIF_ISLOADING,
  NOTIF_UPDATE_SUCCESS,
  NOTIF_NEW_LIST,
  NOTIF_ARCHIVED_LIST,
  NOTIF_SENT_LIST,
  UPDATE_LOADING,
  NOTIF_PUSH_NEW_LIST,
  NOTIF_PUSH_ARCHIVED_LIST,
  NOTIF_UPDATE_COUNTER
} from './types/index';


export const updateTabSelected = (tab) => {
  return (dispatch) => {
    dispatch({type: NOTIF_TAB_SELECT, payload: tab})
  }
}

export const sendNotFilledError = (fields) => {
  return (dispatch) => {
    dispatch({type: NOTIF_COMPOSE_NOTFILLED, payload: fields})
  }
}

export const sendNotification = (payload, socket) => {
  return (dispatch) => {
    
    dispatch({type: NOTIF_ISLOADING});
    console.log(payload);
    
    axios.post(`${API_URL}/api/notification`, payload)
    .then(function (response) {

      let { notifId, userIdList } = response.data
      
      socket.emit("NotificationSent", {notifId: notifId, userIdList: userIdList});
      if(response.data.status === "success"){
        dispatch({type: NOTIF_TAB_SELECT, payload: 4});
        dispatch({type: NOTIF_SENT});
      }
      dispatch(getSentNotifications());
    })
    .catch(function (error) {
      console.log(error);
    });

  }
}

export const updateComposeData = (data) => {
  return (dispatch) => {

    dispatch({type: NOTIF_COMPOSE_UPDATE, payload: data})
  }
}

export const getNotifications = () => {
  return (dispatch) => {
    dispatch(getNewNotifications());
    dispatch(getArchivedNotifications());
    dispatch(getSentNotifications());
  }
}

export const getNewNotifications = () => {
  return (dispatch) => {
    axios.get(`${API_URL}/api/notifications?status=new&status=renotified`)
    .then(function (response) {
      let data = response.data;

      dispatch({type: NOTIF_NEW_LIST, payload: data});
      dispatch({type: NOTIF_UPDATE_COUNTER, payload: data.length});

    })
    .catch(function (error) {
      console.log(error);
    });

  }
}

export const pushNewNotif = (data) => {
  return (dispatch) => {

    dispatch({type: NOTIF_PUSH_NEW_LIST, payload: data});

  }
}

export const getArchivedNotifications = () => {
  return (dispatch) => {
    axios.get(`${API_URL}/api/notifications?status=archived`)
    .then(function (response) {
      let data = response.data;

      dispatch({type: NOTIF_ARCHIVED_LIST, payload: response.data})
    })
    .catch(function (error) {
      console.log(error);
    });

  }
}

export const updateSentReceipients = (data, sentNotifList) => {
  return (dispatch) => {
    let sentList =  Object.assign([], sentNotifList);
    let sentNotif = _.find(sentList, function(o) { return o._id == data.uniqueId });
    console.log(sentNotif);

    let user = _.find(sentNotif.users, function(o) { return o.user._id == data.userId });

    if(user.status === "new" || user.status === "renotified") {
      user.status = "archived";
      sentNotif.archivedCount++;
    }
    dispatch({type: NOTIF_SENT_LIST, payload: sentList});
  }
}

export const getSentNotifications = () => {
  return (dispatch) => {

    axios.get(`${API_URL}/api/sent-notifications`)
    .then(function (response) {
      let data = response.data;
      data.sort((a, b)=>{
        if(a.created_at === b.created_at){
          return 0;
        }
        else {
          return a.created_at > b.created_at ? -1 : 1;
        }
      });
      dispatch({type: NOTIF_SENT_LIST, payload: response.data})
    })
    .catch(function (error) {
      console.log(error);
    });

  }
}

export const updateCounter = (value) => {
  return (dispatch) => {
    dispatch({type: NOTIF_UPDATE_COUNTER, payload: value});
  }
}

export const updateNotification = (item, payload, count, socket) => {
  return (dispatch) => {
    dispatch({type: UPDATE_LOADING});
    axios.put(`${API_URL}/api/notification/${item._id}`, payload)
    .then(function (response) {

      if(response.data.status) {
        let newArchived =  Object.assign({}, item);
        newArchived.status = "archived";

        socket.emit("NotificationArc", {userId: item.user[0]._id, uniqueId: item.uniqueId, authorId: item.author[0]._id});
        
        dispatch({type: NOTIF_UPDATE_SUCCESS, payload: {isSuccess: true, msg: null, newId: item._id}})
        dispatch({type: NOTIF_PUSH_ARCHIVED_LIST, payload: newArchived});
        dispatch(updateCounter(count))
      }else {
        dispatch({type: NOTIF_UPDATE_SUCCESS, payload: {isSuccess: false, msg: "Could not update"}})
      }
    })
    .catch(function (error) {
      dispatch({type: NOTIF_UPDATE_SUCCESS, payload: {isSuccess: false, msg: "Error!"}});
    });

  }
}

export const socketNotifyAgainACK = (uniqueId, newNotifList) => {
  return (dispatch) => {
    let newList =  Object.assign([], newNotifList);

    let notifObj = _.find(newList, (item) => { return item.uniqueId == uniqueId});
    notifObj.status = "renotified";
    dispatch({type: NOTIF_NEW_LIST, payload: newList});
  }
}

export const notifyAgain = (id, socket, userIdList) => {
  return (dispatch) => {
    dispatch({type: UPDATE_LOADING});
    axios.put(`${API_URL}/api/notifyAgain?uniqueId=${id}`, {})
    .then(function (response) {
      if(response.data) {
        socket.emit("NotifyAgain", {uniqueId: id, userIdList: userIdList});
        dispatch({type: NOTIF_UPDATE_SUCCESS, payload: {isSuccess: true, msg: null}})
      }else {
        dispatch({type: NOTIF_UPDATE_SUCCESS, payload: {isSuccess: false, msg: "Could not update"}})
      }
    })
    .catch(function (error) {
      console.log(error);
    });

  }
}
