export default class SettingsService {

  apiBase = '/api';
  settingsUrl = '/settings';

  async getResource(url, request) {
    const resource = await fetch(`${this.apiBase}${url}`, request);
    const response = await resource.json();
    response.status = resource.status;
    return response;
  }

  getSettings = async () => {
    return this.getResource(this.settingsUrl);
  }
}