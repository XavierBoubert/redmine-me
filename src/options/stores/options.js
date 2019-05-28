/* eslint-disable import/no-extraneous-dependencies */
import Vue from 'vue';
import api from '@/redmine/api';

const name = 'Options';

const store = {
  namespaced: true,
  state: {
    redmineUrl: api.url,
    redmineUsername: api.username,
    redminePassword: api.password,
    defaultActivity: localStorage.get('default-activity') || null,
    maxHours: localStorage.get('max-hours') || null,
    email: localStorage.get('email') || null,
  },
  mutations: {
    changeRedmine: (state, { url, username, password }) => {
      Vue.set(state, 'redmineUrl', url);
      Vue.set(state, 'redmineUsername', username);
      Vue.set(state, 'redminePassword', password);
    },
    changeDefaultActivity: (state, defaultActivity) => {
      localStorage.set('default-activity', defaultActivity);

      Vue.set(state, 'defaultActivity', defaultActivity);
    },
    changeMaxHours: (state, maxHours) => {
      localStorage.set('max-hours', maxHours);

      Vue.set(state, 'maxHours', maxHours);
    },
    changeEmail: (state, email) => {
      localStorage.set('email', email);

      Vue.set(state, 'email', email);
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
  },
};

export default { name, store };
