import {
  IS_SERVER_ERROR,
  SET_FORM_MESSAGES,
  SET_FORM_STATUS,
  SET_LOADING,
  SET_LOADING_STATUS,
  UPDATE_BUILD_STATUS,
  UPDATE_EMAIL,
  UPDATE_STD_INPUT,
  UPDATE_PASSWORD,
  UPDATE_RUN_STATUS,
  UPDATE_STD_ERR,
  UPDATE_MESSAGES,
  UPDATE_REPORT_STATUS
} from "./constants";

export const updateBuildStatus = (isRunning) => ({ type: UPDATE_BUILD_STATUS, isRunning });
export const updateFormStatus = (status) => ({ type: SET_FORM_STATUS, status });
export const updateFormMessages = (messages) => ({ type: SET_FORM_MESSAGES, messages });
export const updateLoading = (isLoading) => ({ type: SET_LOADING, isLoading });
export const updateLoadingStatus = (isStatusLoading) => ({ type: SET_LOADING_STATUS, isStatusLoading });
export const updateMessages = (messages) => ({ type: UPDATE_MESSAGES, messages });
export const updateStdErr = (error) => ({ type: UPDATE_STD_ERR, error });
export const updateStdInput = (input) => ({ type: UPDATE_STD_INPUT, input });
export const updateReportStatus = (status) => ({ type: UPDATE_REPORT_STATUS, status });
export const updateRunStatus = (isSuccessful) => ({ type: UPDATE_RUN_STATUS, isSuccessful });
export const updateServerErrorState = (isError) => ({ type: IS_SERVER_ERROR, isError });
export const updateUserEmail = (email) => ({ type: UPDATE_EMAIL, email });
export const updateUserPassword = (password) => ({ type: UPDATE_PASSWORD, password });