import {
  UPDATE_CAN_BE_STOPPED,
  UPDATE_MODAL_OPEN,
  UPDATE_REPORT_LOADING,
  UPDATE_STOP_LOADING
} from "./constants";

export const updateCanBeStopped = (status) => ({ type: UPDATE_CAN_BE_STOPPED, status });
export const updateReportLoading = (status) => ({ type: UPDATE_REPORT_LOADING, status });
export const updateStopProcessLoading = (status) => ({ type: UPDATE_STOP_LOADING, status });
export const updateModalOpen = (status) => ({ type: UPDATE_MODAL_OPEN, status });