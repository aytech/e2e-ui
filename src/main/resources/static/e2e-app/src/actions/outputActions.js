import {
  TOGGLE_DEBUG_ENABLED,
  TOGGLE_ERROR_ENABLED,
  UPDATE_HAS_CONFIGURATION
} from "./constants";

export const toggleDebugEnabled = (status) => ({ type: TOGGLE_DEBUG_ENABLED, status });
export const toggleErrorEnabled = (status) => ({ type: TOGGLE_ERROR_ENABLED, status });
export const updateHasConfiguration = (hasConfiguration) => ({ type: UPDATE_HAS_CONFIGURATION, hasConfiguration });