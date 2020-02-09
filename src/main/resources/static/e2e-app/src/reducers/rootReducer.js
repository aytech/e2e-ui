import { combineReducers } from "redux";
import formReducer from "./formReducer";
import authReducer from "./authReducer";
import settingsReducer from "./settingsReducer";
import stateReducer from "./stateReducer";

export default combineReducers({
  auth: authReducer,
  form: formReducer,
  settings: settingsReducer,
  state: stateReducer
})