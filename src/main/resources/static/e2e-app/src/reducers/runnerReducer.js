import {
  UPDATE_SERVER_ERROR,
  UPDATE_BUILD_STATUS,
  UPDATE_DEBUG_ENABLED,
  UPDATE_ERROR_ENABLED,
  UPDATE_PASSED_OUTPUT,
  UPDATE_FAILED_OUTPUT,
  UPDATE_SKIPPED_OUTPUT,
  UPDATE_EXECUTION_TIME
} from "../actions/constants";

export default (state = {}, action) => {
  switch (action.type) {
    case UPDATE_BUILD_STATUS:
      return {
        ...state,
        buildInProgress: action.isRunning
      };
    case UPDATE_DEBUG_ENABLED:
      return {
        ...state,
        debugOutputEnabled: action.status
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
    case UPDATE_PASSED_OUTPUT:
      return {
        ...state,
        isPassedOutputActive: action.status
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
    default:
      return state;
  }
}