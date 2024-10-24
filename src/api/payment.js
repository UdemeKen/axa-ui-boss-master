import request from '@/utils/request'
import { isEmpty } from '@/utils/index'
/* -----------------银行-------------- */
export function getBankOptions(countryCode, disabled) {
  if (isEmpty(countryCode)) {
    countryCode = ''
  }
  if (isEmpty(disabled)) {
    disabled = ''
  }
  return request({
    url: '/payment/bank/options?countryCode=' + countryCode + '&disabled=' + disabled,
    method: 'get'
  })
}

export function addBank(data) {
  return request({
    url: '/payment/bank/add',
    method: 'post',
    data
  })
}

export function editBank(data) {
  return request({
    url: 'payment/bank/update',
    method: 'post',
    data
  })
}

export function disBank(data) {
  return request({
    url: '/payment/bank/disabled',
    method: 'post',
    data
  })
}
/* -----------------通道-------------- */
export function getPcOptions(data) {
  if (isEmpty(data)) {
    data = {}
  }
  return request({
    url: '/payment/channel/options',
    method: 'post',
    data
  })
}

export function getPcInfo(data) {
  return request({
    url: '/payment/channel/info',
    method: 'post',
    data
  })
}

export function disPc(data) {
  return request({
    url: '/payment/channel/disabled',
    method: 'post',
    data
  })
}

export function addPc(data) {
  return request({
    url: '/payment/channel/add',
    method: 'post',
    data
  })
}

export function editPc(data) {
  return request({
    url: '/payment/channel/update',
    method: 'post',
    data
  })
}

export function getWalletStats(data) {
  return request({
    url: '/payment/channel/wallet/stats',
    method: 'post',
    data
  })
}
/* -----------------通道支付方式-------------- */
export function disPcm(data) {
  return request({
    url: '/payment/channel/method/disabled',
    method: 'post',
    data
  })
}

export function addPcm(data) {
  return request({
    url: '/payment/channel/method/add',
    method: 'post',
    data
  })
}

export function editPcm(data) {
  return request({
    url: 'payment/channel/method/update',
    method: 'post',
    data
  })
}

/* -----------------支付方式-------------- */
export function getPmOptions(data) {
  if (isEmpty(data)) {
    data = {}
  }
  return request({
    url: '/payment/method/options',
    method: 'post',
    data
  })
}

export function addPm(data) {
  return request({
    url: '/payment/method/add',
    method: 'post',
    data
  })
}

export function editPm(data) {
  return request({
    url: 'payment/method/update',
    method: 'post',
    data
  })
}
export function disPm(data) {
  return request({
    url: '/payment/method/disabled',
    method: 'post',
    data
  })
}
