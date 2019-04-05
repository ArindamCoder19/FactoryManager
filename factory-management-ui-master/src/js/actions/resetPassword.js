import axios from 'axios';
import { API_URL } from '../util/config';
import {
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAILURE,
  VERIFY_RESET_PASSWORD_FAILURE,
  RESET_LOADER
} from './types/index';

/**
 * Error helper
 */
export function authError(CONST, error) {
  return {
    type: CONST,
    payload: error,
  }
}

/**
 * Reset password
 */
export function resetPassword(props, history) {
  return function (dispatch) {
    dispatch({type: RESET_LOADER, payload: {isloading: true}});

    axios.post(`${API_URL}/api/emailVerify`, {email: `${props.email}`})
      .then((response) => {
        if(response.data.status == "true"){
          history.push(`/reset-password/verify?email=${props.email}`);
          dispatch({ type: RESET_PASSWORD_SUCCESS });

        }else{
          dispatch(authError(RESET_PASSWORD_FAILURE, response.data.message))
        }
      })
      .catch(response => {
        dispatch(authError(RESET_PASSWORD_FAILURE, response.response.data.message))
      });
  }
}


/**
 * Reset password new
 */
export function resetPasswordNew(props, history) {
  return function (dispatch) {
    dispatch({type: RESET_LOADER, payload: {isloading: true}});

    axios.put(`${API_URL}/api/reset-password?token=${props.token}`, {password: props.password})
      .then(response => {
        if(response.data.status == "true"){
          history.push('/reset-password/new/success');
        }else{
          dispatch(authError(VERIFY_RESET_PASSWORD_FAILURE, response.data.message))
        }

      })
      .catch(response => dispatch(authError(VERIFY_RESET_PASSWORD_FAILURE, response.response.data.message)));
  }
}
