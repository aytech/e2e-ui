import { createStore } from "redux";
import rootReducer from "./reducers/rootReducer";

const initialState = {
  formState: {
    email: '',
    buildInProgress: false,
    formError: false,
    formErrorMessages: [],
    isLoading: false,
    password: '',
    serverErrorState: false,
    successfulRun: false
  },
  outputState: {}
};

const configureStore = (state = initialState) => {
  return createStore(rootReducer, state)
};

export default configureStore;