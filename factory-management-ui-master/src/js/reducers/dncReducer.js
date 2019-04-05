import {
  DNC_DATA,
  DB_DD_CHANGE
} from '../actions/types/index';


export default function (state={
  ddSelected: {label: "Overview", value: "all"},
  dncData: {
    developers: 0,
    leads: 0,
    taskInProgress: 0,
    weekData: []
  }
}, action) {
    switch (action.type) {
      case DNC_DATA: {
        return {
          ...state,
          dncData: action.payload.data,
          year: action.payload.year,
          ddSelected: action.payload.ddSelected
        }
      }

      default:
        return state;
    }
}
