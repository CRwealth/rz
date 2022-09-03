import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import createPersistedState from 'vuex-persistedstate'
import permission from './modules/permission'
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user,
    permission
  },
  getters,
  plugins: [createPersistedState({
    reducer(state) { // 这里的state 是 vuex 里面的 state，注意层级要一样
      return { // state
        user: {
          hrsaasTime: state.user.hrsaasTime
        }
      }
    }
  })]
})

export default store
