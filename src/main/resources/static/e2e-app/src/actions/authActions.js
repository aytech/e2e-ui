import {
  UPDATE_AUTH_STATUS,
  UPDATE_EMAIL,
  UPDATE_LOGIN_MODAL_STATUS,
  UPDATE_PASSWORD
} from "./constants";

export const updateAuthenticatedStatus = (status) => ({ type: UPDATE_AUTH_STATUS, status });
export const updateLoginModalStatus = (status) => ({ type: UPDATE_LOGIN_MODAL_STATUS, status });
export const updateUserEmail = (email) => ({ type: UPDATE_EMAIL, email });
export const updateUserPassword = (password) => ({ type: UPDATE_PASSWORD, password });