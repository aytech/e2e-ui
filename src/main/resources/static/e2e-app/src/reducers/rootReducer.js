import { combineReducers } from "redux";
import formReducer from "./formReducer";
import outputReducer from "./outputReducer";

export default combineReducers({
  formState: formReducer,
  outputState: outputReducer
})