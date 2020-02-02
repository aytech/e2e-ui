import BaseService from "./BaseService";

export default class AuthenticationService extends BaseService {

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
    const url = `${this.authBase}${this.registerUrl}`;
    return this.getResource(url, request);
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
    const url = `${this.authBase}${this.activateUrl}`;
    return this.getResource(url, request);
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
    const url = `${this.authBase}${this.resetCodeUrl}`;
    return this.getResource(url, request);
  };

  resetPassword = async (password, activationCode) => {
    const request = {
      body: JSON.stringify({ password, activationCode }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      mode: 'cors'
    };
    const url = `${this.authBase}${this.resetPasswordUrl}`;
    return this.getResource(url, request);
  }
}