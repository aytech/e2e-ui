import {
  UPDATE_SERVER_ERROR,
  UPDATE_FORM_MESSAGES,
  UPDATE_FORM_STATUS,
  UPDATE_LOADING,
  UPDATE_LOADING_STATUS,
  UPDATE_BUILD_STATUS,
  UPDATE_EMAIL,
  UPDATE_STD_INPUT,
  UPDATE_PASSWORD,
  UPDATE_RUN_STATUS,
  UPDATE_STD_ERR,
  UPDATE_MESSAGES,
  UPDATE_REPORT_STATUS,
  UPDATE_BRANCH,
  UPDATE_DOCUMENT_TYPE,
  UPDATE_CAN_BE_STOPPED,
  UPDATE_MESSAGES_PASSED,
  UPDATE_MESSAGES_FAILED,
  UPDATE_MESSAGES_SKIPPED,
  UPDATE_STARTED_TIMESTAMP
} from "./constants";

export const updateBranch = (branch) => ({ type: UPDATE_BRANCH, branch });
export const updateBuildStatus = (isRunning) => ({ type: UPDATE_BUILD_STATUS, isRunning });
export const updateCanBeStopped = (status) => ({ type: UPDATE_CAN_BE_STOPPED, status });
export const updateDocumentType = (documentType) => ({ type: UPDATE_DOCUMENT_TYPE, documentType });
export const updateFormMessages = (messages) => ({ type: UPDATE_FORM_MESSAGES, messages });
export const updateFormStatus = (status) => ({ type: UPDATE_FORM_STATUS, status });
export const updateLoading = (isLoading) => ({ type: UPDATE_LOADING, isLoading });
export const updateLoadingStatus = (isStatusLoading) => ({ type: UPDATE_LOADING_STATUS, isStatusLoading });
export const updateMessages = (messages) => ({ type: UPDATE_MESSAGES, messages });
export const updateMessagesFailed = (messages) => ({ type: UPDATE_MESSAGES_FAILED, messages });
export const updateMessagesPassed = (messages) => ({ type: UPDATE_MESSAGES_PASSED, messages });
export const updateMessagesSkipped = (messages) => ({ type: UPDATE_MESSAGES_SKIPPED, messages });
export const updateStdErr = (error) => ({ type: UPDATE_STD_ERR, error });
export const updateStdInput = (input) => ({ type: UPDATE_STD_INPUT, input });
export const updateReportStatus = (status) => ({ type: UPDATE_REPORT_STATUS, status });
export const updateRunStatus = (isSuccessful) => ({ type: UPDATE_RUN_STATUS, isSuccessful });
export const updateServerErrorState = (isError) => ({ type: UPDATE_SERVER_ERROR, isError });
export const updateStartedTimestamp = (timestamp) => ({ type: UPDATE_STARTED_TIMESTAMP, timestamp });
export const updateUserEmail = (email) => ({ type: UPDATE_EMAIL, email });
export const updateUserPassword = (password) => ({ type: UPDATE_PASSWORD, password });