import {
  UPDATE_AUTH_STATUS,
  UPDATE_EMAIL,
  UPDATE_LOGIN_ERROR,
  UPDATE_LOGIN_ERROR_MESSAGE,
  UPDATE_LOGIN_MODAL_STATUS,
  UPDATE_LOGIN_SUCCESS,
  UPDATE_LOGIN_SUCCESS_MESSAGE,
  UPDATE_LOGIN_WARN,
  UPDATE_LOGIN_WARN_MESSAGE,
  UPDATE_PASSWORD
} from "../actions/constants";

export default (state = {}, action) => {
  switch (action.type) {
    case UPDATE_AUTH_STATUS:
      return {
        ...state,
        isAuthenticated: action.status
      };
    case UPDATE_EMAIL:
      return {
        ...state,
        email: action.email
      };
    case UPDATE_LOGIN_ERROR:
      return {
        ...state,
        isLoginError: action.status
      };
    case UPDATE_LOGIN_ERROR_MESSAGE:
      return {
        ...state,
        loginErrorMessage: action.message
      };
    case UPDATE_LOGIN_SUCCESS_MESSAGE:
      return {
        ...state,
        loginSuccessMessage: action.message
      };
    case UPDATE_LOGIN_MODAL_STATUS:
      return {
        ...state,
        isLoginModalOpen: action.status
      };
    case UPDATE_LOGIN_SUCCESS:
      return {
        ...state,
        isLoginSuccess: action.status
      };
    case UPDATE_LOGIN_WARN:
      return {
        ...state,
        isLoginWarn: action.status
      };
    case UPDATE_LOGIN_WARN_MESSAGE:
      return {
        ...state,
        loginWarnMessage: action.message
      };
    case UPDATE_PASSWORD:
      return {
        ...state,
        password: action.password
      };
    default:
      return state
  }
}