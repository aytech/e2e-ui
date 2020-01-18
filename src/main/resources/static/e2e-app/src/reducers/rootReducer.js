import { combineReducers } from "redux";
import formReducer from "./formReducer";
import authReducer from "./authReducer";

export default combineReducers({
  auth: authReducer,
  state: formReducer
})