import { createStore } from "redux";
import rootReducer from "./reducers/rootReducer";

const initialState = {
  formState: {
    email: '',
    buildInProgress: false,
    formError: false,
    formErrorMessages: [],
    isLoading: false,
    isStatusLoading: false,
    password: '',
    serverErrorState: false,
    successfulRun: false
  },
  outputState: {
    buildInProgress: false,
    output: []
  }
};

const configureStore = (state = initialState) => {
  return createStore(rootReducer, state)
};

export default configureStore;