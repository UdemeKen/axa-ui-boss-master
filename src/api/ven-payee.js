import request from '@/utils/request'

export function getVenPayee(data) {
  return request({
    url: '/vendor/payee/info',
    method: 'post',
    data
  })
}

export function addVenPayee(data) {
  return request({
    url: '/vendor/payee/add',
    method: 'post',
    data
  })
}

export function editVenPayee(data) {
  return request({
    url: 'vendor/payee/update',
    method: 'post',
    data
  })
}

export function disVenPayee(data) {
  return request({
    url: '/vendor/payee/disabled',
    method: 'post',
    data
  })
}

export function getDevice() {
  return request({
    url: '/vendor/payee/device',
    method: 'post'
  })
}
