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
}