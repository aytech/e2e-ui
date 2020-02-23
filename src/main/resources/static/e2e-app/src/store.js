import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { createStore, applyMiddleware } from "redux";
import rootReducer from "./reducers/rootReducer";

const initialState = {
  auth: {
    email: 'oyapparov@gmail.com',
    loginErrorMessage: '',
    loginSuccessMessage: '',
    loginWarnMessage: '',
    isAuthenticated: false,
    isLoginError: false,
    isLoginInProgress: false,
    isLoginModalOpen: false,
    isLoginSuccess: false,
    isLoginWarn: false,
    password: 'sa'
  },
  output: {
    isNodeUpdateProgress: false,
    isNodeRemoveProgress: false,
    nodes: []
  },
  runner: {
    buildInProgress: false,
    canProcessBeStopped: false,
    debugOutputEnabled: false,
    errorOutputEnabled: false,
    executionTime: '',
    finishedTimestamp: 0,
    isFailedOutputActive: false,
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
    successfulRun: false
  },
  settings: {
    key: '',
    systemVariables: [],
    value: '',
    variables: []
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