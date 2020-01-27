export default class SettingsService {
  getSettings = async () => {
    return await fetch('/api/settings')
  }
}