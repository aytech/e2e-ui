import { createStore } from "redux";
import rootReducer from "./reducers/rootReducer";

const initialState = {
  state: {
    email: '',
    buildInProgress: false,
    formStatus: null,
    formMessages: [],
    isLoading: false,
    isStatusLoading: false,
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