import BaseService from "./BaseService";

export default class SettingsService extends BaseService {

  getSettings = async () => {
    return this.getResource(`${this.apiBase}${this.settingsUrl}`);
  };

  createVariable = async (key, value) => {
    const request = {
      body: JSON.stringify({ key, value }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      mode: 'cors'
    };
    const url = `${this.apiBase}${this.saveVariableUrl}`;
    return this.getResource(url, request);
  };

  removeVariable = async (id) => {
    const request = {
      body: JSON.stringify({ id }),
      headers: { 'Content-Type': 'application/json' },
      method: 'DELETE',
      mode: 'cors'
    };
    const url = `${this.apiBase}${this.removeVarUrl}`;
    return this.getResource(url, request);
  };
}