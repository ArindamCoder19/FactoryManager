import axios from 'axios';
import moment from 'moment';
import _ from 'lodash';

import {
  API_URL,
  CONFIG
} from '../util/config';

import {
  NON_PRODUCTIVE_ITEMS
} from '../util/constants';
import {
  SET_WEEK_DATA,
  USER_TASK_LIST,
  USER_LIST,
  TIMESHEET_DATA,
  PREV_TIMESHEET_DATA,
  IS_FETCHING,
  IS_FETCHED,
  CLOSE_TIMESHEET_POPUP,
  TIME_VALID
} from './types/index';


export const setWeekData = (date) => {
  return (dispatch) => {

    /*Previous 3 weeks w.r.t week selected*/
    let payload = {
      weekSelected: date,
      previousWeeks: [
        {id: moment(date).weekday(-2-0), name: moment(date).weekday(-2-0).format('DD MMM YYYY')},
        {id: moment(date).weekday(-2-7), name: moment(date).weekday(-2-7).format('DD MMM YYYY')},
        {id: moment(date).weekday(-2-14), name: moment(date).weekday(-2-14).format('DD MMM YYYY')},
      ]
    }
    dispatch({type: SET_WEEK_DATA, payload});
  }
}

const getProductiveTasks = (userId) => {
   return axios.get(`${API_URL}/api/tasks?userId=${userId}`);
}

const getNonProductiveTasks = (details) => {
   return axios.get(`${API_URL}/api/nonproductives`);
}

export const getUserTasks = (userDetails) => {

  return (dispatch) => {
    let url = `${API_URL}/api/tasks?userId=${userDetails.value}`;
    if(_.includes(userDetails.role, 'LEAD')){
      // url += `&leadId=${userDetails.value}`;
    }

    axios.get(url)
    .then(function (response) {
      let taskDelivered = [],
      taskInprogress = [];
      response.data.resData.data.forEach((item) => {
        let hoursSpent = item.hoursSpend ? item.hoursSpend : 0,
        estimatedHours = item.estimatedHours ? item.estimatedHours : 0;

        if(item.status == "DELIVERED" || item.status == "CANCELLED"){
          taskDelivered.push({
            label: item.rfcNumber,
            value: item._id,
            addInfo: {
              taskDescription: item.taskDescription,
              timespent: hoursSpent+"/"+estimatedHours
            },
            isProductive: true
          });
        }else {
          taskInprogress.push({
            label: item.rfcNumber,
            value: item._id,
            addInfo: {
              taskDescription: item.taskDescription,
              timespent: hoursSpent+"/"+estimatedHours
            },
            isProductive: true
          });
        }
      });

      dispatch({type: USER_TASK_LIST, payload: {
        taskDelivered: taskDelivered,
        taskInprogress: taskInprogress,
        taskNonprod: NON_PRODUCTIVE_ITEMS
      }})
    })
    .catch(function (error) {
    });
  }
}


export const getUserList = (userDetails, weekSelected) => {
  return (dispatch) => {
    let role = 'DEVELOPER,LEAD', //Display when user logged in as an ADMIN/Manager
    showSubmittedTS = true;
    if(_.includes(userDetails.userRole, 'LEAD')){
      role = 'DEVELOPER'
    }

    axios.get(`${API_URL}/api/users?role=${role}&status=active`)
    .then(function (response) {
      let userSelected = {};
      let userlist = response.data.data.map((item) => {
        if(item._id === userDetails.userID){
          userSelected = {
            label: item.firstName+" "+item.lastName,
            value: item._id,
            sn: item.firstName[0].toUpperCase()+item.lastName[0].toUpperCase(),
            created_at: item.created_at,
            role: item.role
          }
        }
        return {
          label: item.firstName+" "+item.lastName,
          value: item._id,
          sn: item.firstName[0].toUpperCase()+item.lastName[0].toUpperCase(),
          created_at: item.created_at,
          role: item.role
        }
      })

      if(_.includes(userDetails.userRole, 'LEAD')){
        userlist.unshift(userDetails.userSelected);
        userSelected = userDetails.userSelected;
        showSubmittedTS = false;
      }else {
        userSelected = userlist[0];
      }

      dispatch({type: USER_LIST, payload: {
        userlist: userlist,
        userSelected: userSelected
      }});

      dispatch(onUserChange(userSelected, weekSelected, showSubmittedTS))

    })
    .catch(function (error) {
    });
  }
}

const getProductiveData = (details) => {
   return axios.get(`${API_URL}/api/timesheets-productive?userId=${details.userID}&fromDate=${details.fromDate}&toDate=${details.toDate}`);
}

const getNonProductiveData = (details) => {
   return axios.get(`${API_URL}/api/timesheets-nonproductive?userId=${details.userID}&fromDate=${details.fromDate}&toDate=${details.toDate}`);
}

const formProductiveTasks = (taskList, item, downloadData, user) => {
  let estimatedHours = item.taskDetails[0].estimatedHours != null ||
      item.taskDetails[0].estimatedHours != undefined ? item.taskDetails[0].estimatedHours : 0;
  taskList[item.taskId] = {
    isProductive: true,
    rfcNumber: item.taskDetails[0].rfcNumber,
    details: (taskList[item.taskId] ? taskList[item.taskId].details : {
      Mon: {date: null, hours: "0.00", id: null},
      Tue: {date: null, hours: "0.00", id: null},
      Wed: {date: null, hours: "0.00", id: null},
      Thu: {date: null, hours: "0.00", id: null},
      Fri: {date: null, hours: "0.00", id: null}
    } ),
    rowtotal: (taskList[item.taskId] ? parseFloat(taskList[item.taskId].rowtotal) : 0 )+parseFloat(item.hours),
    utilized: item.taskDetails[0].hoursSpend+"/"+estimatedHours,
    hasUtilizedMore: parseFloat(item.taskDetails[0].hoursSpend) > parseFloat(estimatedHours)
  }

  taskList[item.taskId].details[moment(item.aDate).format("ddd")] = {
    date: item.aDate,
    hours: item.hours,
    id: item._id
  }

  downloadData ? downloadData.push({
    "Resource Name": user.label,
    "Task": item.taskDetails[0].rfcNumber,
    "Type": "Productive",
    "Date": moment(item.aDate).format('DD-MM-YYYY'),
    "Hrs": item.hours
  }) : ""
}

const formTimeawayTasks = (taskList, item, downloadData, user) => {
  let nonProdName = "";
  for(let i=0; i< NON_PRODUCTIVE_ITEMS.length; i++){
    if(NON_PRODUCTIVE_ITEMS[i].value == item.type){
      nonProdName = NON_PRODUCTIVE_ITEMS[i].label;
      break;
    }
  }
  taskList[item.type] = {
    isProductive: false,
    nonProdName: nonProdName,
    nonProdID: item.type,
    details: (taskList[item.type] ? taskList[item.type].details : {
      Mon: {date: null, hours: "0.00", id: null},
      Tue: {date: null, hours: "0.00", id: null},
      Wed: {date: null, hours: "0.00", id: null},
      Thu: {date: null, hours: "0.00", id: null},
      Fri: {date: null, hours: "0.00", id: null}
    } ),
    rowtotal: (taskList[item.type] ? parseFloat(taskList[item.type].rowtotal) : 0 )+parseFloat(item.hours),
    hasUtilizedMore: false
  }
  taskList[item.type].details[moment(item.aDate).format("ddd")] = {
    date: item.aDate,
    hours: item.hours,
    id: item._id
  }

  downloadData ? downloadData.push({
    "Resource Name": user.label,
    "Task": nonProdName,
    "Type": "Non-Productive",
    "Date": moment(item.aDate).format('DD-MM-YYYY'),
    "Hrs": item.hours
  }) : "";
}

const formNonproductiveTasks = (taskList, item, downloadData, user) => {
  let nonProdName = "";
  for(let i=0; i< NON_PRODUCTIVE_ITEMS.length; i++){
    if(NON_PRODUCTIVE_ITEMS[i].value == item.subType){
      nonProdName = NON_PRODUCTIVE_ITEMS[i].label;
      break;
    }
  }
  taskList[item.subType] = {
    isProductive: false,
    nonProdName: nonProdName,
    details: (taskList[item.subType] ? taskList[item.subType].details : {
      Mon: {date: null, hours: "0.00", id: null},
      Tue: {date: null, hours: "0.00", id: null},
      Wed: {date: null, hours: "0.00", id: null},
      Thu: {date: null, hours: "0.00", id: null},
      Fri: {date: null, hours: "0.00", id: null}
    } ),
    rowtotal: (taskList[item.subType] ? parseFloat(taskList[item.subType].rowtotal) : 0 )+parseFloat(item.hours),
    hasUtilizedMore: false
  }
  taskList[item.subType].details[moment(item.aDate).format("ddd")] = {
    date: item.aDate,
    hours: item.hours,
    id: item._id
  }
  downloadData ? downloadData.push({
    "Resource Name": user.label,
    "Task": nonProdName,
    "Type": "Non-Productive",
    "Date": moment(item.aDate).format('DD-MM-YYYY'),
    "Hrs": item.hours
  }) : "";
}

export const onUserChange = (user, weekSelected, showSubmittedTS) => {
  return (dispatch, store) => {
    dispatch({type: IS_FETCHING});
    let fromDate= moment(weekSelected).startOf('week').weekday(-1).format("YYYY-MM-DD"),
      toDate= moment(weekSelected).endOf('week').weekday(5).format("YYYY-MM-DD"),
      getURL = showSubmittedTS ? `${API_URL}/api/timesheets?userId=${user.value}&fromDate=${fromDate}&toDate=${toDate}&status=submitted` :
      `${API_URL}/api/timesheets?fromDate=${fromDate}&toDate=${toDate}`;

    axios.get(getURL)
     .then( function (response) {
      let taskList = {},
      coltotal = {
        Mon: 0,
        Tue: 0,
        Wed: 0,
        Thu: 0,
        Fri: 0
      },
      alltotal = 0,
      isSubmitted = true,
      downloadData = [];

      // downloadData.push({Name: user.label});
      response.data.resData.forEach((item) => {
        switch (item.type) {
          case "productive":
            formProductiveTasks(taskList, item, downloadData, user)
            break;

          case "vacation":
            formTimeawayTasks(taskList, item, downloadData, user)
            break;

          case "holiday":
            formTimeawayTasks(taskList, item, downloadData, user)
            break;

          case "non-productive":
            formNonproductiveTasks(taskList, item, downloadData, user)
            break;
          default:

        }
        item.status == "not-submitted" ? isSubmitted = false : ""
        coltotal[moment(item.aDate).format("ddd")] += parseFloat(item.hours);
        alltotal += parseFloat(item.hours);
      });

      dispatch(setWeekData(moment(response.data.toDate).weekday(5)));

      dispatch({type: TIMESHEET_DATA, payload: {
        data: taskList,
        userSelected: user,
        coltotal: coltotal,
        isSubmitted: isSubmitted,
        alltotal: alltotal.toFixed(2),
        downloadData: downloadData
      }});
      dispatch({type: IS_FETCHED});
    })
    .catch(function (error) {
      debugger;
    });
  }
}

const postProdHours = (details, day) => {
  let payload = {
    taskId: details.taskId,
    aDate: details.dates[day].date,
    hours: details.dates[day].hours,
    type: "productive"
  }
   return axios.post(`${API_URL}/api/timesheet`, payload);
}

const postNonProdHours = (details, day) => {
  let payload = {};

  if(details.type == "vacation" || details.type == "holiday"){
    payload = {
      aDate: details.dates[day].date,
      hours: details.dates[day].hours,
      type: details.type
    }
  }else {
    payload = {
      aDate: details.dates[day].date,
      hours: details.dates[day].hours,
      type: details.type,
      subType: details.subType
    }
  }
   return axios.post(`${API_URL}/api/timesheet`, payload);
}

export const addNewTime = (payload) => {
  if(payload.isProductive){
    return (dispatch) => {
      dispatch({type: IS_FETCHING});
      postProdHours(payload, "Mon").then(() => {
        postProdHours(payload, "Tue").then(() => {
          postProdHours(payload, "Wed").then(() => {
            postProdHours(payload, "Thu").then(() => {
              postProdHours(payload, "Fri").then(() => {
                // dispatch(getUserTasks(payload.user));
                dispatch(onUserChange(payload.user, payload.weekSelected, false))
              });
            })
          })
        })
      })
    }
  }else {
    return (dispatch) => {
      axios.all([postNonProdHours(payload, "Mon"), postNonProdHours(payload, "Tue"), postNonProdHours(payload, "Wed"), postNonProdHours(payload, "Thu"), postNonProdHours(payload, "Fri")])
       .then(axios.spread(function (mon, tue, wed, thu, fri) {
         dispatch(onUserChange(payload.user, payload.weekSelected, false))
      }));
    }
  }
}

const deleteProdHours = (id) => {
   return axios.delete(`${API_URL}/api/timesheet/${id}`);
}

export const deleteTimesheet = (hours, currentSelection) => {
  return (dispatch) => {
    dispatch({type: IS_FETCHING});
    let i = hours.length;
    recursiveDelete(i);

    function recursiveDelete(count) {
      deleteProdHours(hours[count-1]).then(() => {
        count--;
        if (count > 0) {
          recursiveDelete(count)
        }else {
          // dispatch(getUserTasks(currentSelection.user));
          dispatch(onUserChange(currentSelection.user, currentSelection.weekSelected, false))
        }
      })
    }
  }
}

export const updateTimesheet = (id, payload, currentSelection) => {
    return (dispatch) => {
      dispatch({type: IS_FETCHING});
      axios.put(`${API_URL}/api/timesheet/${id}`, payload)
      .then(function (response) {
        // dispatch(getUserTasks(currentSelection.user));
        dispatch(onUserChange(currentSelection.user, currentSelection.weekSelected, false))
      })
      .catch(function (error) {
      });
    }
}

export const addOldTimesheet = (payload, day) => {
  if(payload.isProductive){
    return (dispatch) => {
      dispatch({type: IS_FETCHING});
      postProdHours(payload, day).then(() => {
        // dispatch(getUserTasks(payload.user));
        dispatch(onUserChange(payload.user, payload.weekSelected, false))
      })
    }
  }else {
    return (dispatch) => {
      dispatch({type: IS_FETCHING});
      postNonProdHours(payload, day).then(() => {
        // dispatch(getUserTasks(payload.user));
        dispatch(onUserChange(payload.user, payload.weekSelected, false))
      })
    }
  }
}

export const populatePreviousTasks = (user, weekSelected) => {
  return (dispatch) => {
    dispatch({type: IS_FETCHING});
    let fromDate= moment(weekSelected).startOf('week').weekday(-1).format("YYYY-MM-DD"),
      toDate= moment(weekSelected).endOf('week').weekday(5).format("YYYY-MM-DD");

    axios.get(`${API_URL}/api/timesheets?userId=${user.value}&fromDate=${fromDate}&toDate=${toDate}`)
    .then(function (response) {
      let prodTaskList = {},
      nonprodTaskList = {};

      response.data.resData.forEach((item) => {
        switch (item.type) {
          case "productive":
            formProductiveTasks(prodTaskList, item)
            break;

          case "vacation":
            formTimeawayTasks(nonprodTaskList, item)
            break;

          case "holiday":
            formTimeawayTasks(nonprodTaskList, item)
            break;

          case "non-productive":
            formNonproductiveTasks(nonprodTaskList, item)
            break;
          default:

        }
      });

      dispatch({type: PREV_TIMESHEET_DATA, payload: {
        prevproddata: prodTaskList,
        prevnonproddata: nonprodTaskList
      }});
      dispatch({type: IS_FETCHED});
    });
  }
}

export const closeTSPopup = () => {
  return (dispatch) => {
      dispatch({type: CLOSE_TIMESHEET_POPUP})
  }
}


export const addPrevTimes = (promiseArray) => {
  return (dispatch) => {
    dispatch(closeTSPopup());
    promiseArray.forEach((item) => {
      dispatch(addNewTime(item))
    })
  }
}


export const onTimesheetSubmit = (weekSelected, userSelected) => {
    return (dispatch) => {
      let fromDate= moment(weekSelected).startOf('week').weekday(-1).format("YYYY-MM-DD"),
        toDate= moment(weekSelected).endOf('week').weekday(5).format("YYYY-MM-DD");
      dispatch({type: IS_FETCHING});
      axios.post(`${API_URL}/api/timesheet-submit?fromDate=${fromDate}&toDate=${toDate}`, {})
      .then(function (response) {
        dispatch({type: IS_FETCHED});
        if(response.data.status && response.data.status == "success"){
          dispatch({type: TIME_VALID, payload: {
            status: true,
            invalidDays: [],
            message: "Successfully submitted"
          }})
          dispatch(onUserChange(userSelected, weekSelected, false))
        }else {
          let data = response.data.resData;

          let dayCodes = data.map((item) => {
            return moment(item).utc().weekday()
          })
         /* dispatch({type: TIME_VALID, payload: {
            status: false,
            invalidDays: dayCodes,
            message: "Data doesn't validate. Please fix."
          }})*/
        }
      })
      .catch(function (error) {
      });
    }
}

export const showInvalidDays = (dates) => {
  return (dispatch) => {
    let dayCodes = dates.map((item) => {
      return moment(item).utc().weekday();
    })
    dispatch({type: TIME_VALID, payload: {
      status: false,
      invalidDays: dayCodes,
      message: "Vacation/Holiday data doesn't validate. Please fix."
    }})
  }
}
