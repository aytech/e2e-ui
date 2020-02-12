import {
  UPDATE_SERVER_ERROR,
  UPDATE_LOADING_STATUS,
  UPDATE_BUILD_STATUS,
  UPDATE_STD_INPUT,
  UPDATE_RUN_STATUS,
  UPDATE_STD_ERR,
  UPDATE_MESSAGES,
  UPDATE_REPORT_STATUS,
  UPDATE_CAN_BE_STOPPED,
  UPDATE_MESSAGES_PASSED,
  UPDATE_MESSAGES_FAILED,
  UPDATE_MESSAGES_SKIPPED,
  UPDATE_STARTED_TIMESTAMP,
  UPDATE_FINISHED_TIMESTAMP
} from "./constants";
import DockerService from "../services/DockerService";
import Cookies from "universal-cookie/lib";
import { E2E_NODE, HttpStatuses } from "../constants/application";

const cookies = new Cookies();
const dockerService = new DockerService();

export const updateBuildStatus = (isRunning) => ({ type: UPDATE_BUILD_STATUS, isRunning });
export const updateCanBeStopped = (status) => ({ type: UPDATE_CAN_BE_STOPPED, status });
export const updateFinishedTimestamp = (timestamp) => ({ type: UPDATE_FINISHED_TIMESTAMP, timestamp });
export const updateLoadingStatus = (isStatusLoading) => ({ type: UPDATE_LOADING_STATUS, isStatusLoading });
export const updateMessages = (messages) => ({ type: UPDATE_MESSAGES, messages });
export const updateMessagesFailed = (messages) => ({ type: UPDATE_MESSAGES_FAILED, messages });
export const updateMessagesPassed = (messages) => ({ type: UPDATE_MESSAGES_PASSED, messages });
export const updateMessagesSkipped = (messages) => ({ type: UPDATE_MESSAGES_SKIPPED, messages });
export const updateStdErr = (error) => ({ type: UPDATE_STD_ERR, error });
export const updateStdInput = (input) => ({ type: UPDATE_STD_INPUT, input });
export const updateReportStatus = (status) => ({ type: UPDATE_REPORT_STATUS, status });
export const updateRunStatus = (isSuccessful) => ({ type: UPDATE_RUN_STATUS, isSuccessful });
export const updateServerErrorState = (isError) => ({ type: UPDATE_SERVER_ERROR, isError });
export const updateStartedTimestamp = (timestamp) => ({ type: UPDATE_STARTED_TIMESTAMP, timestamp });


export const fetchStatus = () => {
  return (dispatch) => {
    dockerService
      .getDockerBuildStatus()
      .then(response => {
        const {
          running,
          status
        } = response;
        if (status === HttpStatuses.UNAUTHORIZED) {
          // Disable all action buttons
          return;
        }
        dispatch(updateBuildStatus(running));
        // dispatch(updateCanBeStopped(response.canBeStopped));
        // dispatch(updateMessages(response.messages));
        // dispatch(updateMessagesFailed(response.messagesFailed));
        // dispatch(updateMessagesPassed(response.messagesPassed));
        // dispatch(updateMessagesSkipped(response.messagesSkipped));
        // dispatch(updateReportStatus(response.reportAvailable));
        // dispatch(updateServerErrorState(false));
        // dispatch(updateStdErr(response.stdErr));
        // dispatch(updateStdInput(response.stdInput));
        // if (response.startedTimestamp > 0) {
        //   dispatch(updateStartedTimestamp(response.startedTimestamp));
        // }
        // if (response.finishedTimestamp > 0) {
        //   dispatch(updateFinishedTimestamp(response.finishedTimestamp));
        // }
      })
      .catch(() => {
        dispatch(updateBuildStatus(false));
        // dispatch(updateServerErrorState(true));
        // dispatch(updateReportStatus(false));
      });
  }
};
export const fetchRunRequest = () => {
  return (dispatch) => {
    dispatch(updateBuildStatus(true));
    dispatch(updateFinishedTimestamp(0));
    dockerService
      .runE2ESuite()
      .then(response => {
        console.log('Response: ', response);
        if (response.status === 200) {
          //   cookies.set(E2E_NODE, response.nodeID, { path: '/' });
          //   dispatch(updateRunStatus(true));
          //   const timeoutID = setTimeout(() => {
          //     fetchStatus();
          //     clearTimeout(timeoutID);
          //   });
        }
      })
      .catch(() => {
        dispatch(updateServerErrorState(true));
      });
  }
};