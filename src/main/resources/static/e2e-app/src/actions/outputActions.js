import {
  UPDATE_DEBUG_ENABLED,
  UPDATE_ERROR_ENABLED,
  UPDATE_MODAL_OPEN,
  UPDATE_REPORT_LOADING,
  UPDATE_STOP_LOADING
} from "./constants";

export const updateDebugEnabled = (status) => ({ type: UPDATE_DEBUG_ENABLED, status });
export const updateErrorEnabled = (status) => ({ type: UPDATE_ERROR_ENABLED, status });
export const updateReportLoading = (status) => ({ type: UPDATE_REPORT_LOADING, status });
export const updateStopProcessLoading = (status) => ({ type: UPDATE_STOP_LOADING, status });
export const updateModalOpen = (status) => ({ type: UPDATE_MODAL_OPEN, status });