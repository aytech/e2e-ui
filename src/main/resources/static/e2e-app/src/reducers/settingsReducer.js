import {
  UPDATE_SYSTEM,
  UPDATE_SYSTEM_KEY,
  UPDATE_SYSTEM_VALUE,
  UPDATE_SYSTEM_VARIABLES,
  UPDATE_VARIABLE_KEY,
  UPDATE_VARIABLE_SYSTEM_TYPE,
  UPDATE_VARIABLE_TYPE,
  UPDATE_VARIABLE_VALUE,
  UPDATE_VARIABLES
} from "../actions/constants";

export default (state = {}, action) => {
  switch (action.type) {
    case UPDATE_SYSTEM:
      return {
        ...state,
        system: action.isSystem
      };
    case UPDATE_SYSTEM_KEY:
      return {
        ...state,
        systemKey: action.key
      };
    case UPDATE_SYSTEM_VALUE:
      return {
        ...state,
        systemValue: action.value
      };
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
    case UPDATE_VARIABLE_SYSTEM_TYPE:
      return {
        ...state,
        systemType: action.newType
      };
    case UPDATE_VARIABLE_TYPE:
      return {
        ...state,
        type: action.newType
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