import {
  UPDATE_NODES,
  UPDATE_SYSTEM_VARIABLES,
  UPDATE_VARIABLE_KEY,
  UPDATE_VARIABLE_VALUE,
  UPDATE_VARIABLES
} from "../actions/constants";

export default (state = {}, action) => {
  switch (action.type) {
    case UPDATE_SYSTEM_VARIABLES:
      return {
        ...state,
        systemVariables: action.variables
      };
    case UPDATE_VARIABLE_KEY:
      return {
        ...state,
        key: action.key
      };
    case UPDATE_VARIABLE_VALUE:
      return {
        ...state,
        value: action.value
      };
    case UPDATE_VARIABLES:
      return {
        ...state,
        variables: action.variables
      };
    default:
      return state;
  }
};