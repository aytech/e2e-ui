import {
  updateAuthenticatedStatus,
  updateLoginModalStatus,
  updateLoginWarn,
  updateLoginWarnMessage
} from "./authActions";
import { updateNodes } from "./outputActions";

export const handleUnauthorized = (dispatch) => {
  dispatch(updateAuthenticatedStatus(false));
  dispatch(updateLoginWarn(true));
  dispatch(updateLoginModalStatus(true));
  dispatch(updateLoginWarnMessage('Please login'));
};

export const updateNode = (node, nodes, dispatch) => {
  const filteredNodes = nodes.map(existingNode => {
    return existingNode.id === node.id ? node : existingNode;
  });
  dispatch(updateNodes(filteredNodes));
};