import request from '@/utils/request'
import { isEmpty } from '@/utils/index'

export function getRoleList() {
  return request({
    url: 'role/all',
    method: 'get'
  })
}

export function getRoleResList(roleId) {
  if (isEmpty(roleId)) {
    return []
  }
  return request({
    url: 'role/res/list?roleId=' + roleId,
    method: 'get'
  })
}

export function getRoleCountryList(roleId) {
  if (isEmpty(roleId)) {
    return []
  }
  return request({
    url: 'role/country/list?roleId=' + roleId,
    method: 'get'
  })
}

export function addRole(data) {
  return request({
    url: 'role/add',
    method: 'post',
    data
  })
}

export function syncRoleAuth(data) {
  return request({
    url: 'role/sync/res',
    method: 'post',
    data
  })
}

export function syncRoleCountry(data) {
  return request({
    url: 'role/sync/country',
    method: 'post',
    data
  })
}

export function removeRole(id) {
  return request({
    url: 'role/delete/' + id,
    method: 'delete'
  })
}

export function editRole(data) {
  return request({
    url: 'role/update',
    method: 'post',
    data
  })
}
