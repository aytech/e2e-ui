import { combineReducers } from "redux";
import runnerReducer from "./runnerReducer";
import authReducer from "./authReducer";
import settingsReducer from "./settingsReducer";
import stateReducer from "./stateReducer";

export default combineReducers({
  auth: authReducer,
  runner: runnerReducer,
  settings: settingsReducer,
  state: stateReducer
})