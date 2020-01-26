import { UPDATE_SETTINGS_MODAL_STATUS } from "../actions/constants";

export default (state = {}, action) => {
  switch (action.type) {
    case UPDATE_SETTINGS_MODAL_STATUS:
      return {
        ...state,
        isSettingsModalOpen: action.status
      };
    default:
      return state;
  }
}