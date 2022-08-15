import { login } from '@/api/user'
export default {
  namespaced: true,
  state: {
    token: null
  },
  mutations: {
    setToken(state, token) {
      state.token = token
    }
  },
  actions: {
    // 通过接口获取token
    // commit setToken
    async login({ commit }, data) {
      const res = await login(data)
      console.log(res)
      commit('setToken', res.data.data)
    }
  }
}
