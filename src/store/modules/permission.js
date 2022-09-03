
// 根据 当前 用户返回的菜单 匹配 当前用户的菜单
// 当前用户的菜单==》 静态路由 + 动态路由

import router, {asyncRoutes,constantRoutes} from '@/router'
const state = {
  routes:constantRoutes
}
const mutations = {
  setRouter(state,matchRoutes){
     // 下面这么写不对 不是语法不对 是业务不对
    // state.routes = [...state.routes, ...matchRoutes]
    // 有一种情况  张三 登录 获取了动态路由 追加到路由上  李四登录 4个动态路由
    // 应该是每次更新 都应该在静态路由的基础上进行追加
    state.routes = [...constantRoutes,...matchRoutes]
  }
}
const actions = {
  // 假设 menus 已经到了
  // 根据 menus 和所有 asyncRoutes ==》进行匹配 真正属于这个用户的菜单
  // menus ==> 权限里什么值 code值
  filterRoutes(context,menus){
    const routes = asyncRoutes.filter(ele=>menus.includes(ele.meta.id))
    context.commit('setRouter',routes)
    // 动态添加这些过滤出来的路由
    router.addRoutes([...routes, { path: '*', redirect: '/404', hidden: true }])
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}