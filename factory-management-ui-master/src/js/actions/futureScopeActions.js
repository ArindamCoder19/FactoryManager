import axios from 'axios';
import moment from 'moment';
import _ from 'lodash';

import {
  API_URL,
  CONFIG
} from '../util/config';
import {
  IS_FETCHING,
  FILTER_FS_FULFILLED,
  SHOW_FSDATA_LOADING,
  HIDE_FS_DETAIL,
  SHOW_FS_DETAIL,
  NEW_FS,
  IS_FETCHED,
  NEWFS_FAILURE,
  FS_ERROR,
  NEW_FS_DATA,
  FS_UPDATE_COMMENTS,
  SHOW_COMMENTS_LOADING
} from './types/index';
import { authToken, signoutUser } from './auth';


const getFilterURL = (payload) => {
  let queryBuilder = [],
      getURL = `${API_URL}/api/futureScopes`;

  if(payload["FILTER1"] != 'ALL'){
    queryBuilder.push("statusId="+payload["FILTER1"])
  }

  if(payload["FILTER3"] != 'ALL'){
    queryBuilder.push("categoryId="+payload["FILTER3"])
  }

  if(payload["FILTER4"] != 'ALL'){
    queryBuilder.push("subCategoryId="+payload["FILTER4"])
  }

  if(queryBuilder.length > 0){
    getURL += "?"+queryBuilder.join("&");
  }

  return axios.get(getURL);
}
/*
 * Generic filter method for Future Scope
 *
 */
export const filterFS = (params, fsID) => {
  return (dispatch, store) => {
    getFilterURL(params).then(function (response) {
      dispatch({type: IS_FETCHED});
      let data = response.data.data;
      let downloadData = data.map((item) => {
        return (
          {
            "Managed By": item.managedBy[0] ? item.managedBy[0].managedBy: "",
            "Status": item.status[0] ? item.status[0].status: "",
            "Project Name": item.projectName ? item.projectName : "",
            "Project Category": item.category[0] ? item.category[0].category: "",
            "Project Type": item.projectType[0] ? item.projectType[0].projectType: "",
            "Project Manager": item.projectManager ? item.projectManager : "",
            "Start Date": item.startDate ? moment(item.startDate).format('DD-MMM-YY'): "",
            "End Date": item.endDate ? moment(item.endDate).format('DD-MMM-YY'): "",
            "FTE Expected": item.fteExpected ? item.fteExpected : "",
            "Estimated Hours": item.estimatedHours ? item.estimatedHours : "",
            "Consumed Hours": item.consumedHours ? item.consumedHours : "",
          }
        )
      });

      data.sort((a, b)=>{
        if(a.startDate === undefined) {
          return -1;
        }
        else if(b.startDate === undefined){
          return 1;
        }

        else if(a.startDate === b.startDate){
          return 0;
        }
        else {
          return a.startDate < b.startDate ? -1 : 1;
        }
      });

      let showfs = data.length > 0 ? data[0]._id : null;

      if(fsID && fsID!= null && _.find(data, function(o) { return o._id == fsID }) != undefined){
        showfs = fsID;
      }

      dispatch({
        type: FILTER_FS_FULFILLED,
        payload:{
          data: data,
          downloadData: downloadData,
          totalCount: data.length,
          showfs: showfs,
          filter: {
            FILTER1: params.FILTER1,
            FILTER2: params.FILTER2,
            FILTER3: params.FILTER3,
            FILTER4: params.FILTER4
          }
        }
      })
    })
    .catch(function (error) {
      console.log(error);
    });

  }
}


export const fsUpdate = (args) => {
  return (dispatch) => {
    dispatch({type: SHOW_FSDATA_LOADING})
    axios.put(`${API_URL}/api/futureScope/${args.fsID}`, args.payload)
    .then(function (response) {
      dispatch(filterFS(args.filter, args.fsID))
    })
    .catch(function (error) {
    });
  }
}

export const closeDetails = () => {
  return (dispatch) => {
    dispatch({type: HIDE_FS_DETAIL});
  }
}

export const showFSDetail = (fsID) => {
  return (dispatch) => {
    dispatch({type: SHOW_FS_DETAIL, payload: fsID})
  }
}

export const isFetching = () => {
  return (dispatch) => {
    dispatch({type: IS_FETCHING});
  }
}

export const showNewFS = () => {
  return (dispatch) => {
    dispatch({type: NEW_FS});
  }
}

export const addNewFS = (payload, filter) => {
  return (dispatch, state) => {
    console.log(payload);
    axios.post(`${API_URL}/api/futureScope`, payload)
    .then(function (response) {
      if(response.data.status && response.data.status == "false"){
        dispatch({type: IS_FETCHED})
        dispatch({type: NEWFS_FAILURE, payload: response.data.message});
      }else{
        dispatch(filterFS(filter, null))
      }

    })
    .catch(function (error) {
      dispatch({type: IS_FETCHED})
      dispatch({type: NEWFS_FAILURE, payload: error.response.data.error.message});
    });

  }
}

export const deleteFS = (args) => {
  return (dispatch) => {
    dispatch({type: IS_FETCHING});
    axios.delete(`${API_URL}/api/futureScope/${args.fsID}`)
    .then(function (response) {
      dispatch(filterFS(args.filter, null));
    })
    .catch(function (error) {
      console.log(error);
    });
  }
}

export const newFSDataChange = (payload) => {
  return (dispatch) => {
    dispatch({type: NEW_FS_DATA, payload});
  }
}

export const setFSErrorMessage = (errorObj) => {
  return (dispatch) => {
    dispatch({type: FS_ERROR, payload: errorObj});
  }
}

export const submitAComment = (payload, filter) => {
  return (dispatch) => {
    dispatch({type: SHOW_FSDATA_LOADING});
    axios.post(`${API_URL}/api/comment`, payload)
    .then(function (response) {
      let showCommentsLoader = false;
      dispatch(getComments(payload.futureScopeId, showCommentsLoader))
    })
    .catch(function (error) {
      console.log(error);
    });
  }
}

export const getComments = (fsId, showCommentsLoader) => {
  return (dispatch) => {
    showCommentsLoader && dispatch({type: SHOW_COMMENTS_LOADING});
    axios.get(`${API_URL}/api/comments?futureScopeId=${fsId}`)
    .then(function (response) {
      dispatch({type: FS_UPDATE_COMMENTS, payload: response.data});
    })
    .catch(function (error) {
      console.log(error);
    });
  }
}
