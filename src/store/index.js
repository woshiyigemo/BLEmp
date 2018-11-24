import Vue from 'vue';
import Vuex from 'vuex';
import state from './state';
import mutations from './mutations';
import * as getters from './getters';
import * as actions from './actions';
import createPersistedState from 'vuex-persistedstate'
// import createPersist from 'vuex-localstorage'


Vue.use(Vuex);
export default new Vuex.Store({ // eslint-disable-line
  plugins:[
    // createPersistedState()
    createPersistedState({
      paths: ['switchListLocal'],
      storage: {
        getItem: key => wx.getStorageSync(key),
        setItem: (key, value) => wx.setStorageSync(key,value),
        removeItem: key => wx.removeStorageSync(key) 
      },
    })
  ],
  state,
  mutations,
  actions,
  getters
});
