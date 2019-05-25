const name = 'Redmine';

const store = {
  namespaced: true,
  state: {
    task: null,
  },
  mutations: {
    changeTask: (state, task) => {
      state.task = task;
    },
  },
  actions: {
    changeTsk({ commit }) {
      commit('changeTask', {});
    },
  },
};

export default { name, store };
