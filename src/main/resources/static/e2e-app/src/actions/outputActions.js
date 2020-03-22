import {
  UPDATE_EXECUTION_TIME,
  UPDATE_FAILED_OUTPUT,
  UPDATE_NODE_REMOVE_PROGRESS,
  UPDATE_NODE_UPDATE_PROGRESS,
  UPDATE_NODES,
  UPDATE_PASSED_OUTPUT,
  UPDATE_SKIPPED_OUTPUT
} from "../constants/actions";
import DockerService from "../services/DockerService";
import OutputService from "../services/OutputService";
import { HttpStatuses } from "../constants/application";
import {
  handleUnauthorized,
  updateNode
} from "./genericActions";

const dockerService = new DockerService();
const outputService = new OutputService();

export const updateExecutionTime = (time) => ({ type: UPDATE_EXECUTION_TIME, time });
export const updateNodes = (nodes) => ({ type: UPDATE_NODES, nodes });
export const updateNodeRemoveProgress = (status) => ({ type: UPDATE_NODE_REMOVE_PROGRESS, status });
export const updateNodeUpdateProgress = (status) => ({ type: UPDATE_NODE_UPDATE_PROGRESS, status });
export const updatePassedOutput = (status) => ({ type: UPDATE_PASSED_OUTPUT, status });
export const updateFailedOutput = (status) => ({ type: UPDATE_FAILED_OUTPUT, status });
export const updateSkippedOutput = (status) => ({ type: UPDATE_SKIPPED_OUTPUT, status });

export const stopNode = (nodeId, nodes) => {
  return (dispatch) => {
    dockerService
      .stopProcess(nodeId)
      .then(response => {
        const { status, node } = response;
        if (status === HttpStatuses.UNAUTHORIZED) {
          handleUnauthorized(dispatch)
        }
        if (status === HttpStatuses.OK) {
          updateNode(node, nodes, dispatch);
        }
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
        const { logs, status, stoppable } = data;
        if (code === 200) {
          const newNodes = nodes.map(node => {
            if (node.id === nodeId) {
              node.logs = logs;
              node.status = status;
              node.stoppable = stoppable;
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

export const downloadReportZip = (nodeId) => {
  return (dispatch) => {
    dockerService
      .downloadReportZip(nodeId)
      .then(response => {
        const { status } = response;
        if (status === HttpStatuses.OK) {
          return response.blob();
        }
        if (status === HttpStatuses.UNAUTHORIZED) {
          handleUnauthorized(dispatch);
        }
        return null;
      })
      .then(blob => {
        if (blob !== null) {
          let url = window.URL.createObjectURL(blob);
          let a = document.createElement('a');
          a.href = url;
          a.download = 'e2e_report.zip';
          a.click();
        }
      })
      .finally(() => {
      });
  };
};