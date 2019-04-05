import moment from "moment";

import {
  NOTIF_TAB_SELECT,
  NOTIF_COMPOSE_NOTFILLED,
  NOTIF_COMPOSE_UPDATE,
  NOTIF_SENT_ERROR,
  NOTIF_SENT,
  NOTIF_ISLOADING,
  NOTIF_ISLOADED,
  NOTIF_NEW_LIST,
  NOTIF_ARCHIVED_LIST,
  NOTIF_UPDATE_SUCCESS,
  UPDATE_LOADING,
  NOTIF_SENT_LIST,
  NOTIF_PUSH_NEW_LIST,
  NOTIF_PUSH_ARCHIVED_LIST,
  NOTIF_UPDATE_COUNTER
} from '../actions/types/index';
/**
tabSelected: 0-New, 1-Archived, 2-Sent, 3-Compose
*/
export default function (state={
  tabSelected: 0,
  count: 0,
  isLoading: false,
  isUpdateLoading: false,
  newNotif:[],
  newUpdatedNotifIds: [],
  archivedNotif: [],
  sentNotif: [],
  notFilledFields: [],
  isSentError: false,
  senterrorMessage: null,
  composeNotif: {
    user: [],
    category: [],
    dueDate: null,
    message: ""
  }
}, action) {
    switch (action.type) {
      case NOTIF_TAB_SELECT: {
        return {
          ...state,
          tabSelected: action.payload,
          notFilledFields: []
        }
      }

      case NOTIF_COMPOSE_NOTFILLED: {
        return {
          ...state,
          notFilledFields: action.payload
        }
      }

      case NOTIF_ISLOADING: {
        return {
          ...state,
          isLoading: true
        }
      }

      case NOTIF_ISLOADED: {
        return {
          ...state,
          isLoading: false
        }
      }

      case NOTIF_SENT: {
        return {
          ...state,
          isSentError: false,
          isLoading: false,
          composeNotif: {
            user: [],
            category: [],
            dueDate: null,
            message: ""
          }
        }
      }

      case NOTIF_SENT_ERROR: {
        return {
          ...state,
          isSentError: true,
          senterrorMessage: action.payload.msg
        }
      }

      case NOTIF_COMPOSE_UPDATE: {
        return {
          ...state,
          composeNotif: action.payload
        }
      }

      case NOTIF_NEW_LIST: {
        return {
          ...state,
          newNotif: action.payload
        }
      }

      case NOTIF_PUSH_NEW_LIST: {
        return {
          ...state,
          newNotif: [action.payload, ...state.newNotif]
        }
      }

      case NOTIF_PUSH_ARCHIVED_LIST: {
        return {
          ...state,
          archivedNotif: [action.payload, ...state.archivedNotif]
        }
      }

      case NOTIF_ARCHIVED_LIST: {
        return {
          ...state,
          archivedNotif: action.payload
        }
      }

      case NOTIF_SENT_LIST: {
        return {
          ...state,
          sentNotif: action.payload
        }
      }

      case UPDATE_LOADING: {
        return {
          ...state,
          isUpdateLoading: true,
          isUpdateSuccess: false
        }
      }

      case NOTIF_UPDATE_COUNTER: {
        return {
          ...state,
          count: action.payload
        }
      }

      case NOTIF_UPDATE_SUCCESS: {
        return {
          ...state,
          isUpdateSuccess: action.payload.isSuccess,
          newUpdatedNotifIds: [...state.newUpdatedNotifIds, action.payload.newId],
          isUpdateLoading: false
        }
      }

      default:
        return state;
    }
}
