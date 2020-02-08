import { UPDATE_SYSTEM_VARIABLES, UPDATE_VARIABLES } from "./constants";

export const updateVariables = (variables) => ({ type: UPDATE_VARIABLES, variables });
export const updateSystemVariables = (variables) => ({ type: UPDATE_SYSTEM_VARIABLES, variables });