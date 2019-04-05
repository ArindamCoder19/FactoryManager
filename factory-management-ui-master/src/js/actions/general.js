import axios from 'axios';
import moment from 'moment';

import { API_URL } from '../util/config';
import {
  INITIAL_DATA,
  SHOW_MODAL,
  CLOSE_MODAL,
  IS_FETCHING,
  SHOW_DATA_UPDATING,
  SHOW_DATA_UPDATED,
  BADGE_COUNT,
  MODAL_ERROR,
  CLOSE_MODAL_ERROR,
  CURRENT_PAGE,
  CATEGORY_LIST,
  VIEW_PROFILE,
  USER_SELECTED_TIMESHEET,
  INITIAL_LOADED,
  INITIAL_FS_DATA,
  SUBCATEGORY_LIST,
  NOTIF_NEW_LIST
} from './types/index';

import { filterUsers } from './userActions';
import {
  getUserTasks,
  onUserChange,
  getUserList
} from './timesheetActions';
import {
  getDBUserList,
  getDashboardData
} from './dashboardActions';
import {
  getDnCData
} from './dncActions';
import {
  getProdData
} from './productivityActions';
import { filterTasks } from './taskActions';
import { signoutUser } from './auth';

export const closeModal = () => {
  return function (dispatch) {
    dispatch({type: CLOSE_MODAL});
  }
}

export const closeModalError = () => {
  return function (dispatch) {
    dispatch({type: CLOSE_MODAL_ERROR});
  }
}

export const isFetching = () => {
  return function(dispatch) {
    dispatch({type: IS_FETCHING});
  }
}

export const showModal = (info) => {
 return (dispatch, store) =>{
   dispatch({type: SHOW_DATA_UPDATING})
   axios.get(`${API_URL}/${info.listApi}`).then((response) => {

     // let payload = {};
     //
     // payload["categories"] = store().generic.categories;
     // payload["subCategories"] = store().generic.subCategories;
     // payload["projects"] = store().generic.projects;
     // payload["functionalConsultants"] = store().generic.functionalConsultants;

     // payload[info.storeName] = response.data.data;
     dispatch({
       type: SHOW_MODAL,
       payload: {
         data: response.data.data,
         info: info
       }
     })

     dispatch({type: info.storeName, payload: response.data.data});
     dispatch({type: SHOW_DATA_UPDATED});
   })
   .catch(response => {dispatch({type: MODAL_ERROR, payload: response.response.data.message})});
 }
}


export const addTaskItems = (value, info) => {
   return (dispatch, store) => {

     let payload = {};
     payload[info.payloadName] = value;
     axios.post(`${API_URL}/${info.addApi}`, payload).then(response => {

         dispatch(showModal(info));
     })
     .catch(response => {dispatch({type: MODAL_ERROR, payload: response.response.data.message})});
   }
 }

 export const deleteModalItem = (id, info) => {
    return (dispatch, store) => {

      axios.delete(`${API_URL}/${info.addApi}/${id}`).then(response => {

          dispatch(showModal(info));
      })
      .catch(response => {dispatch({type: MODAL_ERROR, payload: response.response.data.message})});
    }
  }


 const getTaskCount = () => {
    return axios.get(`${API_URL}/api/dashboard`)
 }

 const getUserCount = () => {
    return axios.get(`${API_URL}/api/dashboard`)
 }

 export const getCount = () => {
  return (dispatch) => {
    axios.get(`${API_URL}/api/dashboard`)
      .then(response => {
        dispatch({
          type: BADGE_COUNT,
          payload: {
            taskcount: response.data.t,
            usercount: response.data.c
          }
        })
      })
      .catch(response => {console.log("Admin error");});

  }
 }

 export const currentPage = (page) => {
  return (dispatch) => {
    dispatch({
      type: CURRENT_PAGE,
      payload: page
    })

  }
 }

 const getCategories = () => {
    return axios.get(`${API_URL}/api/categories`)
 }

 const userProfile = (userID) => {
    return axios.get(`${API_URL}/api/user/${userID}`)
 }

 const getSubCategories = () => {
    return axios.get(`${API_URL}/api/subCategories`)
 }

 const getProjects = () => {
    return axios.get(`${API_URL}/api/futureScopes`)
 }

 const getFunctionalConsultant = () => {
    return axios.get(`${API_URL}/api/search-fc`)
 }

 const getStatuses = () => {
   return axios.get(`${API_URL}/api/statusFS`)
 }

 const getProjectType = () => {
   return axios.get(`${API_URL}/api/projectType`)
 }

 const getManagedBy = () => {
   return axios.get(`${API_URL}/api/managedBy`)
 }

 const getNewNotifications = () => {
   return axios.get(`${API_URL}/api/notifications?status=new&status=renotified`)
 }

 export const getTimesheetInitialData = (userDetails, showUserTasks, showOnUserChange, showUserList) => {
  return (dispatch) => {
    dispatch({type: IS_FETCHING});
    axios.all([userProfile(userDetails.userID)])
     .then(axios.spread(function (usesInfo) {
         let data = usesInfo.data.data;
         dispatch({type: VIEW_PROFILE, payload: data});
         let payload = {
           label: data.firstName+ " " +data.lastName,
           value: data._id,
           sn: data.firstName[0].toUpperCase()+data.lastName[0].toUpperCase(),
           created_at: data.created_at,
           role: data.role
         };

         dispatch({type: USER_SELECTED_TIMESHEET, payload: payload});

         dispatch({type: INITIAL_LOADED});


         if(showUserTasks)
          dispatch(getUserTasks(payload));

         if(showOnUserChange)
          dispatch(onUserChange(payload, moment().weekday(5), false));

         if(showUserList){
           let userInfo = {
             userID: userDetails.userID,
             userRole: userDetails.userRole,
             userSelected: payload
           }
           dispatch(getUserList(userInfo, moment().weekday(5)))
         }
     }));
  }
 }


 export const getDashboardInitialData = (userID, showUserList, userRole) => {
  return (dispatch) => {
    dispatch({type: IS_FETCHING});
    axios.all([getCategories(), userProfile(userID)])
     .then(axios.spread(function (categories, usesInfo) {
       if(categories.data.success == undefined){
         let data = usesInfo.data.data;
         dispatch({type: VIEW_PROFILE, payload: data});
         dispatch({
           type: CATEGORY_LIST,
           payload: categories.data.data,
        });

        if(showUserList)
          dispatch(getDBUserList(userRole));

        let args = {
          isUser: true,
          data: {label: "Overview", value: "all"} //Initialize
        }
        dispatch(getDashboardData(args));

        dispatch({type: INITIAL_LOADED});
       }else {
         dispatch(signoutUser())
       }
     }));
  }
 }

 export const getUsersInitialData = (userID, defaultFilter) => {
  return (dispatch) => {
    dispatch({type: IS_FETCHING});
    axios.all([getCategories(), userProfile(userID)])
     .then(axios.spread(function (categories, usesInfo) {
       if(categories.data.success == undefined){
         console.log(defaultFilter);
         dispatch(filterUsers(defaultFilter, null));
         let data = usesInfo.data.data;
         dispatch({type: VIEW_PROFILE, payload: data});
         dispatch({
           type: CATEGORY_LIST,
           payload: categories.data.data,
        })
        
        dispatch({type: INITIAL_LOADED});
       }else {
         dispatch(signoutUser())
       }
     }));
  }
 }

 export const getTaskInitialData = (userID, defaultFilter) => {
  return (dispatch) => {
    dispatch({type: IS_FETCHING});
    axios.all([getCategories(), getSubCategories(), getProjects(), getFunctionalConsultant(), userProfile(userID)])
     .then(axios.spread(function (categories, subCategories, projects, functionalConsultants, usesInfo) {
       if(categories.data.success == undefined){
         dispatch(filterTasks(defaultFilter, null));
         let data = usesInfo.data.data;
         dispatch({type: VIEW_PROFILE, payload: data});

         let pdata = [];
         projects.data.data.forEach((item) => {
           if(!_.includes(['CANCELLED', 'CLOSED'], item.status[0].status))
            pdata.push({_id: item._id, projectName: item.projectName, category: item.category, subCategory: item.subCategory});
         });

        dispatch({
           type: INITIAL_DATA,
           payload: {
             categories: categories.data.data,
             subCategories: subCategories.data.data,
             projects: pdata,
             functionalConsultants: functionalConsultants.data.data
           }
         });
       }else {
         dispatch(signoutUser())
       }
     }));
  }
 }

 export const getFSInitialData = (userID) => {
  return (dispatch) => {
    dispatch({type: IS_FETCHING});
    axios.all([getCategories(),
      getSubCategories(),
      userProfile(userID),
      getManagedBy(),
      getStatuses(),
      getProjectType()])
     .then(axios.spread(function (categories, subCategories, usesInfo, managedBy, statuses, projectType) {
       if(categories.data.success == undefined){
         let data = usesInfo.data.data;
         dispatch({type: VIEW_PROFILE, payload: data});
         dispatch({
           type: INITIAL_FS_DATA,
           payload: {
             categories: categories.data.data,
             subCategories: subCategories.data.data,
             fsStatus: statuses.data.data,
             projectType: projectType.data.data,
             managedBy: managedBy.data.data
           }
         })

         dispatch({type: INITIAL_LOADED});
       }else {
         dispatch(signoutUser())
       }
     }));
  }
 }

 export const getDnCInitialData = (userID) => {
  return (dispatch) => {
    dispatch({type: IS_FETCHING});
    axios.all([getCategories(), getSubCategories(), userProfile(userID)])
     .then(axios.spread(function (categories, subCategories, usesInfo) {
       if(categories.data.success == undefined){
         let data = usesInfo.data.data;
         dispatch({type: VIEW_PROFILE, payload: data});
         dispatch({
           type: CATEGORY_LIST,
           payload: categories.data.data,
         });

        dispatch({
          type: SUBCATEGORY_LIST,
          payload: subCategories.data.data,
        });

        let args = {
          data: {label: "Overview", value: "all"} //Initialize
        }
        dispatch(getDnCData(args));
        dispatch({type: INITIAL_LOADED});

       }else {
         dispatch(signoutUser())
       }
     }));
  }
 }

 export const getProdInitialData = (userID) => {
  return (dispatch) => {
    dispatch({type: IS_FETCHING});
    axios.all([getCategories(), userProfile(userID)])
     .then(axios.spread(function (categories, usesInfo) {
       if(categories.data.success == undefined){
         let data = usesInfo.data.data;
         dispatch({type: VIEW_PROFILE, payload: data});
         dispatch({
           type: CATEGORY_LIST,
           payload: categories.data.data,
         });
        //
        // dispatch({
        //   type: SUBCATEGORY_LIST,
        //   payload: subCategories.data.data,
        // })
        
        let args = {label: "Overview", value: "all"};
        dispatch(getProdData(args, false, moment().year()));
        dispatch({type: INITIAL_LOADED});

       }else {
         dispatch(signoutUser())
       }
     }));
  }
 }
