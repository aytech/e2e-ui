export default class AuthenticationService {

  apiBase = '/auth';
  springLogin = '/login';
  registerUrl = '/register';
  activateUrl = '/activate';
  resetCodeUrl = '/code/reset';
  resetPasswordUrl = '/password/reset';

  async getResource(url, request) {
    const resource = await fetch(`${ this.apiBase }${ url }`, request);
    const response = await resource.json();
    response.status = resource.status;
    return response;
  }

  login = async (username, password) => {
    const data = new URLSearchParams();
    data.append("username", username);
    data.append("password", password);
    const request = {
      body: data,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      method: 'POST',
      mode: 'cors'
    };
    return fetch(this.springLogin, request);
  };

  register = async (email, password) => {
    const request = {
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      mode: 'cors'
    };
    return this.getResource(this.registerUrl, request);
  };

  activate = async (code) => {
    const request = {
      body: JSON.stringify({
        "activationCode": code
      }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      mode: 'cors'
    };
    return this.getResource(this.activateUrl, request);
  };

  resetCode = async (email) => {
    const request = {
      body: JSON.stringify({
        "email": email
      }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      mode: 'cors'
    };
    return this.getResource(this.resetCodeUrl, request);
  };

  resetPassword = async (email, password, activationCode) => {
    const request = {
      body: JSON.stringify({ email, password, activationCode }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      mode: 'cors'
    };
    return this.getResource(this.resetPasswordUrl, request);
  }
}