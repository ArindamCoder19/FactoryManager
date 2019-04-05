import {
  SET_WEEK_DATA,
  USER_TASK_LIST,
  USER_LIST,
  TIMESHEET_DATA,
  USER_SELECTED_TIMESHEET,
  PREV_TIMESHEET_DATA,
  CLOSE_TIMESHEET_POPUP,
  TIME_VALID
} from '../actions/types/index';


export default function (state={
  usertasklist: [],
  userlist: [],
  timesheetdata: {},
  userSelected: {label: "", value: ""},
  alltotal: 0,
  showprevdata: false,
  isSubmitted: true,
  productiveTasksCount: 0,
  downloadData: [],
  timevalidstatus: {
    status: false,
    message: "",
    invalidDays: []
  }
}, action) {
    switch (action.type) {
      case SET_WEEK_DATA: {
        return {
          ...state,
          weekSelected: action.payload.weekSelected,
          previousWeeks: action.payload.previousWeeks
        }
      }
      case USER_TASK_LIST: {
        return {
          ...state,
          taskDelivered: action.payload.taskDelivered,
          taskInprogress: action.payload.taskInprogress,
          taskNonprod: action.payload.taskNonprod
        }
      }
      case USER_LIST: {
        return {
          ...state,
          userlist: action.payload.userlist,
          userSelected: action.payload.userSelected
        }
      }
      case TIMESHEET_DATA: {
        return {
          ...state,
          userSelected: action.payload.userSelected,
          timesheetdata: action.payload.data,
          coltotal: action.payload.coltotal,
          alltotal: action.payload.alltotal,
          isSubmitted: action.payload.isSubmitted,
          productiveTasksCount: action.payload.productiveTasksCount,
          downloadData: action.payload.downloadData,
          timevalidstatus: {
            status: false,
            message: "",
            invalidDays: []
          }
        }
      }
      case USER_SELECTED_TIMESHEET: {
        return {
          ...state,
          userSelected: action.payload
        }
      }
      case PREV_TIMESHEET_DATA: {
        return {
          ...state,
          prevweekproddata: action.payload.prevproddata,
          prevweeknonproddata: action.payload.prevnonproddata,
          showprevdata: true
        }
      }
      case CLOSE_TIMESHEET_POPUP: {
        return {
          ...state,
          showprevdata: false
        }
      }
      case TIME_VALID: {
        return {
          ...state,
          timevalidstatus: action.payload
        }
      }
      default:
        return state;
    }
}
