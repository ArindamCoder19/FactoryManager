import {
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAILURE,
  VERIFY_RESET_PASSWORD_SUCCESS,
  VERIFY_RESET_PASSWORD_FAILURE,
  RESET_LOADER
} from '../actions/types/index';

export default function(state = {
  isloading: false
}, action) {
  switch(action.type) {
    case RESET_PASSWORD_SUCCESS:
      return { ...state, isloading: false, resetPassword: true, error: {} };
    case RESET_PASSWORD_FAILURE:
      return { ...state, isloading: false, resetPassword: false, error: { resetPassword: action.payload } };
    case VERIFY_RESET_PASSWORD_SUCCESS:
      return { ...state, isloading: false, verifyResetPassword: true, error: {}, resetPassword: false };
    case VERIFY_RESET_PASSWORD_FAILURE:
      return { ...state, isloading: false, verifyResetPassword: false, error: { verifyResetPassword: action.payload } };
    case RESET_LOADER: 
      return { ...state, isloading: action.payload.isloading}
  }

  return state;
}
