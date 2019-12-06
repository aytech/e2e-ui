import { createStore } from "redux";
import rootReducer from "./reducers/rootReducer";

const initialState = {
  state: {
    branch: '',
    buildInProgress: false,
    canProcessBeStopped: false,
    debugOutputEnabled: false,
    documentType: '',
    errorOutputEnabled: false,
    email: '',
    formStatus: null,
    formMessages: [],
    isFailedOutputActive: false,
    isLoading: false,
    isModalOpen: false,
    isPassedOutputActive: false,
    isReportAvailable: false,
    isReportLoading: false,
    isSkippedOutputActive: false,
    isStatusLoading: false,
    isStopProcessLoading: false,
    messages: [],
    messagesFailed: [],
    messagesPassed: [],
    messagesSkipped: [],
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