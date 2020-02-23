import { combineReducers } from "redux";
import runnerReducer from "./runnerReducer";
import authReducer from "./authReducer";
import settingsReducer from "./settingsReducer";
import stateReducer from "./stateReducer";
import outputReducer from "./outputReducer";

export default combineReducers({
  auth: authReducer,
  output: outputReducer,
  runner: runnerReducer,
  settings: settingsReducer,
  state: stateReducer
})