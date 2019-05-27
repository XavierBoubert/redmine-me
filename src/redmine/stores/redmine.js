/* eslint-disable import/no-extraneous-dependencies */
import Vue from 'vue';
import api from '../api';

const name = 'Redmine';

// eslint-disable-next-line eqeqeq
const isNumber = number => number === 0 || Number(parseInt(number, 10)) == number || false;
const dateTime = date => (date || new Date()).getTime();
const dateString = date => (date || new Date()).toJSON().split('T')[0];

// eslint-disable-next-line eqeqeq
const isTimeLogValid = timeLog => parseInt(timeLog, 10) == timeLog
  && parseInt(timeLog, 10) > -1
  && parseInt(timeLog, 10) < 9;

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
const cleanIssuesData = issuesData => (issuesData && issuesData.date === dateString()
  ? issuesData
  : issuesDataFormat());

const loadActiveIssue = () => {
  let activeIssue = localStorage.getItem('activeIssue');
  activeIssue = (activeIssue && JSON.parse(activeIssue)) || activeIssueFormat();
  return activeIssue.date === dateString() ? activeIssue : activeIssueFormat();
};
const saveActiveIssue = issue => localStorage.setItem(
  'activeIssue',
  issue && issue.id && !issue.error ? JSON.stringify({ ...issue, date: dateString() }) : '',
);

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

const pushIssuesActivity = async (issues) => {
  if (!issues.length) {
    return;
  }

  const issue = issues.pop();

  console.log({
    'time_entry[issue_id]': issue.id,
    'time_entry[hours]': issue.timeLog,
    'time_entry[activity_id]': issue.activity,
  });

  const formData = new FormData();
  formData.set('time_entry[issue_id]', issue.id);
  formData.set('time_entry[hours]', issue.timeLog);
  formData.set('time_entry[activity_id]', issue.activity);

  try {
    await api.post('time_entries.json', formData, {
      config: { headers: { 'Content-Type': 'multipart/form-data' } },
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }

  await pushIssuesActivity(issues);
};

const store = {
  namespaced: true,
  state: {
    status: 'idle',
    issuesData: loadIssuesData(),
    activeIssue: loadActiveIssue(),
    activities: [],
  },
  getters: {
    issuesTimeLogTotal: state => (state.issuesData.issues.length
      ? Object
        .keys(state.issuesData.issues)
        .map(id => parseInt((state.issuesData.issues[id]
          && isTimeLogValid(state.issuesData.issues[id].timeLog)
          && state.issuesData.issues[id].timeLog)
          || 0, 10))
        .reduce((accumulator, currentValue) => accumulator + currentValue)
      : 0),
  },
  mutations: {
    changeStatus: (state, value) => {
      Vue.set(state, 'status', value);
    },
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
    changeActivities: (state, activities) => {
      Vue.set(state, 'activities', activities);
    },
    changeIssueActivity: (state, { issueId, activityId }) => {
      const issue = state.issuesData.issues[issueId];

      if (!issue) {
        return;
      }

      issue.activity = activityId;

      Vue.set(state.issuesData.issues, issueId, issue);

      saveIssuesData(state.issuesData);
    },
    changeIssueTimeLog: (state, { issueId, timeLog }) => {
      const issue = state.issuesData.issues[issueId];

      if (!issue) {
        return;
      }

      issue.timeLog = timeLog;
      issue.error = timeLog !== '' && !isTimeLogValid(timeLog);

      Vue.set(state.issuesData.issues, issueId, issue);

      saveIssuesData(state.issuesData);
    },
    clearTimeLogs: (state) => {
      const { issues } = state.issuesData;

      Object
        .keys(issues)
        .forEach((id) => {
          issues[id].timeLog = '';
        });

      Vue.set(state.issuesData, 'issues', issues);
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

      if (id && isNumber(id)) {
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
    async pullActivities({ commit }) {
      let activities = [];

      try {
        const { data } = await api.get('/enumerations/time_entry_activities.json');
        activities = data.time_entry_activities;
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
      }

      commit('changeActivities', activities);
    },
    changeIssueActivity({ commit }, { issueId, activityId }) {
      commit('changeIssueActivity', { issueId, activityId });
    },
    changeIssueTimeLog({ commit }, { issueId, timeLog }) {
      commit('changeIssueTimeLog', { issueId, timeLog });
    },
    async pushIssuesActivities({ state, commit }) {
      commit('changeStatus', 'pushing');

      const issues = Object
        .keys(state.issuesData.issues)
        .map(id => state.issuesData.issues[id])
        .filter(issue => issue.id && isTimeLogValid(issue.timeLog) && issue.activity);

      await pushIssuesActivity(issues);

      commit('clearTimeLogs');

      commit('changeStatus', 'pushed');

      setTimeout(() => {
        commit('changeStatus', 'idle');
      }, 3000);
    },
    clear({ commit }) {
      commit('clear');
    },
  },
};

export default { name, store };
