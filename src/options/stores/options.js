/* eslint-disable import/no-extraneous-dependencies */
import Vue from 'vue';
import md5 from 'md5';
import axios from 'axios';
import api from '@/redmine/api';
import { remote } from 'electron';

const name = 'Options';

const LATEST_RELEASE_URL = 'https://api.github.com/repos/xavierboubert/redmine-me/releases/latest';
const VERSION = remote.app.getVersion();

const store = {
  namespaced: true,
  state: {
    redmineUrl: api.url,
    redmineUsername: api.username,
    redminePassword: api.password,
    defaultActivity: localStorage.getItem('default-activity') || null,
    maxHours: localStorage.getItem('max-hours') || null,
    email: localStorage.getItem('email') || null,
    avatar: localStorage.getItem('avatar') || null,
    version: VERSION,
    versionLatest: null,
    versionUpdateUrl: null,
  },
  mutations: {
    changeRedmine: (state, { url, username, password }) => {
      Vue.set(state, 'redmineUrl', url);
      Vue.set(state, 'redmineUsername', username);
      Vue.set(state, 'redminePassword', password);
    },
    changeDefaultActivity: (state, defaultActivity) => {
      localStorage.setItem('default-activity', defaultActivity);

      Vue.set(state, 'defaultActivity', defaultActivity);
    },
    changeMaxHours: (state, maxHours) => {
      localStorage.setItem('max-hours', maxHours);

      Vue.set(state, 'maxHours', maxHours);
    },
    changeEmail: (state, email) => {
      const avatar = email ? `https://www.gravatar.com/avatar/${md5(email)}?s=200` : '';

      localStorage.setItem('email', email);
      localStorage.setItem('avatar', avatar);

      Vue.set(state, 'email', email);
      Vue.set(state, 'avatar', avatar);
    },
    changeLatestVersion: (state, data) => {
      const versionLatest = data.name.replace('v', '');

      Vue.set(state, 'versionLatest', versionLatest);
      Vue.set(state, 'versionUpdateUrl', versionLatest !== state.version ? data.html_url : null);
    },
  },
  actions: {
    changeRedmine({ commit, dispatch }, { url, username, password }) {
      commit('changeRedmine', { url, username, password });

      dispatch('Redmine/changeApi', { url, username, password }, { root: true });
    },
    changeDefaultActivity({ commit }, defaultActivity) {
      commit('changeDefaultActivity', defaultActivity);
    },
    changeMaxHours({ commit }, maxHours) {
      commit('changeMaxHours', maxHours);
    },
    changeEmail({ commit }, email) {
      commit('changeEmail', email);
    },
    async checkUpdate({ commit }) {
      try {
        const { data } = await axios.get(LATEST_RELEASE_URL);

        commit('changeLatestVersion', data);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.err(err);
      }
    },
  },
};

export default { name, store };
