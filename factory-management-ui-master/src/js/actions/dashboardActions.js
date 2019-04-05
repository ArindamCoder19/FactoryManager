import axios from 'axios';

import {
  API_URL,
  CONFIG
} from '../util/config';

import {
  DASHBOARD_DATA,
  IS_FETCHING,
  IS_FETCHED,
  DASHBOARD_USERLIST,
  SWITCH_SELECTION,
  DB_DD_CHANGE
} from './types/index';

export const getDashboardData = (param) => {
  return (dispatch) => {

    let queryString = "";
    if(param.data.value != "all"){
      if(param.isUser){
        queryString = "?userId="+param.data.value+"&categoryId="+param.data.category.id+"&role="+param.data.role;
      }else {
        queryString = "?categoryId="+param.data.value;
      }
    }

    dispatch({type: IS_FETCHING});
    axios.get(`${API_URL}/api/user-dashboard${queryString}`)
    .then(function (response) {
      //TO_DO: better approach
      let pieChartData = [],
        pieChartTotal = 0,
        productiveData = [];
      let pieChartKeys = ["inTake", "cab", "build", "test", "hold"],
        productivityKeys = ["oph", "lmph", "lwph"];
      let productiveLegendData = {
        oph: {label: "Overall"},
        lmph: {label: "Last Month"},
        lwph: {label: "Last Week"}
      },
      pieChartLegendData = {
        inTake: {label: "Intake", className: "legend-inTake"},
        cab: {label: "CAB", className: "legend-cab"},
        build: {label: "Build", className: "legend-build"},
        test: {label: "Test", className: "legend-test"},
        hold: {label: "Hold", className: "legend-hold"},
      };


      for(let i in response.data) {
        if(pieChartKeys.indexOf(i) >= 0){
            pieChartData.push({
             name: i,
             value: response.data[i],
             label: pieChartLegendData[i].label,
             className: pieChartLegendData[i].className
           });
           pieChartTotal += response.data[i];
         }else if(productivityKeys.indexOf(i) >= 0){
           productiveData.push({
            name: i,
            value: response.data[i] == null ? "0.00": response.data[i].toFixed(2),
            label: productiveLegendData[i].label
           })
         }
      }

      dispatch({
        type: DASHBOARD_DATA,
        payload: {
          data: response.data,
          pieChartData: pieChartData,
          productiveData: productiveData,
          pieChartTotal: pieChartTotal,
          ddSelected: param.data,
          isUser: param.isUser
        }
      });
      dispatch({type: IS_FETCHED});
    })
    .catch(function (error) {
      debugger;
    });
  }
}

export const getDBUserList = (userRole) => {
  return (dispatch) => {
    let role='DEVELOPER,LEAD';
    if(_.includes(userRole, 'LEAD')){
      role = 'DEVELOPER'
    }

    axios.get(`${API_URL}/api/users?role=${role}&status=active`)
    .then(function (response) {

      let userList = response.data.data.map((item) => {
        return {
          label: item.firstName+" "+item.lastName,
          value: item._id,
          role: item.role[0],
          category: item.categoryId ? {
            id: item.categoryId[0]._id,
            value: item.categoryId[0].category
          } : {id: null, value: null}
        }
      })

      userList.unshift({label: "Overview",
      value: "all",
      role: "",
      category: {
        id: "",
        value: ""
      }});

      dispatch({
        type: DASHBOARD_USERLIST,
        payload: {
          userList: userList
        }
      });
    })
    .catch(function (error) {
      debugger;
    });
  }
}
//
// export const switchSelection = (isUser) => {
//   return (dispatch) => {
//     dispatch({
//       type: SWITCH_SELECTION,
//       payload: {
//         isUser: isUser
//       }
//     });
//   }
// }
