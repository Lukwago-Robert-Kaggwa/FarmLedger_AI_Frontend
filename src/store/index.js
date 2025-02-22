import { createStore } from "vuex";

export default createStore({
  state: {
    user: JSON.parse(localStorage.getItem('user')) || null,
  },
  getters: {
    getUser: (state) => state.user,
    isLoggedIn: (state) => !!state.user,
  },
  mutations: {
    SET_USER(state, user) {
      localStorage.setItem("user", JSON.stringify(user)); 
      state.user = user;
    },
    LOGOUT(state) {
      state.user = null;
      localStorage.removeItem('user');
    },
  },
  actions: {
     restoreSession({ commit }) {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        commit('SET_USER', user);
      }
    },
  },
  modules: {},
});
