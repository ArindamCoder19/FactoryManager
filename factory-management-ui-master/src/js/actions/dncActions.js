import axios from 'axios';
import moment from 'moment';

import {
  API_URL,
  CONFIG
} from '../util/config';

import {
  DNC_DATA,
  IS_FETCHING,
  IS_FETCHED,
  DB_DD_CHANGE,
  INITIAL_LOADED
} from './types/index';

export const getDnCData = (param) => {
  return (dispatch) => {

    let queryString = "";
    if(param.data.value != "all"){
      queryString = "?categoryId="+param.data.value;
    }

    dispatch({type: IS_FETCHING});
    axios.get(`${API_URL}/api/demand-capacity${queryString}`)
    .then(function (response) {
      //TO_DO: better approach
      let date = new Date(),
      mainData = {},
      weeks = response.data.weeks,
      weekDates = {},
      weekData = [],
      year = moment(new Date).weekYear(),
      week12Year = moment(new Date).weekday(5 + 7 * 11).weekYear();

      year = (year == week12Year) ? year : year+" - "+week12Year;

      for(let i = 0; i < 12; i++){
        let weekIndex = i+1;
        weekDates["week"+weekIndex] = moment(new Date).add(1,"day").weekday(5 + 7 * i).format('DD MMM');
      }

      for (let j in weeks){
        weekData.push({...weeks[j], name: weekDates[j]})
      }
      mainData["developers"] = response.data.developers;
      mainData["leads"] = response.data.leads;
      mainData["taskInProgress"] = response.data.taskInProgress;
      mainData["weekData"] = weekData;

      dispatch({
        type: DNC_DATA,
        payload: {
          data: mainData,
          year: year,
          ddSelected: param.data
        }
      });
      dispatch({type: IS_FETCHED});
    })
    .catch(function (error) {
      debugger;
    });
  }
}
