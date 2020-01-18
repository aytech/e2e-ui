import { UPDATE_EMAIL, UPDATE_LOGIN_MODAL_STATUS, UPDATE_PASSWORD } from "../actions/constants";

export default (state = {}, action) => {
  switch (action.type) {
    case UPDATE_EMAIL:
      return {
        ...state,
        email: action.email
      };
    case UPDATE_LOGIN_MODAL_STATUS:
      return {
        ...state,
        isLoginModalOpen: action.status
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