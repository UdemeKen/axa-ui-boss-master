import request from '@/utils/request'
import { isEmpty } from '@/utils/index'

export function addVen(data) {
  return request({
    url: '/vendor/add',
    method: 'post',
    data
  })
}

export function editVen(data) {
  return request({
    url: 'vendor/update',
    method: 'post',
    data
  })
}

export function getVenInfo(data) {
  return request({
    url: '/vendor/info',
    method: 'post',
    data
  })
}

export function disVen(data) {
  return request({
    url: '/vendor/disabled',
    method: 'post',
    data
  })
}

export function getVenOptions(auditStatus, disabled, countryCode) {
  if (isEmpty(auditStatus)) {
    auditStatus = ''
  }
  if (isEmpty(disabled)) {
    disabled = ''
  }
  if (isEmpty(countryCode)) {
    countryCode = ''
  }
  return request({
    url: '/vendor/options?auditStatus=' + auditStatus + '&disabled=' + disabled + '&countryCode=' + countryCode,
    method: 'get'
  })
}

export function resetVenLoginPsw(data) {
  return request({
    url: '/vendor/pwd/login',
    method: 'post',
    data
  })
}

export function resetVenDrawPsw(data) {
  return request({
    url: '/vendor/pwd/draw',
    method: 'post',
    data
  })
}

export function unlockVen(data) {
  return request({
    url: '/vendor/unlock',
    method: 'post',
    data
  })
}

export function removeInvite(data) {
  return request({
    url: '/vendor/invite/delete',
    method: 'post',
    data
  })
}

export function removeRelation(data) {
  return request({
    url: '/vendor/relation/delete',
    method: 'post',
    data
  })
}

export function disVenInvite(data) {
  return request({
    url: '/vendor/invite/disabled',
    method: 'post',
    data
  })
}

export function getWalletStats(data) {
  return request({
    url: '/vendor/wallet/stats',
    method: 'post',
    data
  })
}

export function plusAmount(data) {
  return request({
    url: '/vendor/wallet/plus',
    method: 'post',
    data
  })
}

export function minusAmount(data) {
  return request({
    url: '/vendor/wallet/minus',
    method: 'post',
    data
  })
}
