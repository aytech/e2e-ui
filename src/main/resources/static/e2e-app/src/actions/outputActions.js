import {
  UPDATE_CAN_BE_STOPPED,
  UPDATE_EXECUTION_TIME,
  UPDATE_FAILED_OUTPUT,
  UPDATE_MODAL_OPEN,
  UPDATE_PASSED_OUTPUT,
  UPDATE_REPORT_LOADING,
  UPDATE_SKIPPED_OUTPUT,
  UPDATE_STOP_LOADING
} from "./constants";

export const updateCanBeStopped = (status) => ({ type: UPDATE_CAN_BE_STOPPED, status });
export const updateExecutionTime = (time) => ({ type: UPDATE_EXECUTION_TIME, time });
export const updateReportLoading = (status) => ({ type: UPDATE_REPORT_LOADING, status });
export const updateStopProcessLoading = (status) => ({ type: UPDATE_STOP_LOADING, status });
export const updateModalOpen = (status) => ({ type: UPDATE_MODAL_OPEN, status });
export const updatePassedOutput = (status) => ({ type: UPDATE_PASSED_OUTPUT, status });
export const updateFailedOutput = (status) => ({ type: UPDATE_FAILED_OUTPUT, status });
export const updateSkippedOutput = (status) => ({ type: UPDATE_SKIPPED_OUTPUT, status });