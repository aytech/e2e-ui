import {
  UPDATE_NODE_REMOVE_PROGRESS, UPDATE_NODE_UPDATE_PROGRESS,
  UPDATE_NODES
} from "../constants/actions";

export default (state = {}, action) => {
  switch (action.type) {
    case UPDATE_NODES:
      return {
        ...state,
        nodes: action.nodes
      };
    case UPDATE_NODE_REMOVE_PROGRESS:
      return {
        ...state,
        isNodeRemoveProgress: action.status
      };
    case UPDATE_NODE_UPDATE_PROGRESS:
      return {
        ...state,
        isNodeUpdateProgress: action.status
      };
    default:
      return state;
  }
}