export default class ValidationService {
  isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  }
}