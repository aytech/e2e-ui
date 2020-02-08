import {
  UPDATE_SYSTEM_VARIABLES,
  UPDATE_VARIABLES
} from "../actions/constants";

export default (state = {}, action) => {
  switch (action.type) {
    case UPDATE_VARIABLES:
      return {
        ...state,
        variables: action.variables
      };
    case UPDATE_SYSTEM_VARIABLES:
      return {
        ...state,
        systemVariables: action.variables
      };
    default:
      return state;
  }
}