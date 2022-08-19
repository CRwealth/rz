import { login, getUserInfo } from '@/api/user'
import { setToken, getToken, removeToken } from '@/utils//auth'
export default {
  namespaced: true,
  state: {
    token: getToken(),
    userInfo: {} // 如果设置为null下面也要设置null而且还要在get里面做非空判断
  },
  mutations: {
    setToken(state, token) {
      state.token = token
      setToken(token)
    },
    removeToken(state) {
      state.token = null
      removeToken()
    },
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo
    },
    removeUserInfo(state) {
      state.userInfo = {}
    }
  },
  actions: {
    // 通过接口获取token
    // commit setToken
    async login({ commit }, data) {
      const res = await login(data)
      // console.log(res)
      commit('setToken', res)
    },
    // 通过接口获取用户信息
    // token 到底 验证
    async getUserInfo({ commit }) {
      const res = await getUserInfo()
      // 直接log不出来，要去首页调用一下
      // console.log(res)
      commit('setUserInfo', res)
    }
  }
}
