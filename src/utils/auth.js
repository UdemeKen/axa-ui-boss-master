import Storages from 'js-storage'
import store from '@/store'

const TokenKey = 's-token'

export function getToken() {
  return Storages.localStorage.get(TokenKey)
}

export function setToken(token) {
  return Storages.localStorage.set(TokenKey, token)
}

export function removeToken() {
  Storages.sessionStorage.remove('permissions')
  return Storages.localStorage.remove(TokenKey)
}

export function isAuth(key) {
  if (store.getters.roles.indexOf('admin') >= 0) { return true }
  return (Storages.sessionStorage.get('permissions') || '[]').indexOf(key) !== -1 || false
}

export function setAuthCode(permissions) {
  return Storages.sessionStorage.set('permissions', (permissions || '[]'))
}
