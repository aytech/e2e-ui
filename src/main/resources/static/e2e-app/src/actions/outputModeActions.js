import {
  UPDATE_DEBUG_ENABLED,
  UPDATE_ERROR_ENABLED
} from "../constants/actions";

export const updateDebugEnabled = (status) => ({ type: UPDATE_DEBUG_ENABLED, status });
export const updateErrorEnabled = (status) => ({ type: UPDATE_ERROR_ENABLED, status });