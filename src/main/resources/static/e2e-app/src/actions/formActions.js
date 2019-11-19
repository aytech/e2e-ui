import {
  IS_FORM_ERROR,
  IS_SERVER_ERROR,
  SET_FORM_ERRORS,
  SET_LOADING,
  SET_LOADING_STATUS,
  UPDATE_BUILD_STATUS,
  UPDATE_EMAIL,
  UPDATE_OUTPUT,
  UPDATE_PASSWORD,
  UPDATE_RUN_STATUS
} from "./constants";

export const updateBuildStatus = (isRunning) => ({ type: UPDATE_BUILD_STATUS, isRunning });
export const updateFormErrorBoolean = (isError) => ({ type: IS_FORM_ERROR, isError });
export const updateFormErrors = (errors) => ({ type: SET_FORM_ERRORS, errors });
export const updateLoading = (isLoading) => ({ type: SET_LOADING, isLoading });
export const updateLoadingStatus = (isStatusLoading) => ({ type: SET_LOADING_STATUS, isStatusLoading });
export const updateOutput = (output) => ({ type: UPDATE_OUTPUT, output });
export const updateRunStatus = (isSuccessful) => ({ type: UPDATE_RUN_STATUS, isSuccessful });
export const updateServerErrorState = (isError) => ({ type: IS_SERVER_ERROR, isError });
export const updateUserEmail = (email) => ({ type: UPDATE_EMAIL, email });
export const updateUserPassword = (password) => ({ type: UPDATE_PASSWORD, password });