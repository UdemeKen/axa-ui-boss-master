import { isEmpty } from '@/utils/index'
import request from '@/utils/request'

// 获取所有的菜单树
export function getResPage() {
  return request({
    url: 'res/page',
    method: 'post'
  })
}

export function getResOptions(resType) {
  if (isEmpty(resType)) {
    resType = ''
  }
  return request({
    url: '/res/options?resType=' + resType,
    method: 'get'
  })
}

export function addRes(data) {
  return request({
    url: 'res/add',
    method: 'post',
    data
  })
}

export function removeRes(id) {
  return request({
    url: 'res/delete/' + id,
    method: 'delete'
  })
}

export function editRes(data) {
  return request({
    url: 'res/update',
    method: 'post',
    data
  })
}
