import {
  UPDATE_EMAIL,
  UPDATE_LOGIN_MODAL_STATUS,
  UPDATE_PASSWORD
} from "./constants";

export const updateLoginModalStatus = (status) => ({type: UPDATE_LOGIN_MODAL_STATUS, status});
export const updateUserEmail = (email) => ({ type: UPDATE_EMAIL, email });
export const updateUserPassword = (password) => ({ type: UPDATE_PASSWORD, password });