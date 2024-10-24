import request from '@/utils/request'

export function getByOrderNo(data) {
  return request({
    url: 'order/trade/info',
    method: 'post',
    data
  })
}

export function copyOrder(data) {
  return request({
    url: 'order/trade/copy',
    method: 'post',
    data
  })
}

export function getOrderStats(data) {
  return request({
    url: 'order/trade/stats',
    method: 'post',
    data
  })
}

export function getOrderAllStats(data) {
  return request({
    url: 'order/trade/all/stats',
    method: 'post',
    data
  })
}

export function getOrderSucSum(data) {
  return request({
    url: 'order/trade/stats',
    method: 'post',
    data
  })
}

export function notifyMch(data) {
  return request({
    url: 'order/trade/notify',
    method: 'post',
    data
  })
}

export function mockNotifyPay(data) {
  return request({
    url: 'order/trade/notify/mock',
    method: 'post',
    data
  })
}

export function settleOrder(data) {
  return request({
    url: 'order/trade/settle',
    method: 'post',
    data
  })
}

export function checkOrder(data) {
  return request({
    url: 'order/trade/check',
    method: 'post',
    data
  })
}

export function auditOrder(data) {
  return request({
    url: 'order/trade/audit',
    method: 'post',
    data
  })
}
