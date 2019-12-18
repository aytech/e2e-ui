import {
  UPDATE_SERVER_ERROR,
  UPDATE_FORM_MESSAGES,
  UPDATE_FORM_STATUS,
  UPDATE_LOADING_RUN,
  UPDATE_LOADING_STATUS,
  UPDATE_BUILD_STATUS,
  UPDATE_EMAIL,
  UPDATE_STD_INPUT,
  UPDATE_PASSWORD,
  UPDATE_RUN_STATUS,
  UPDATE_STD_ERR,
  UPDATE_MESSAGES,
  UPDATE_REPORT_STATUS,
  UPDATE_BRANCH,
  UPDATE_DOCUMENT_TYPE,
  UPDATE_CAN_BE_STOPPED,
  UPDATE_MESSAGES_PASSED,
  UPDATE_MESSAGES_FAILED,
  UPDATE_MESSAGES_SKIPPED,
  UPDATE_STARTED_TIMESTAMP,
  UPDATE_FINISHED_TIMESTAMP
} from "./constants";
import DockerService from "../services/DockerService";
import Cookies from "universal-cookie/lib";
import { E2E_NODE } from "../constants/application";

const cookies = new Cookies();
const dockerService = new DockerService();

export const updateBranch = (branch) => ({ type: UPDATE_BRANCH, branch });
export const updateBuildStatus = (isRunning) => ({ type: UPDATE_BUILD_STATUS, isRunning });
export const updateCanBeStopped = (status) => ({ type: UPDATE_CAN_BE_STOPPED, status });
export const updateDocumentType = (documentType) => ({ type: UPDATE_DOCUMENT_TYPE, documentType });
export const updateFinishedTimestamp = (timestamp) => ({ type: UPDATE_FINISHED_TIMESTAMP, timestamp });
export const updateFormMessages = (messages) => ({ type: UPDATE_FORM_MESSAGES, messages });
export const updateFormStatus = (status) => ({ type: UPDATE_FORM_STATUS, status });
export const updateLoadingRun = (isLoading) => ({ type: UPDATE_LOADING_RUN, isLoading });
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
export const updateUserEmail = (email) => ({ type: UPDATE_EMAIL, email });
export const updateUserPassword = (password) => ({ type: UPDATE_PASSWORD, password });
export const fetchStatus = () => {
  return (dispatch) => {
    dispatch(updateLoadingStatus(true));
    dockerService
      .getDockerBuildStatus()
      .then(status => {
        // noinspection JSUnresolvedVariable
        dispatch(updateBuildStatus(status.running));
        // noinspection JSUnresolvedVariable
        dispatch(updateCanBeStopped(status.canBeStopped));
        dispatch(updateMessages(status.messages));
        dispatch(updateMessagesFailed(status.messagesFailed));
        dispatch(updateMessagesPassed(status.messagesPassed));
        dispatch(updateMessagesSkipped(status.messagesSkipped));
        // noinspection JSUnresolvedVariable
        dispatch(updateReportStatus(status.reportAvailable));
        dispatch(updateServerErrorState(false));
        dispatch(updateStdErr(status.stdErr));
        dispatch(updateStdInput(status.stdInput));
        if (status.startedTimestamp > 0) {
          dispatch(updateStartedTimestamp(status.startedTimestamp));
        }
        if (status.finishedTimestamp > 0) {
          dispatch(updateFinishedTimestamp(status.finishedTimestamp));
        }
      })
      .catch(() => {
        dispatch(updateBuildStatus(false));
        dispatch(updateServerErrorState(true));
        dispatch(updateReportStatus(false));
      })
      .finally(() => {
        dispatch(updateLoadingStatus(false));
      });
  }
};
export const fetchRunRequest = (request) => {
  return (dispatch) => {
    dispatch(updateLoadingRun(true));
    dispatch(updateFinishedTimestamp(0));
    dockerService
      .runE2ESuite(request)
      .then(response => {
        if (response.status === 200) {
          // noinspection JSUnresolvedVariable
          cookies.set(E2E_NODE, response.nodeID, { path: '/' });
          dispatch(updateFormMessages([ 'Process has started, log output will print below' ]));
          dispatch(updateRunStatus(true));
          const timeoutID = setTimeout(() => {
            fetchStatus();
            clearTimeout(timeoutID);
          });
        } else {
          console.log("Error: ", response);
        }
      })
      .catch(() => {
        dispatch(updateServerErrorState(true));
      })
      .finally(() => {
        updateLoadingRun(false);
      })
  }
};