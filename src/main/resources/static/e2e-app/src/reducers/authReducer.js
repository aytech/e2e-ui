import {
  UPDATE_AUTH_STATUS,
  UPDATE_EMAIL,
  UPDATE_LOGIN_MODAL_STATUS, UPDATE_LOGIN_SUCCESS, UPDATE_LOGIN_SUCCESS_MESSAGE,
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
    case UPDATE_LOGIN_SUCCESS_MESSAGE:
      return {
        ...state,
        successMessage: action.message
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
    case UPDATE_PASSWORD:
      return {
        ...state,
        password: action.password
      };
    default:
      return state
  }
}