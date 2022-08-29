import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/sys/login',
    method: 'POST',
    data
  })
}

export function getUserInfo() {
  return request({
    url: '/sys/profile',
    method: 'POST'
  })
}

/** *
 *
 * 获取用户的基本信息  现在写它 完全是为了显示头像
 * **/
//  getUserDetailById 可以获取额外的用户信息
// 用户的头像
export function getUserDetailById(id) {
  return request({
    url: `/sys/user/${id}`
  })
}
