import { createStore } from "redux";
import rootReducer from "./reducers/rootReducer";

const initialState = {
  state: {
    email: '',
    buildInProgress: false,
    formError: false,
    formErrorMessages: [],
    isLoading: false,
    isStatusLoading: false,
    password: '',
    serverErrorState: false,
    successfulRun: false,
    output: []
  }
};

const configureStore = (state = initialState) => {
  return createStore(rootReducer, state)
};

export default configureStore;