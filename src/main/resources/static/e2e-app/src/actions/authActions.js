import {
  UPDATE_AUTH_STATUS,
  UPDATE_EMAIL,
  UPDATE_LOGIN_ERROR,
  UPDATE_LOGIN_ERROR_MESSAGE,
  UPDATE_LOGIN_MODAL_STATUS, UPDATE_LOGIN_PROGRESS,
  UPDATE_LOGIN_SUCCESS,
  UPDATE_LOGIN_SUCCESS_MESSAGE,
  UPDATE_LOGIN_WARN,
  UPDATE_LOGIN_WARN_MESSAGE,
  UPDATE_PASSWORD
} from "./constants";
import AuthenticationService from "../services/AuthenticationService";
import { fetchSettings } from "./settingsActions";

export const updateAuthenticatedStatus = (status) => ({ type: UPDATE_AUTH_STATUS, status });
export const updateLoginError = (status) => ({ type: UPDATE_LOGIN_ERROR, status });
export const updateLoginErrorMessage = (message) => ({ type: UPDATE_LOGIN_ERROR_MESSAGE, message });
export const updateLoginSuccessMessage = (message) => ({ type: UPDATE_LOGIN_SUCCESS_MESSAGE, message });
export const updateLoginModalStatus = (status) => ({ type: UPDATE_LOGIN_MODAL_STATUS, status });
export const updateLoginProgress = (status) => ({ type: UPDATE_LOGIN_PROGRESS, status });
export const updateLoginSuccess = (status) => ({ type: UPDATE_LOGIN_SUCCESS, status });
export const updateLoginWarn = (status) => ({ type: UPDATE_LOGIN_WARN, status });
export const updateLoginWarnMessage = (message) => ({ type: UPDATE_LOGIN_WARN_MESSAGE, message });
export const updateUserEmail = (email) => ({ type: UPDATE_EMAIL, email });
export const updateUserPassword = (password) => ({ type: UPDATE_PASSWORD, password });

const authenticationService = new AuthenticationService();

export const signIn = (email, password) => {
  return (dispatch) => {
    dispatch(updateLoginProgress(true));
    dispatch(updateLoginWarn(false));
    dispatch(updateLoginWarnMessage(''));
    authenticationService
      .login(email, password)
      .then(response => {
        const { status } = response;
        if (status === 200) {
          dispatch(updateAuthenticatedStatus(true));
          dispatch(updateLoginModalStatus(false));
          dispatch(fetchSettings());
        }
        if (status === 401) {
          dispatch(updateLoginError(true));
          dispatch(updateLoginErrorMessage('Login failed, try to reset password or sign up'));
        }
      })
      .finally(() => {
        dispatch(updateLoginProgress(false));
      });
  };
};