import {
  IS_SERVER_ERROR,
  SET_FORM_MESSAGES,
  SET_FORM_STATUS,
  SET_LOADING,
  SET_LOADING_STATUS,
  UPDATE_BUILD_STATUS,
  TOGGLE_DEBUG_ENABLED,
  UPDATE_EMAIL,
  UPDATE_MESSAGES,
  UPDATE_PASSWORD,
  UPDATE_RUN_STATUS,
  UPDATE_STD_ERR,
  UPDATE_STD_INPUT,
  TOGGLE_ERROR_ENABLED,
  UPDATE_REPORT_LOADING,
  UPDATE_REPORT_STATUS,
  UPDATE_BRANCH,
  UPDATE_DOCUMENT_TYPE
} from "../actions/constants";

export default (state = {}, action) => {
  switch (action.type) {
    case UPDATE_EMAIL:
      return {
        ...state,
        email: action.email
      };
    case UPDATE_PASSWORD:
      return {
        ...state,
        password: action.password
      };
    case SET_FORM_STATUS:
      return {
        ...state,
        formStatus: action.status
      };
    case SET_FORM_MESSAGES:
      return {
        ...state,
        formMessages: action.messages
      };
    case SET_LOADING:
      return {
        ...state,
        isLoading: action.isLoading
      };
    case SET_LOADING_STATUS:
      return {
        ...state,
        isStatusLoading: action.isStatusLoading
      };
    case IS_SERVER_ERROR:
      return {
        ...state,
        serverErrorState: action.isError
      };
    case TOGGLE_DEBUG_ENABLED:
      return {
        ...state,
        debugOutputEnabled: action.status
      };
    case TOGGLE_ERROR_ENABLED:
      return {
        ...state,
        errorOutputEnabled: action.status
      };
    case UPDATE_BRANCH:
      return {
        ...state,
        branch: action.branch
      };
    case UPDATE_DOCUMENT_TYPE:
      return {
        ...state,
        documentType: action.documentType
      };
    case UPDATE_MESSAGES:
      return {
        ...state,
        messages: action.messages
      };
    case UPDATE_REPORT_LOADING:
      return {
        ...state,
        isReportLoading: action.isLoading
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
    case UPDATE_BUILD_STATUS:
      return {
        ...state,
        buildInProgress: action.isRunning
      };
    default:
      return state;
  }
}