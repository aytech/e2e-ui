export default class AuthenticationService {

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
    return await fetch('/login', request);
  };

  register = async (email, password) => {
    const request = {
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      mode: 'cors'
    };
    const resource = await fetch('/auth/register', request);
    const response = await resource.json();
    response.status = resource.status;
    return response;
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
    const resource = await fetch('/auth/activate', request);
    const response = await resource.json();
    response.status = resource.status;
    return response;
  };
}