import {
  UPDATE_SYSTEM_VARIABLES,
  UPDATE_VARIABLE_KEY,
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

export const updateSystemVariables = (variables) => ({ type: UPDATE_SYSTEM_VARIABLES, variables });
export const updateVariableKey = (key) => ({ type: UPDATE_VARIABLE_KEY, key });
export const updateVariables = (variables) => ({ type: UPDATE_VARIABLES, variables });
export const updateVariableValue = (value) => ({ type: UPDATE_VARIABLE_VALUE, value });

const settingsService = new SettingsService();

export const saveVariable = (key, value, variables) => {
  return (dispatch) => {
    settingsService
      .createVariable(key, value)
      .then(response => {
        const { status, variable } = response;
        if (status === 200) {
          variables.push(variable);
          dispatch(updateVariables(variables));
          dispatch(updateVariableKey(''));
          dispatch(updateVariableValue(''));
        }
        if (status === 401) {
          dispatch(updateLoginWarn(true));
          dispatch(updateLoginModalStatus(true));
          dispatch(updateLoginWarnMessage('Please login'));
        }
      });
  }
};

export const updateVariable = (id, key, value) => {
  return (dispatch) => {
    settingsService
      .updateVariable(id, key, value)
      .then(response => {
        const { status } = response;
        if (status === 200) {
          // No need to handle success, variable
          // was already updated during onChange
        }
        if (status === 401) {
          dispatch(updateLoginWarn(true));
          dispatch(updateLoginModalStatus(true));
          dispatch(updateLoginWarnMessage('Please login'));
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
        if (status === 200) {
          const newVariables = variables.filter(v => v.id !== id);
          dispatch(updateVariables(newVariables));
        }
        if (status === 401) {
          dispatch(updateLoginWarn(true));
          dispatch(updateLoginModalStatus(true));
          dispatch(updateLoginWarnMessage('Please login'));
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
          variables
        } = response;
        if (status === 200) {
          dispatch(updateAuthenticatedStatus(true));
          dispatch(updateSystemVariables(systemVariables));
          dispatch(updateVariables(variables));
          dispatch(updateNodes(nodes));
        } else if (status === 401) {
          dispatch(updateAuthenticatedStatus(false));
          dispatch(updateLoginModalStatus(true));
          dispatch(updateLoginWarnMessage('Please login'));
          dispatch(updateLoginWarn(true));
        }
      })
  }
};