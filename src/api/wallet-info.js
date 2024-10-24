import request from '@/utils/request'

export function getMchWalletSum(data) {
  return request({
    url: '/merchant/wallet/sum',
    method: 'post',
    data
  })
}

export function getChWalletSum(data) {
  return request({
    url: '/channel/wallet/sum',
    method: 'post',
    data
  })
}

export function getAgtWalletSum(data) {
  return request({
    url: '/agent/wallet/sum',
    method: 'post',
    data
  })
}

export function getVenWalletSum(data) {
  return request({
    url: '/vendor/wallet/sum',
    method: 'post',
    data
  })
}

export function getSysWallet() {
  return request({
    url: '/sys/wallet/info',
    method: 'get'
  })
}
