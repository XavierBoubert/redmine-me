/* eslint-disable import/no-extraneous-dependencies */
import Vue from 'vue';
import api from '../api';

const name = 'Redmine';

const store = {
  namespaced: true,
  state: {
    activeIssue: {
      id: null,
      text: null,
      error: null,
    },
  },
  mutations: {
    changeActiveIssue: (state, issue) => {
      Vue.set(state, 'activeIssue', issue);
    },
  },
  actions: {
    async pullActiveIssue({ commit }, issueId) {
      const issue = { id: issueId, error: null, text: '' };

      // eslint-disable-next-line eqeqeq
      if (issueId && Number(parseInt(issueId, 10)) == issueId) {
        try {
          const { data } = await api.get(`issues/${issueId}.json`);
          issue.text = data.issue.subject;
        } catch (err) {
          issue.error = err.toString();
        }
      }

      commit('changeActiveIssue', issue);
    },
  },
};

export default { name, store };
