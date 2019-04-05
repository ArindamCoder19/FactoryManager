import axios from 'axios';
import moment from 'moment';
import _ from 'lodash';

import {
  API_URL,
  CONFIG
} from '../util/config';
import {
  FILTER_TASKS_FULFILLED,
  SHOW_TASK_DETAIL,
  HIDE_TASK_DETAIL,
  IS_FETCHING,
  NEW_TASK,
  ADD_TASK,
  NEW_TASK_DATA,
  INITIAL_DATA,
  IS_FETCHED,
  SHOW_DATA_LOADING,
  UPDATE_COMMENTS,
  NEWTASK_FAILURE,
  TASK_ERROR
} from './types/index';
import { authToken, signoutUser } from './auth';


const getFilterURL = (payload, userID) => {
  let queryBuilder = [],
      getURL = `${API_URL}/api/tasks`;

  switch (payload["FILTER1"]) {
    case 'ALL':
      break;
    case "assignedTo":
      queryBuilder.push("developerId="+userID);
      break;
    case "lead":
      queryBuilder.push("leadId="+userID);
      break;
    case "review":
      queryBuilder.push("reviewerId="+userID);
      break;
    default: ""
  }


  switch (payload["FILTER2"]) {
    case 'ALL':
      break;
    case "completed":
      queryBuilder.push("status=CANCELLED&status=DELIVERED");
      break;
    case "incompleted":
      queryBuilder.push("status=NOT-STARTED&status=ESTIMATION-IN-PROGRESS&status=WAITING-FOR-CAB-APPROVAL&status=TS-IN-PROGRESS&status=DEV-IN-PROGRESS&status=DEV-ON-HOLD&status=TEST-ON-HOLD&status=FUT-IN-PROGRESS&status=TESTING-IN-PROGRESS");
      break;
    default: ""
  }

  if(payload["FILTER3"] != 'ALL'){
    queryBuilder.push("categoryId="+payload["FILTER3"])
  }

  if(payload["FILTER4"] != 'ALL'){
    queryBuilder.push("subcategoryId="+payload["FILTER4"])
  }

  if(payload["FILTER5"] != 'ALL'){
    queryBuilder.push("fromDate="+payload["FILTER5"])
  }

  if(payload["FILTER6"] != 'ALL'){
    queryBuilder.push("toDate="+payload["FILTER6"])
  }

  if(payload["FILTER7"] && payload["FILTER7"] != 'ALL'){
    queryBuilder.push("userId="+payload["FILTER7"])
  }

  if(payload["FILTER8"] && payload["FILTER8"] != 'ALL'){
    queryBuilder.push("t="+payload["FILTER8"])
  }

  // console.log(payload);

  if(queryBuilder.length > 0){
    getURL += "?"+queryBuilder.join("&");
  }

  return axios.get(getURL);
}
/*
 * Generic filter method for Tasks
 *
 */
export const filterTasks = (params, taskID) => {
  return (dispatch, store) => {
    getFilterURL(params, store().auth.userID).then(function (response) {

      let data = response.data.resData.data;

      //TO_DO: Better sorting technique
      let inprogressArray = [];
      let compLetedArray = [];


      data.forEach((item) => {
        if(item.status == "CANCELLED" || item.status == "DELIVERED"){
          compLetedArray.push(item);
        }else{
          inprogressArray.push(item);
        }
      });

      //due date - descending
      compLetedArray.sort((a, b)=>{
        if(a.plannedEndDate === undefined) {
          return -1;
        }
        else if(b.plannedEndDate === undefined){
          return 1;
        }

        else if(a.plannedEndDate === b.plannedEndDate){
          return 0;
        }
        else {
          return a.plannedEndDate > b.plannedEndDate ? -1 : 1;
        }
      });

      //due date - ascending
      inprogressArray.sort((a, b)=>{
        if(a.plannedEndDate === undefined) {
          return -1;
        }
        else if(b.plannedEndDate === undefined){
          return 1;
        }

        else if(a.plannedEndDate === b.plannedEndDate){
          return 0;
        }
        else {
          return a.plannedEndDate < b.plannedEndDate ? -1 : 1;
        }
      });

      let sortedData = inprogressArray.concat(compLetedArray);

      let downloadData = sortedData.map((item) => {
        return (
          {
            "RFC Number": item.rfcNumber ? item.rfcNumber : "",
            "Task Description": item.taskDescription ? item.taskDescription : "",
            "Priority": item.priority,
            "Status": item.status,
            "Wricef Type": item.wricefType,
            "Complexity": item.complexity,
            "Category": item.category[0] ? item.category[0].category : "",
            "Sub Category": item.subCategory[0] ? item.subCategory[0].subCategory : "",
            "Assigned To": item.assignedTo[0] ? item.assignedTo[0].firstName+" "+item.assignedTo[0].lastName : "",
            "Due Date": item.dueDate ? moment(item.dueDate).format('DD-MMM-YY') : "",
            "Lead": item.lead[0] ? item.lead[0].firstName+" "+item.lead[0].lastName : "",
            "Reviewer": item.reviewer[0] ? item.reviewer[0].firstName+" "+item.reviewer[0].lastName : "",
            "Functional Consultant": item.functionalConsultant[0] ? item.functionalConsultant[0].functionalConsultant : "",
            "SNOW Task Number": item.snowTaskNumber ? item.snowTaskNumber : "",
            "FSI Score": item.fsiScore ? item.fsiScore : "",
            "Project": item.project[0] ? item.project[0].projectName : "",
            "Planned Start Date": item.plannedStartDate ? moment(item.plannedStartDate).format('DD-MMM-YY') : "",
            "Planned End Date": item.plannedEndDate ? moment(item.plannedEndDate).format('DD-MMM-YY') : "",
            "Estimated Hours": item.estimatedHours ? item.estimatedHours: "",
            "Actual Start Date": item.actualStartDate ? moment(item.actualStartDate).format('DD-MMM-YY') : "",
            "Actual End Date": item.actualEndDate ? moment(item.actualEndDate).format('DD-MMM-YY') : "",
            "FS Received Date": item.fsRecievedDate ? moment(item.fsRecievedDate).format('DD-MMM-YY') : "",
            "Hrs. Utilized": item.hoursSpend ? item.hoursSpend : 0
          }
        )
      })

      let showtask = sortedData.length > 0 ? sortedData[0]._id : null;

      if(taskID && taskID!= null && _.find(sortedData, function(o) { return o._id == taskID }) != undefined){
        showtask = taskID;
      }
      dispatch({
        type: FILTER_TASKS_FULFILLED,
        payload:{
          data: sortedData,
          downloadData: downloadData,
          showtask: showtask,
          totalCount: sortedData.length,
          filter: {
            FILTER1: params.FILTER1,
            FILTER2: params.FILTER2,
            FILTER3: params.FILTER3,
            FILTER4: params.FILTER4,
            FILTER5: params.FILTER5,
            FILTER6: params.FILTER6,
            FILTER7: params.FILTER7,
            FILTER8: params.FILTER8
          }
        }
      })
      dispatch({type: IS_FETCHED});
    })
    .catch(function (error) {
      console.log(error);
    });
  }
}


export const taskUpdate = (args) => {
  return (dispatch) => {
    dispatch({type: SHOW_DATA_LOADING})
    axios.put(`${API_URL}/api/task/${args.taskID}`, args.payload)
    .then(function (response) {
      dispatch(filterTasks(args.filter, args.taskID))
    })
    .catch(function (error) {
    });
  }
}

export const closeDetails = () => {
  return (dispatch) => {
    dispatch({type: HIDE_TASK_DETAIL});
  }
}

export const showTaskDetail = (taskID) => {
  return (dispatch) => {
    dispatch({type: SHOW_TASK_DETAIL, payload: taskID})
  }
}

// export const isFetching = () => {
//   return (dispatch) => {
//     dispatch({type: IS_FETCHING});
//   }
// }

export const showNewTask = () => {
  return (dispatch) => {
    dispatch({type: NEW_TASK});
  }
}

export const addNewTask = (payload, filter) => {
  return (dispatch, state) => {
    axios.post(`${API_URL}/api/task`, payload)
    .then(function (response) {
      dispatch(filterTasks(filter, null))
    })
    .catch(function (error) {
      dispatch({type: IS_FETCHED})
      dispatch({type: NEWTASK_FAILURE, payload: error.response.data.error.message});
    });

  }
}

export const newtaskDataChange = (payload) => {
  return (dispatch) => {
    dispatch({type: NEW_TASK_DATA, payload});
  }
}


export const submitAComment = (payload, filter) => {
  return (dispatch) => {
    dispatch({type: SHOW_DATA_LOADING})
    axios.post(`${API_URL}/api/comment`, payload)
    .then(function (response) {
      dispatch(getComments(payload.taskId))
    })
    .catch(function (error) {
      console.log(error);
    });
  }
}

export const getComments = (taskId) => {
  return (dispatch) => {
    axios.get(`${API_URL}/api/comments?taskId=${taskId}`)
    .then(function (response) {
      dispatch({type: UPDATE_COMMENTS, payload: response.data});
    })
    .catch(function (error) {
      console.log(error);
    });
  }
}

export const deleteTask = (args) => {
  return (dispatch) => {
    dispatch({type: IS_FETCHING});
    axios.delete(`${API_URL}/api/task/${args.taskID}`)
    .then(function (response) {
      dispatch(filterTasks(args.filter, null));
    })
    .catch(function (error) {
      console.log(error);
    });
  }
}

export const setTaskErrorMessage = (errorObj) => {
  return (dispatch) => {
    dispatch({type: TASK_ERROR, payload: errorObj});
  }
}
