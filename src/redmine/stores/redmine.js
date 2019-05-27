/* eslint-disable import/no-extraneous-dependencies */
import Vue from 'vue';
import api from '../api';

const name = 'Redmine';

const dateTime = date => (date || new Date()).getTime();
const dateString = date => (date || new Date()).toJSON().split('T')[0];

const issuesDataFormat = (issues = {}) => ({ date: dateString(), issues });

const issueFormat = (id, text, time) => ({ id, text, time });

const activeIssueFormat = (id = null, text = null, error = null) => ({
  date: dateString(),
  id,
  text,
  error,
  start: dateTime(),
});

const loadIssuesData = () => {
  let issuesData = localStorage.getItem('issues');
  issuesData = (issuesData && JSON.parse(issuesData)) || issuesDataFormat();
  return issuesData.date === dateString() ? issuesData : issuesDataFormat();
};

const saveIssuesData = issuesData => localStorage
  .setItem('issues', JSON.stringify(issuesData || {}));

const loadActiveIssue = () => {
  let activeIssue = localStorage.getItem('activeIssue');
  activeIssue = (activeIssue && JSON.parse(activeIssue)) || activeIssueFormat();
  return activeIssue.date === dateString() ? activeIssue : activeIssueFormat();
};

const saveActiveIssue = issue => localStorage.setItem(
  'activeIssue',
  issue && issue.id && !issue.error ? JSON.stringify({ ...issue, date: dateString() }) : '',
);

const cleanIssuesData = issuesData => (issuesData && issuesData.date === dateString()
  ? issuesData
  : issuesDataFormat());

const stackActiveIssue = (issuesData, issue) => {
  if (!issue || !issue.id || issue.error) {
    return issuesData;
  }

  const newData = { ...cleanIssuesData(issuesData) };
  const time = ((newData.issues[issue.id] && newData.issues[issue.id].time) || 0)
    + (dateTime() - issue.start);

  newData.issues[issue.id] = issueFormat(issue.id, issue.text, time);

  localStorage.setItem('issues', JSON.stringify(newData));

  return newData;
};

const store = {
  namespaced: true,
  state: {
    issuesData: loadIssuesData(),
    activeIssue: loadActiveIssue(),
  },
  getters: {
    issues: state => state.issuesData.issues,
  },
  mutations: {
    changeActiveIssue: (state, issue) => {
      if (
        state.activeIssue.id
        && !state.activeIssue.error
        && issue.id
        && state.activeIssue.id !== issue.id
      ) {
        Vue.set(state, 'issuesData', stackActiveIssue(state.issuesData, state.activeIssue));
      }

      saveActiveIssue(issue);

      Vue.set(state, 'activeIssue', activeIssueFormat(issue.id, issue.text, issue.error));
    },
    clear: (state) => {
      Vue.set(state, 'issuesData', issuesDataFormat());
      Vue.set(state, 'activeIssue', activeIssueFormat());

      saveIssuesData(state.issuesData);
      saveActiveIssue(state.activeIssue);
    },
  },
  actions: {
    async pullActiveIssue({ commit }, id) {
      const issue = { id, error: null, text: '' };

      // eslint-disable-next-line eqeqeq
      if (id && Number(parseInt(id, 10)) == id) {
        try {
          const { data } = await api.get(`issues/${id}.json`);
          issue.text = data.issue.subject;
        } catch (err) {
          issue.error = err.toString();
        }
      } else if (id) {
        issue.error = 'Not a number';
      }

      commit('changeActiveIssue', issue);
    },
    clear({ commit }) {
      commit('clear');
    },
  },
};

export default { name, store };
