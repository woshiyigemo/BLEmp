import Vue from 'vue';
import Vuex from 'vuex';
import state from './state';
import mutations from './mutations';
import * as getters from './getters';
import * as actions from './actions';
import createPersist from 'vuex-localstorage'

Vue.use(Vuex);
export default new Vuex.Store({ // eslint-disable-line
  plugins: [createPersist({
    namespace: 'lolar',
    initialState: {},
    expires: 365 * 24 * 60 * 60 * 1e3
  })],
  state,
  mutations,
  actions,
  getters
});
