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
  FS_UPDATE_COMMENTS,
  SHOW_COMMENTS_LOADING,
  NEW_FS_DATA
} from '../actions/types/index';

let defaultFilter = {
  FILTER1: "ALL", // (Status )
  FILTER2: "ALL", // ALL (NA)
  FILTER3: "ALL", // (Categories )
  FILTER4: "ALL" // (subCategory )
};

export default function (state={
  showfs: null,
  filter: defaultFilter,
  fsList: [],
  newfs: false,
  showdataloading: false,
  commentdetails: [],
  isCommentsLoading: false,
  downloadData: [],
  totalCount: 0,
  newfsdata: {},
  error: {},
  genericErrorMsg: {
    eh: "",
    fte: "",
    mandatory: "",
    showMandatory: false
  }
}, action) {
    switch (action.type) {

      case FILTER_FS_FULFILLED: {
        return {
          ...state,
          filter: {
            FILTER1: action.payload.filter.FILTER1,
            FILTER2: action.payload.filter.FILTER2,
            FILTER3: action.payload.filter.FILTER3,
            FILTER4: action.payload.filter.FILTER4
          },
          fsList: action.payload.data,
          downloadData: action.payload.downloadData,
          showfs: action.payload.showfs,
          totalCount: action.payload.totalCount,
          newfs: false,
          showdataloading: false,
          newfsdata: {},
          error: {}
        }
      }
      case SHOW_FS_DETAIL: {
        return {
          ...state,
          showfs: action.payload,
          newfs: false,
          error: {}
        }
      }

      case HIDE_FS_DETAIL: {
        return {
          ...state,
          showfs: null,
          newfs: false,
          error: {}
        }
      }

      case NEW_FS: { //Show New FS detail
        return {
          ...state,
          newfs: true,
          showfs: 0
        }
      }

      case NEW_FS_DATA: {
        return {
          ...state,
          newfsdata: action.payload,
          error: {}
        }
      }

      case SHOW_FSDATA_LOADING: {
        return {
          ...state,
          showdataloading: true,
          error: {}
        }
      }

      case SHOW_COMMENTS_LOADING: {
        return {
          ...state,
          isCommentsLoading: true,
          error: {}
        }
      }

      case FS_UPDATE_COMMENTS: {
        return {
          ...state,
          commentdetails: action.payload,
          showdataloading: false,
          isCommentsLoading: false,
          error: {}
        }
      }

      case NEWFS_FAILURE: {
        return {
          ...state,
          error: {newfs: action.payload}
        }
      }

      case FS_ERROR: {
        return {
          ...state,
          genericErrorMsg: action.payload
        }
      }

      default:
        return state;
    }
}
