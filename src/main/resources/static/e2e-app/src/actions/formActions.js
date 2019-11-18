import {
  IS_FORM_ERROR,
  IS_SERVER_ERROR,
  SET_FORM_ERRORS,
  SET_LOADING,
  UPDATE_EMAIL,
  UPDATE_PASSWORD
} from "./constants";

export const updateUserEmail = (email) => ({ type: UPDATE_EMAIL, email });
export const updateUserPassword = (password) => ({ type: UPDATE_PASSWORD, password });
export const updateFormErrorBoolean = (isError) => ({ type: IS_FORM_ERROR, isError });
export const updateFormErrors = (errors) => ({ type: SET_FORM_ERRORS, errors });
export const updateLoadingStatus = (isLoading) => ({ type: SET_LOADING, isLoading });
export const updateServerErrorState = (isError) => ({ type: IS_SERVER_ERROR, isError });