import request from '@/utils/request'
import { isEmpty } from '@/utils/index'

export function addMch(data) {
  return request({
    url: '/merchant/add',
    method: 'post',
    data
  })
}

export function editMch(data) {
  return request({
    url: 'merchant/update',
    method: 'post',
    data
  })
}

export function getMchInfo(data) {
  return request({
    url: '/merchant/info',
    method: 'post',
    data
  })
}

export function disMch(data) {
  return request({
    url: '/merchant/disabled',
    method: 'post',
    data
  })
}

export function unlockMch(data) {
  return request({
    url: '/merchant/unlock',
    method: 'post',
    data
  })
}

export function getMchOptions(auditStatus, disabled, countryCode) {
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
    url: '/merchant/options?auditStatus=' + auditStatus + '&disabled=' + disabled + '&countryCode=' + countryCode,
    method: 'get'
  })
}

export function resetMchLoginPsw(data) {
  return request({
    url: '/merchant/pwd/login',
    method: 'post',
    data
  })
}

export function resetMchDrawPsw(data) {
  return request({
    url: '/merchant/pwd/draw',
    method: 'post',
    data
  })
}

export function resetMchAppId(data) {
  return request({
    url: '/merchant/reset/appid',
    method: 'post',
    data
  })
}

export function resetMchAppSecret(data) {
  return request({
    url: '/merchant/reset/appSecret',
    method: 'post',
    data
  })
}

export function resetMchDGC(data) {
  return request({
    url: '/merchant/reset/draw/gc',
    method: 'post',
    data
  })
}

export function getWalletStats(data) {
  return request({
    url: '/merchant/wallet/stats',
    method: 'post',
    data
  })
}

export function plusAmount(data) {
  return request({
    url: '/merchant/wallet/plus',
    method: 'post',
    data
  })
}

export function minusAmount(data) {
  return request({
    url: '/merchant/wallet/minus',
    method: 'post',
    data
  })
}

export function editGooleCode(data){
  return request({
    url:'/merchant/reset/draw/switch',
    method:'post',
    data
  })
}
