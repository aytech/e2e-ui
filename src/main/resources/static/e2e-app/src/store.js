import { createStore } from "redux";
import rootReducer from "./reducers/rootReducer";

const initialState = {
  state: {
    branch: '',
    buildInProgress: false,
    debugOutputEnabled: false,
    documentType: '',
    errorOutputEnabled: false,
    email: '',
    formStatus: null,
    formMessages: [],
    isLoading: false,
    isModalOpen: false,
    isReportAvailable: false,
    isReportLoading: false,
    isStatusLoading: false,
    isStopProcessLoading: false,
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