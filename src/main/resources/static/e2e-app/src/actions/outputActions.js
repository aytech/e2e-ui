import {
  TOGGLE_DEBUG_ENABLED,
  TOGGLE_ERROR_ENABLED
} from "./constants";

export const toggleDebugEnabled = (status) => ({ type: TOGGLE_DEBUG_ENABLED, status });
export const toggleErrorEnabled = (status) => ({ type: TOGGLE_ERROR_ENABLED, status });