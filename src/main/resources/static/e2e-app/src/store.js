import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { createStore, applyMiddleware } from "redux";
import rootReducer from "./reducers/rootReducer";
import { VariableTypes } from "./constants/application";

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
    debugOutputEnabled: false,
    errorOutputEnabled: false,
    executionTime: '',
    isFailedOutputActive: false,
    isPassedOutputActive: false,
    isSkippedOutputActive: false,
    serverErrorState: false
  },
  settings: {
    key: '',
    system: false,
    systemKey: '',
    systemType: 'text',
    systemValue: '',
    systemVariables: [],
    type: 'text',
    types: [
      VariableTypes.TEXT,
      VariableTypes.EMAIL,
      VariableTypes.PASSWORD
    ],
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