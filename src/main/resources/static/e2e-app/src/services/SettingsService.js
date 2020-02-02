import BaseService from "./BaseService";

export default class SettingsService extends BaseService {

  getSettings = async () => {
    return this.getResource(`${this.apiBase}${this.settingsUrl}`);
  };

  saveVariable = async (name, value) => {
    const request = {
      body: JSON.stringify({ name, value }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      mode: 'cors'
    };
    const url = `${this.apiBase}${this.saveVariableUrl}`;
    return this.getResource(url, request);
  };
}