import { createStore } from 'vuex';


const store = createStore({
  state() {
    return {
      isLoggedIn: localStorage.getItem('userToken') ? true : false,
      user: localStorage.getItem('user') || null,
    };
  },
  mutations: {
        SET_LOGIN_STATE(state, isLoggedIn) {
          state.isLoggedIn = isLoggedIn;
        },
        SET_USER(state, user) {
          state.user = user;
        },
      },

  actions: {
    loginUser({ commit }, { user, token }) {
      commit('SET_LOGIN_STATE', true);
      commit('SET_USER', user);
      localStorage.setItem('userToken', token); 
      localStorage.setItem('user', JSON.stringify(user)); 
    },
    logoutUser({ commit }) {
      commit('SET_LOGIN_STATE', false);
      commit('SET_USER', null);
      localStorage.removeItem('userToken'); 
      localStorage.removeItem('user'); 
    },
  },
  getters: {
    isLoggedIn: (state) => state.isLoggedIn,
    loggedInUser: (state) => state.user,
  },
});


export default store;