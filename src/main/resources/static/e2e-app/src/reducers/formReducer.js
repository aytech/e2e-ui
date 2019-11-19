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
    case IS_FORM_ERROR:
      return {
        ...state,
        formError: action.isError
      };
    case SET_FORM_ERRORS:
      return {
        ...state,
        formErrorMessages: action.errors
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
    case UPDATE_RUN_STATUS:
      return {
        ...state,
        successfulRun: action.isSuccessful
      };
    case UPDATE_OUTPUT:
      return {
        ...state,
        output: action.output
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