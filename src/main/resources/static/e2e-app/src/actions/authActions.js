import {
  UPDATE_AUTH_STATUS,
  UPDATE_EMAIL,
  UPDATE_LOGIN_MODAL_STATUS,
  UPDATE_LOGIN_SUCCESS,
  UPDATE_LOGIN_SUCCESS_MESSAGE,
  UPDATE_PASSWORD
} from "./constants";

export const updateAuthenticatedStatus = (status) => ({ type: UPDATE_AUTH_STATUS, status });
export const updateLoginSuccessMessage = (message) => ({ type: UPDATE_LOGIN_SUCCESS_MESSAGE, message });
export const updateLoginModalStatus = (status) => ({ type: UPDATE_LOGIN_MODAL_STATUS, status });
export const updateLoginSuccess = (status) => ({ type: UPDATE_LOGIN_SUCCESS, status });
export const updateUserEmail = (email) => ({ type: UPDATE_EMAIL, email });
export const updateUserPassword = (password) => ({ type: UPDATE_PASSWORD, password });