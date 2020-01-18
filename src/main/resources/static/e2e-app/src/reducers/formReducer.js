import {
  UPDATE_SERVER_ERROR,
  UPDATE_FORM_MESSAGES,
  UPDATE_FORM_STATUS,
  UPDATE_LOADING_RUN,
  UPDATE_LOADING_STATUS,
  UPDATE_BUILD_STATUS,
  UPDATE_DEBUG_ENABLED,
  UPDATE_MESSAGES,
  UPDATE_RUN_STATUS,
  UPDATE_STD_ERR,
  UPDATE_STD_INPUT,
  UPDATE_ERROR_ENABLED,
  UPDATE_REPORT_LOADING,
  UPDATE_REPORT_STATUS,
  UPDATE_BRANCH,
  UPDATE_DOCUMENT_TYPE,
  UPDATE_STOP_LOADING,
  UPDATE_MODAL_OPEN,
  UPDATE_CAN_BE_STOPPED,
  UPDATE_PASSED_OUTPUT,
  UPDATE_FAILED_OUTPUT,
  UPDATE_SKIPPED_OUTPUT,
  UPDATE_MESSAGES_PASSED,
  UPDATE_MESSAGES_FAILED,
  UPDATE_MESSAGES_SKIPPED,
  UPDATE_STARTED_TIMESTAMP,
  UPDATE_EXECUTION_TIME,
  UPDATE_FINISHED_TIMESTAMP
} from "../actions/constants";

export default (state = {}, action) => {
  switch (action.type) {
    case UPDATE_BRANCH:
      return {
        ...state,
        branch: action.branch
      };
    case UPDATE_BUILD_STATUS:
      return {
        ...state,
        buildInProgress: action.isRunning
      };
    case UPDATE_CAN_BE_STOPPED:
      return {
        ...state,
        canProcessBeStopped: action.status
      };
    case UPDATE_DEBUG_ENABLED:
      return {
        ...state,
        debugOutputEnabled: action.status
      };
    case UPDATE_DOCUMENT_TYPE:
      return {
        ...state,
        documentType: action.documentType
      };
    case UPDATE_ERROR_ENABLED:
      return {
        ...state,
        errorOutputEnabled: action.status
      };
    case UPDATE_EXECUTION_TIME:
      return {
        ...state,
        executionTime: action.time
      };
    case UPDATE_FAILED_OUTPUT:
      return {
        ...state,
        isFailedOutputActive: action.status
      };
    case UPDATE_FINISHED_TIMESTAMP:
      return {
        ...state,
        finishedTimestamp: action.timestamp
      };
    case UPDATE_FORM_MESSAGES:
      return {
        ...state,
        formMessages: action.messages
      };
    case UPDATE_FORM_STATUS:
      return {
        ...state,
        formStatus: action.status
      };
    case UPDATE_LOADING_RUN:
      return {
        ...state,
        isLoading: action.isLoading
      };
    case UPDATE_LOADING_STATUS:
      return {
        ...state,
        isStatusLoading: action.isStatusLoading
      };
    case UPDATE_MESSAGES:
      return {
        ...state,
        messages: action.messages
      };
    case UPDATE_MESSAGES_FAILED:
      return {
        ...state,
        messagesFailed: action.messages
      };
    case UPDATE_MESSAGES_PASSED:
      return {
        ...state,
        messagesPassed: action.messages
      };
    case UPDATE_MESSAGES_SKIPPED:
      return {
        ...state,
        messagesSkipped: action.messages
      };
    case UPDATE_MODAL_OPEN:
      return {
        ...state,
        isModalOpen: action.status
      };
    case UPDATE_PASSED_OUTPUT:
      return {
        ...state,
        isPassedOutputActive: action.status
      };
    case UPDATE_REPORT_LOADING:
      return {
        ...state,
        isReportLoading: action.status
      };
    case UPDATE_REPORT_STATUS:
      return {
        ...state,
        isReportAvailable: action.status
      };
    case UPDATE_RUN_STATUS:
      return {
        ...state,
        successfulRun: action.isSuccessful
      };
    case UPDATE_SERVER_ERROR:
      return {
        ...state,
        serverErrorState: action.isError
      };
    case UPDATE_SKIPPED_OUTPUT:
      return {
        ...state,
        isSkippedOutputActive: action.status
      };
    case UPDATE_STARTED_TIMESTAMP:
      return {
        ...state,
        startedTimestamp: action.timestamp
      };
    case UPDATE_STD_ERR:
      return {
        ...state,
        stdErr: action.error
      };
    case UPDATE_STD_INPUT:
      return {
        ...state,
        stdInput: action.input
      };
    case UPDATE_STOP_LOADING:
      return {
        ...state,
        isStopProcessLoading: action.status
      };
    default:
      return state;
  }
}