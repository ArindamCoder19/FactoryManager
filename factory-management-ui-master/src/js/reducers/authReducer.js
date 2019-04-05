import {
  SIGNUP_SUCCESS,
  SIGNUP_FAILURE,
  SIGNUP_RESEND_FAILURE,
  VERIFY_EMAIL_ERROR,
  SIGNIN_FAILURE,
  AUTH_USER,
  UNAUTH_USER,
  IS_ADMIN,
  NOT_ADMIN,
  AUTH_LOADER,
  IS_LOADING,
  SHOW_CATEGORIES,
  IS_CAT_FETCHING,
  VERIFY_FAILURE,
  VERIFY_SUCCESS
} from '../actions/types/index';

export default function(state = {
  showmainloader: true,
  isloading: false,
  error:{},
  isfetching: false,
  categories: []
}, action) {
  switch(action.type) {
    case SIGNUP_SUCCESS:
      return { ...state, signup: true, error: {} };
    case SIGNUP_FAILURE: {
      return { ...state, isloading: false, signup: false, error: { signup: action.payload } };
    }
    case SIGNUP_RESEND_FAILURE:
      return { ...state, signup: true, error: { signupResend: action.payload } };
    case VERIFY_FAILURE:
      return { ...state, verify: false, error: { verifyUser: action.payload } };
    case VERIFY_SUCCESS:
      return { ...state, verify: true, error: {} };
    case SIGNIN_FAILURE:
      return { ...state, isloading: false, error: { signin: action.payload } };
    case UNAUTH_USER:
      return { ...state, authenticated: false, error: {} };
    case IS_ADMIN:
      return { ...state, isadmin: true, showmainloader: false };
    case NOT_ADMIN:
      return { ...state, isadmin: false, showmainloader: false };
    case AUTH_LOADER: 
      return { ...state, isloading: action.payload.isloading}
    // case IS_LOADING:
    //   return { ...state, showmainloader: true };
    case SHOW_CATEGORIES: {
        return{...state, isloading: false, categories: action.payload, isfetching:false};
      };
     case IS_CAT_FETCHING: {
        return {
          ...state,
          isfetching: true
        }
      };
    case AUTH_USER:
      return { ...state, isloading: false, authenticated: true, userRole: action.payload.role, userID: action.payload.userId, error: {} };
  }

  return state;
}
