export default class BaseService {
  activateUrl = '/activate';
  apiBase = '/api';
  authBase = '/auth';
  registerUrl = '/register';
  resetCodeUrl = '/code/reset';
  resetPasswordUrl = '/password/reset';
  saveVariableUrl = '/variable/save';
  settingsUrl = '/settings';
  springLogin = '/login';

  async getResource(url, request) {
    const resource = await fetch(url, request);
    const response = await resource.json();
    response.status = resource.status;
    return response;
  }
}