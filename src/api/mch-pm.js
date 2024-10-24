import request from '@/utils/request'

export function addMpm(data) {
  return request({
    url: '/merchant/payment/add',
    method: 'post',
    data
  })
}

export function editMpm(data) {
  return request({
    url: '/merchant/payment/update',
    method: 'post',
    data
  })
}

export function disMpm(data) {
  return request({
    url: '/merchant/payment/disabled',
    method: 'post',
    data
  })
}

export function getMpmList(data) {
  return request({
    url: '/merchant/payment/list',
    method: 'post',
    data
  })
}

export function removeMpm(data) {
  return request({
    url: '/merchant/payment/delete',
    method: 'delete',
    data
  })
}

export function addMv(data) {
  return request({
    url: '/merchant/ven/add',
    method: 'post',
    data
  })
}

export function removeMv(data) {
  return request({
    url: '/merchant/ven/delete',
    method: 'post',
    data
  })
}

