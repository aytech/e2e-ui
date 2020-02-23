import {
  UPDATE_CAN_BE_STOPPED,
  UPDATE_EXECUTION_TIME,
  UPDATE_FAILED_OUTPUT,
  UPDATE_MODAL_OPEN,
  UPDATE_NODE_REMOVE_PROGRESS, UPDATE_NODE_UPDATE_PROGRESS, UPDATE_NODES,
  UPDATE_PASSED_OUTPUT,
  UPDATE_REPORT_LOADING,
  UPDATE_SKIPPED_OUTPUT,
  UPDATE_STOP_LOADING
} from "./constants";
import DockerService from "../services/DockerService";
import OutputService from "../services/OutputService";

const dockerService = new DockerService();
const outputService = new OutputService();

export const updateCanBeStopped = (status) => ({ type: UPDATE_CAN_BE_STOPPED, status });
export const updateExecutionTime = (time) => ({ type: UPDATE_EXECUTION_TIME, time });
export const updateNodes = (nodes) => ({ type: UPDATE_NODES, nodes });
export const updateReportLoading = (status) => ({ type: UPDATE_REPORT_LOADING, status });
export const updateStopProcessLoading = (status) => ({ type: UPDATE_STOP_LOADING, status });
export const updateModalOpen = (status) => ({ type: UPDATE_MODAL_OPEN, status });
export const updateNodeRemoveProgress = (status) => ({ type: UPDATE_NODE_REMOVE_PROGRESS, status });
export const updateNodeUpdateProgress = (status) => ({ type: UPDATE_NODE_UPDATE_PROGRESS, status });
export const updatePassedOutput = (status) => ({ type: UPDATE_PASSED_OUTPUT, status });
export const updateFailedOutput = (status) => ({ type: UPDATE_FAILED_OUTPUT, status });
export const updateSkippedOutput = (status) => ({ type: UPDATE_SKIPPED_OUTPUT, status });

export const fetchStopRunningProcess = () => {
  return (dispatch) => {
    dispatch(updateModalOpen(false));
    dispatch(updateStopProcessLoading(true));
    dockerService
      .stopProcess()
      .finally(() => {
        dispatch(updateCanBeStopped(false));
        dispatch(updateStopProcessLoading(false));
      });
  }
};

export const removeNode = (nodeId, nodes) => {
  return (dispatch) => {
    outputService
      .deleteNode(nodeId)
      .then(response => {
        const { code } = response;
        if (code === 200) {
          const newNodes = nodes.filter(node => {
            return node.id !== nodeId;
          });
          dispatch(updateNodes(newNodes));
        }
      })
      .finally(() => {
        dispatch(updateNodeRemoveProgress(false));
      });
  };
};

export const fetchNode = (nodeId, nodes) => {
  return (dispatch) => {
    dispatch(updateNodeUpdateProgress(true));
    outputService
      .fetchNode(nodeId)
      .then(response => {
        const { code, data } = response;
        const { status, logs } = data;
        if (code === 200) {
          const newNodes = nodes.map(node => {
            if (node.id === nodeId) {
              node.status = status;
              node.logs = logs;
            }
            return node;
          });
          dispatch(updateNodes(newNodes));
        }
      })
      .finally(() => {
        dispatch(updateNodeUpdateProgress(false));
      });
  };
};