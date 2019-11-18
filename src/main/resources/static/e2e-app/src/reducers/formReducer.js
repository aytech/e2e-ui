import {
  IS_FORM_ERROR,
  IS_SERVER_ERROR,
  SET_FORM_ERRORS,
  SET_LOADING,
  SET_LOADING_STATUS,
  UPDATE_EMAIL,
  UPDATE_PASSWORD
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
    default:
      return state;
  }
}