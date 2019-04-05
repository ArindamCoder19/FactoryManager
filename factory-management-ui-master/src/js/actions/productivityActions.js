import axios from 'axios';
import moment from 'moment';

import {
  API_URL,
  CONFIG
} from '../util/config';

import {
  PRODUCTIVITY_DATA,
  IS_FETCHING,
  IS_FETCHED,
  DB_DD_CHANGE,
  INITIAL_LOADED,
  TOGGLE_VACATION,
  OVERALL_STATISTICS,
  IS_OVERALL_FETCHING,
  IS_OVERALL_FETCHED
} from './types/index';

export const getProdWeekData = (includeVacation, mainData, statData) => {
  return (dispatch) => {

    dispatch({type: IS_FETCHING});
    mainData["weekData"] = getPercentageData(includeVacation, mainData.weekData);
    let overallStats = getPercentageData(includeVacation, [statData]);
    dispatch({
      type: TOGGLE_VACATION,
      payload: {
        data: mainData,
        includeVacation: includeVacation,
        statData: overallStats[0]
      }
    });
    dispatch({type: IS_FETCHED});
  };
}

const getRoundOff = (a, b) => {
  return ((a == 0 || b == 0) ? 0 : Math.round((a/b) * 10000)/100)
}

export const getPercentageData = (includeVacation, data) => {
  for(let i = 0; i< data.length; i++){
    if(includeVacation){
      let total = data[i].includingVacation;
      data[i]["cPerc"] = getRoundOff(data[i].coordination, total);
      data[i]["iPerc"] = getRoundOff(data[i].idleTime, total);
      data[i]["mPerc"] = getRoundOff(data[i].meeting, total);
      data[i]["pPerc"] = getRoundOff(data[i].productive, total);
      data[i]["tPerc"] = getRoundOff(data[i].training, total);
      data[i]["vPerc"] = getRoundOff(data[i].vacation, total);
    }else {
      let total = data[i].excludingVacation;
      data[i]["cPerc"] = getRoundOff(data[i].coordination, total);
      data[i]["iPerc"] = getRoundOff(data[i].idleTime, total);
      data[i]["mPerc"] = getRoundOff(data[i].meeting, total);
      data[i]["pPerc"] = getRoundOff(data[i].productive, total);
      data[i]["tPerc"] = getRoundOff(data[i].training, total);
      data[i]["vPerc"] = 0;
    }
  }
  return data;
}

export const getOverallStatistics = (param, includeVacation) => {
  return (dispatch) => {
    dispatch({type: IS_OVERALL_FETCHING});
    let queryArray = [];
    let queryString = `${API_URL}/api/productivity-report-overall`;
    if(param.year != "all"){
      queryArray.push("year="+param.year);
    };

    if(param.category != "all"){
      queryArray.push("categoryId="+param.category);
    };

    if(queryArray.length > 0){
      queryString += "?"+queryArray.join("&");
    }

    axios.get(queryString)
    .then(function (response) {
      dispatch({
        type: OVERALL_STATISTICS,
        payload: {
          statData: getPercentageData(includeVacation, [response.data])[0],
          statYear: param.year
        }
      });
      dispatch({type: IS_OVERALL_FETCHED});
    })
    .catch(function (error) {
      debugger;
    });
  }
}

export const getProdData = (param, includeVacation, year) => {
  return (dispatch) => {
    let queryArray = [];
    let queryString = `${API_URL}/api/productivity-report`;
    if(param.value != "all"){
      queryArray.push("categoryId="+param.value);
    };

    if(queryArray.length > 0){
      queryString += "?"+queryArray.join("&");
    }

    dispatch({type: IS_FETCHING});
    let statPayload = {year: year, category: param.value};

    dispatch(getOverallStatistics(statPayload, includeVacation));

    axios.get(queryString)
    .then(function (response) {

      let date = new Date(),
      mainData = {},
      weeks = response.data.weeks,
      actualWeeks = ["week1", "week2", "week3", "week4", "week5", "week6"],
      weekDates = {},
      weekData = [],
      year = moment(new Date).weekYear(),
      week12Year = moment(new Date).weekday(5 + 7 * 6).weekYear();

      year = (year == week12Year) ? year : year+" - "+week12Year;
      let n = 7;
      for(let i = 7; i > 0 ; i--){
        let weekIndex = n - i;
        weekDates["week"+weekIndex] = moment(new Date).weekday(5 - 7 * i).format('DD MMM');
      }

      actualWeeks.forEach((week) => {
        weekData.push({...weeks[week], name: weekDates[week]})
      })

      let resultData = getPercentageData(includeVacation, weekData);
      mainData["developers"] = response.data.developers;
      mainData["leads"] = response.data.leads;
      mainData["taskInProgress"] = response.data.taskInProgress;
      mainData["weekData"] = resultData

      dispatch({
        type: PRODUCTIVITY_DATA,
        payload: {
          data: mainData,
          year: moment(new Date).weekYear(),
          ddSelected: param,
          includeVacation: includeVacation
        }
      });
      dispatch({type: IS_FETCHED});
    })
    .catch(function (error) {
      debugger;
    });
  }
}
