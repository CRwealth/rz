import request from '@/utils/request'

/**
 * 获取角色列表
 * ***/
export function getRoleList(params) {
  return request({
    url: '/sys/role',
    params // page 页码  pagesize 每页条数
  })
}
