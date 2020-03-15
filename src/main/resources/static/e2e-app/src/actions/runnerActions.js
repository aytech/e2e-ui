import {
  UPDATE_SERVER_ERROR,
  UPDATE_BUILD_STATUS
} from "../constants/actions";
import DockerService from "../services/DockerService";
import { HttpStatuses } from "../constants/application";
import {
  updateAuthenticatedStatus,
  updateLoginModalStatus,
  updateLoginWarn,
  updateLoginWarnMessage
} from "./authActions";

const dockerService = new DockerService();

export const updateBuildStatus = (isRunning) => ({ type: UPDATE_BUILD_STATUS, isRunning });
export const updateServerErrorState = (isError) => ({ type: UPDATE_SERVER_ERROR, isError });

export const runSuite = () => {
  return (dispatch) => {
    dispatch(updateBuildStatus(true));
    dockerService
      .runE2ESuite()
      .then(response => {
        const { status } = response;
        if (status === HttpStatuses.UNAUTHORIZED) {
          dispatch(updateAuthenticatedStatus(false));
          dispatch(updateLoginModalStatus(true));
          dispatch(updateLoginWarnMessage('Please login'));
          dispatch(updateLoginWarn(true));
        }
      })
      .catch(() => {
        dispatch(updateServerErrorState(true));
      });
  }
};