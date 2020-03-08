export default class BaseService {
  activateUrl = '/activate';
  apiBase = '/api';
  authBase = '/auth';
  node = '/node';
  nodeRemove = '/node/remove';
  registerUrl = '/register';
  removeSystemVarUrl = '/var/system/remove';
  removeVarUrl = '/var/remove';
  resetCodeUrl = '/code/reset';
  resetPasswordUrl = '/password/reset';
  saveSystemVariableUrl = '/var/system/create';
  saveVariableUrl = '/var/create';
  settingsUrl = '/settings';
  springLogin = '/login';
  updateSystemVariableUrl = '/var/system/update';
  updateVariableUrl = '/var/update';

  async getResource(url, request) {
    const resource = await fetch(url, request);
    const response = await resource.json();
    response.status = resource.status;
    return response;
  }

  async getMapResource(url, request) {
    const resource = await fetch(url, request);
    const response = await resource.json();
    return { data: response, code: resource.status };
  }
}