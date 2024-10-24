import request from '@/utils/request'
import { isEmpty } from '@/utils/index'

export function getUserOptions(disabled) {
  if (isEmpty(disabled)) {
    disabled = ''
  }
  return request({
    url: '/user/options?disabled=' + disabled,
    method: 'get'
  })
}

export function addUser(data) {
  return request({
    url: 'user/add',
    method: 'post',
    data
  })
}

export function removeUser(id) {
  return request({
    url: 'user/delete/' + id,
    method: 'delete'
  })
}

export function editUser(data) {
  return request({
    url: 'user/update',
    method: 'post',
    data
  })
}

export function disabled(data) {
  return request({
    url: '/user/disabled',
    method: 'post',
    data
  })
}

export function unlock(id) {
  return request({
    url: 'user/unlock/account?id=' + id,
    method: 'post'
  })
}

export function offline(id) {
  return request({
    url: 'user/offline/account?id=' + id,
    method: 'post'
  })
}

export function changePwd(data) {
  return request({
    url: 'user/pwd',
    method: 'post',
    data
  })
}

export function changeOtherPwd(userId, newPwd) {
  return request({
    url: 'user/change/pwd?userId=' + userId + '&newPwd=' + newPwd,
    method: 'post'
  })
}

export function updateEmail(code, data) {
  return request({
    url: 'user/updateEmail/' + code,
    method: 'post',
    data
  })
}

export function updateMyContact(email, phone, pwd) {
  return request({
    url: 'user/update/contact?email=' + email + '&phone=' + phone + '&pwd=' + pwd,
    method: 'post'
  })
}

export function getLastLogin() {
  return request({
    url: 'log/last/login',
    method: 'get'
  })
}
