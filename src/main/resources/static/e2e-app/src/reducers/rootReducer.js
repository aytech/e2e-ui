import { combineReducers } from "redux";
import formReducer from "./formReducer";
import authReducer from "./authReducer";
import stateReducer from "./stateReducer";

export default combineReducers({
  auth: authReducer,
  form: formReducer,
  state: stateReducer
})