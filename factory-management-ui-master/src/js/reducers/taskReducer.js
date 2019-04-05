import {
  FILTER_TASKS_FULFILLED,
  SHOW_TASK_DETAIL,
  HIDE_TASK_DETAIL,
  NEW_TASK,
  NEW_TASK_DATA,
  SHOW_DATA_LOADING,
  UPDATE_COMMENTS,
  NEWTASK_FAILURE,
  TASK_ERROR
} from '../actions/types/index';

import {
  TASK_PRIORITY,
  TASK_STATUS,
  TASK_WRICEF,
  TASK_COMPLEXITY
} from '../util/constants';

let defaultFilter = {
  FILTER1: "ALL",    // (All/ My tasks/ Tasks I lead/ Tasks I Review )
  FILTER2: "incompleted", // (All/ In-Progress/ Completed )
  FILTER3: "ALL", // (Categories )
  FILTER4: "ALL", // (Sub-categories )
  FILTER5: "ALL", // Calendar: From
  FILTER6: "ALL", // Calendar: To
  FILTER7: "ALL", // developerId
  FILTER8: "ALL" // Search String
};

export default function (state={
  downloadData: [],
  totalCount: 0,
  filter: defaultFilter,
  newtask: false,
  newtaskdata: {},
  showdataloading: false,
  commentdetails: [],
  error: {},
  genericErrorMsg: {
    fsi: "",
    mandatory: ""
  }
}, action) {
    switch (action.type) {
      case FILTER_TASKS_FULFILLED: {
        return {
          ...state,
          filter: {
            FILTER1: action.payload.filter.FILTER1,
            FILTER2: action.payload.filter.FILTER2,
            FILTER3: action.payload.filter.FILTER3,
            FILTER4: action.payload.filter.FILTER4,
            FILTER5: action.payload.filter.FILTER5,
            FILTER6: action.payload.filter.FILTER6,
            FILTER7: action.payload.filter.FILTER7,
            FILTER8: action.payload.filter.FILTER8
          },
          tasks: action.payload.data,
          downloadData: action.payload.downloadData,
          showtask: action.payload.showtask,
          totalCount: action.payload.totalCount,
          newtask: false,
          showdataloading: false,
          newtaskdata: {},
          error: {}
        }
      }
      case SHOW_TASK_DETAIL: {
        return {
          ...state,
          showtask: action.payload,
          newtask: false,
          error: {}
        }
      }

      case HIDE_TASK_DETAIL: {
        return {
          ...state,
          showtask: null,
          newtask: false,
          error: {}
        }
      }

      case NEW_TASK: {
        return {
          ...state,
          newtask: true,
          showtask: 0
        }
      }

      case NEW_TASK_DATA: {
        return {
          ...state,
          newtaskdata: action.payload,
          error: {}
        }
      }

      case SHOW_DATA_LOADING: {
        return {
          ...state,
          showdataloading: true,
          error: {}
        }
      }

      case UPDATE_COMMENTS: {
        return {
          ...state,
          commentdetails: action.payload,
          showdataloading: false,
          error: {}
        }
      }

      case NEWTASK_FAILURE: {
        return {
          ...state,
          error: {newtask: action.payload}
        }
      }

      case TASK_ERROR: {
        return {
          ...state,
          genericErrorMsg: action.payload
        }
      }

      default:
        return state;
    }
}
