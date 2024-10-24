import request from '@/utils/request'

export function login(data) {
  return request({
    url: 'auth/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: 'auth/logout',
    method: 'post'
  })
}

export function getCurrent() {
  return request({
    url: 'auth/current',
    method: 'get'
  })
}

export function getCurrentUser() {
  return request({
    url: 'auth/current/info',
    method: 'get'
  })
}

export function getCaptcha(uuid) {
  return request({
    url: 'auth/captcha?uuid=' + uuid,
    method: 'get'
  })
}

export function getAuthCode() {
  return request({
    url: 'auth/code',
    method: 'get'
  })
}

export function getTreeMenu() {
  return request({
    url: 'res/menu?resType=0',
    method: 'get'
  })
}
