import moment from "moment";

import {
  PRODUCTIVITY_DATA,
  DB_DD_CHANGE,
  TOGGLE_VACATION,
  OVERALL_STATISTICS,
  IS_OVERALL_FETCHING,
  IS_OVERALL_FETCHED
} from '../actions/types/index';

export default function (state={
  ddSelected: {label: "Overview", value: "all"},
  statYear: moment().year(),
  year: moment().year(),
  statData: {
    coordination: 0,
    vacation: 0,
    productive: 0,
    training: 0,
    meeting: 0,
    idleTime: 0,
    cPerc: 0,
    iPerc: 0,
    mPerc: 0,
    pPerc: 0,
    tPerc: 0,
    vPerc: 0
  },
  includeVacation: false,
  isoverallfetching: false,
  prodData: {
    developers: 0,
    leads: 0,
    taskInProgress: 0
  }
}, action) {
    switch (action.type) {
      case PRODUCTIVITY_DATA: {
        return {
          ...state,
          prodData: action.payload.data,
          year: action.payload.year,
          ddSelected: action.payload.ddSelected,
          includeVacation: action.payload.includeVacation
        }
      }

      case TOGGLE_VACATION: {
        return {
          ...state,
          prodData: action.payload.data,
          includeVacation: action.payload.includeVacation,
          statData: action.payload.statData
        }
      }

      case OVERALL_STATISTICS: {
        return {
          ...state,
          statData: action.payload.statData,
          statYear: action.payload.statYear
        }
      }

      case IS_OVERALL_FETCHING: {
        return {
          ...state,
          isoverallfetching: true
        }
      }

      case IS_OVERALL_FETCHED: {
        return {
          ...state,
          isoverallfetching: false
        }
      }

      default:
        return state;
    }
}
