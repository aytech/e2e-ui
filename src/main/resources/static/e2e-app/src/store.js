import { createStore } from "redux";
import rootReducer from "./reducers/rootReducer";

const initialState = {
  state: {
    buildInProgress: false,
    debugOutputEnabled: false,
    errorOutputEnabled: false,
    email: '',
    formStatus: null,
    formMessages: [],
    isLoading: false,
    isStatusLoading: false,
    messages: [],
    password: '',
    serverErrorState: false,
    stdErr: [],
    stdInput: [],
    successfulRun: false,
  }
};

const configureStore = (state = initialState) => {
  return createStore(rootReducer, state)
};

export default configureStore;