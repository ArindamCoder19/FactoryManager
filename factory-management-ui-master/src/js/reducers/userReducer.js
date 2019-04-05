import {
  FILTER_USERS_FULFILLED,
  SHOW_USER_DETAIL,
  HIDE_USER_DETAIL,
  IS_FETCHING,
  VIEW_PROFILE,
} from '../actions/types/index';

let defaultFilter = {
  FILTER1: "ALL", // (All/ active/ inactive )
  FILTER2: "ALL", // ALL (NA)
  FILTER3: "ALL", // (All/ Developer/ Lead/ Manager/ Admin )
  FILTER4: "ALL", // (All/ Internal/ External )
  FILTER5: "ALL" // User name search
};

export default function (state={
  totalCount: 0,
  filter: defaultFilter
}, action) {
    switch (action.type) {
      case FILTER_USERS_FULFILLED: {
        return {
          ...state,
          filter: {
            FILTER1: action.payload.filter.FILTER1,
            FILTER2: action.payload.filter.FILTER2,
            FILTER3: action.payload.filter.FILTER3,
            FILTER4: action.payload.filter.FILTER4,
            FILTER5: action.payload.filter.FILTER5
          },
          users: action.payload.data,
          totalCount: action.payload.totalCount,
          showuser: action.payload.showuser
        }
      }
      case SHOW_USER_DETAIL: {
        return {...state, showuser: action.payload}
      }

      case HIDE_USER_DETAIL: {
        return {...state, showuser: null}
      }

      case VIEW_PROFILE: {
        return { ...state, profile: action.payload, isfetching: false}
      }

      default:
        return state;
    }
}
