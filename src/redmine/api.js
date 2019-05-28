/* eslint-disable import/no-extraneous-dependencies */
import axios from 'axios';

const loadOptions = () => JSON.parse(localStorage.getItem('redmine') || '{}');
const saveOptions = options => localStorage.setItem('redmine', JSON.stringify(options || {}));

class API {
  constructor() {
    const redmine = loadOptions();

    this.changeAccess(redmine.url, redmine.username, redmine.password);
  }

  createInstance() {
    this.redmine = axios.create({
      baseURL: this.url,
      auth: {
        username: this.username,
        password: this.password,
      },
    });
  }

  changeAccess(url, username, password) {
    saveOptions({ url, username, password });

    this.url = url;
    this.username = username;
    this.password = password;

    this.createInstance();
  }

  async test() {
    if (!this.url) {
      return false;
    }

    try {
      const { data } = await this.redmine.get('news.json');

      if (!data.news) {
        return false;
      }
    } catch (err) {
      return false;
    }

    return true;
  }
}

const api = new API();

export default api;
