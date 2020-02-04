import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { createStore, applyMiddleware } from "redux";
import rootReducer from "./reducers/rootReducer";

const initialState = {
  auth: {
    email: '',
    loginErrorMessage: '',
    loginSuccessMessage: '',
    loginWarnMessage: '',
    isAuthenticated: false,
    isLoginError: false,
    isLoginModalOpen: false,
    isLoginSuccess: false,
    isLoginWarn: false,
    password: ''
  },
  state: {
    branch: '',
    buildInProgress: false,
    canProcessBeStopped: false,
    debugOutputEnabled: false,
    documentType: '',
    errorOutputEnabled: false,
    executionTime: '',
    finishedTimestamp: 0,
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
    serverErrorState: false,
    startedTimestamp: 0,
    stdErr: [],
    stdInput: [],
    successfulRun: false,
  }
};

const loggerMiddleware = createLogger();
const configureStore = (state = initialState) => {
  return createStore(
    rootReducer,
    state,
    applyMiddleware(
      thunkMiddleware,
      loggerMiddleware
    ))
};

export default configureStore;