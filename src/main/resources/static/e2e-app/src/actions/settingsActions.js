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
} from "./constants";
import {
  updateAuthenticatedStatus,
  updateLoginModalStatus,
  updateLoginWarn,
  updateLoginWarnMessage
} from "./authActions";
import SettingsService from "../services/SettingsService";
import { updateNodes } from "./outputActions";
import { HttpStatuses } from "../constants/application";

export const updateSystem = (isSystem) => ({ type: UPDATE_SYSTEM, isSystem });
export const updateSystemKey = (key) => ({ type: UPDATE_SYSTEM_KEY, key });
export const updateSystemValue = (value) => ({ type: UPDATE_SYSTEM_VALUE, value });
export const updateSystemVariables = (variables) => ({ type: UPDATE_SYSTEM_VARIABLES, variables });
export const updateSystemType = (newType) => ({ type: UPDATE_VARIABLE_SYSTEM_TYPE, newType });
export const updateType = (newType) => ({ type: UPDATE_VARIABLE_TYPE, newType });
export const updateVariableKey = (key) => ({ type: UPDATE_VARIABLE_KEY, key });
export const updateVariables = (variables) => ({ type: UPDATE_VARIABLES, variables });
export const updateVariableValue = (value) => ({ type: UPDATE_VARIABLE_VALUE, value });

const settingsService = new SettingsService();

const handleUnauthorized = (dispatch) => {
  dispatch(updateLoginWarn(true));
  dispatch(updateLoginModalStatus(true));
  dispatch(updateLoginWarnMessage('Please login'));
};

const handleVariableResponse = (dispatch, response, variables) => {
  const { status, variable } = response;
  if (status === HttpStatuses.OK) {
    variables.push(variable);
    dispatch(updateVariables(variables));
    dispatch(updateVariableKey(''));
    dispatch(updateVariableValue(''));
  }
  if (status === HttpStatuses.UNAUTHORIZED) {
    handleUnauthorized(dispatch);
  }
};

const handleSystemVariableResponse = (dispatch, response, variables) => {
  const { status, variable } = response;
  if (status === HttpStatuses.OK) {
    variables.push(variable);
    dispatch(updateSystemVariables(variables));
    dispatch(updateSystemKey(''));
    dispatch(updateSystemValue(''));
  }
  if (status === HttpStatuses.UNAUTHORIZED) {
    handleUnauthorized(dispatch);
  }
};

export const saveVariable = (variable, variables) => {
  return (dispatch) => {
    settingsService
      .createVariable(variable)
      .then(response => {
        handleVariableResponse(dispatch, response, variables)
      });
  }
};

export const saveSystemVariable = (variable, variables) => {
  return (dispatch) => {
    settingsService
      .createSystemVariable(variable)
      .then(response => {
        handleSystemVariableResponse(dispatch, response, variables);
      });
  }
};

export const updateVariable = (variable) => {
  return (dispatch) => {
    settingsService
      .updateVariable(variable)
      .then(response => {
        const { status } = response;
        if (status === HttpStatuses.OK) {
          dispatch(updateVariableKey(''));
          dispatch(updateVariableValue(''));
        }
        if (status === HttpStatuses.UNAUTHORIZED) {
          handleUnauthorized(dispatch);
        }
      });
  }
};

export const updateSystemVariable = (variable) => {
  return (dispatch) => {
    settingsService
      .updateSystemVariable(variable)
      .then(response => {
        const { status } = response;
        if (status === HttpStatuses.OK) {
          dispatch(updateSystemKey(''));
          dispatch(updateSystemValue(''));
        }
        if (status === HttpStatuses.UNAUTHORIZED) {
          handleUnauthorized(dispatch);
        }
      });
  }
};

export const removeVariable = (id, variables) => {
  return (dispatch) => {
    settingsService
      .removeVariable(id)
      .then(response => {
        const { status } = response;
        if (status === HttpStatuses.GONE) {
          const newVariables = variables.filter(v => v.id !== id);
          dispatch(updateVariables(newVariables));
        }
        if (status === HttpStatuses.UNAUTHORIZED) {
          handleUnauthorized(dispatch);
        }
      })
  }
};

export const removeSystemVariable = (id, variables) => {
  return (dispatch) => {
    settingsService
      .removeSystemVariable(id)
      .then(response => {
        const { status } = response;
        if (status === HttpStatuses.GONE) {
          const newVariables = variables.filter(v => v.id !== id);
          dispatch(updateSystemVariables(newVariables));
        }
        if (status === HttpStatuses.UNAUTHORIZED) {
          handleUnauthorized(dispatch);
        }
      })
  }
};

export const fetchSettings = () => {
  return (dispatch) => {
    settingsService
      .getSettings()
      .then(response => {
        const {
          nodes,
          status,
          systemVariables,
          variables,
          system
        } = response;
        if (status === 200) {
          dispatch(updateAuthenticatedStatus(true));
          dispatch(updateSystemVariables(systemVariables));
          dispatch(updateVariables(variables));
          dispatch(updateNodes(nodes));
          dispatch(updateSystem(system));
        } else if (status === 401) {
          dispatch(updateAuthenticatedStatus(false));
          dispatch(updateLoginModalStatus(true));
          dispatch(updateLoginWarnMessage('Please login'));
          dispatch(updateLoginWarn(true));
        }
      })
  }
};