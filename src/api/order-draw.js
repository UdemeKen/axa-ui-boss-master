import request from '@/utils/request'

export function getByDrawNo(data) {
  return request({
    url: '/order/draw/info',
    method: 'post',
    data
  })
}

export function getDrawStats(data) {
  return request({
    url: 'order/draw/stats',
    method: 'post',
    data
  })
}

export function getDrawAllStats(data) {
  return request({
    url: 'order/draw/all/stats',
    method: 'post',
    data
  })
}

export function checkDraw(data) {
  return request({
    url: '/order/draw/check',
    method: 'post',
    data
  })
}

export function notifyMch(data) {
  return request({
    url: '/order/draw/notify',
    method: 'post',
    data
  })
}

export function uploadDraw(data) {
  return request({
    url: '/order/draw/upload',
    method: 'post',
    data
  })
}

export function frozenDraw(data) {
  return request({
    url: '/order/draw/frozen',
    method: 'post',
    data
  })
}

export function passDraw(data) {
  return request({
    url: '/order/draw/pass',
    method: 'post',
    data
  })
}

export function refuseDraw(data) {
  return request({
    url: '/order/draw/refuse',
    method: 'post',
    data
  })
}

export function settleDraw(data) {
  return request({
    url: '/order/draw/settle',
    method: 'post',
    data
  })
}

export function getDrawChildSum(params) {
  return request({
    url: '/draw/order/child/sum',
    method: 'get',
    params
  })
}

export function getConfig() {
  return request({
    url: '/draw/config/info',
    method: 'get'
  })
}

export function editConfig(data) {
  return request({
    url: '/draw/config/update',
    method: 'post',
    data
  })
}

export function updateCert(drawNo, url) {
  return request({
    url: '/draw/order/cert?drawNo=' + drawNo + '&url=' + url,
    method: 'post'
  })
}

export function getDrawSucSum(startTime, endTime) {
  return request({
    url: '/draw/order/suc/sum?startTime=' + startTime + '&endTime=' + endTime,
    method: 'get'
  })
}

export function adjustUsdRate(data) {
  return request({
    url: '/order/draw/adjust/usd/rate',
    method: 'post',
    data
  })
}

export function mockNotifyDraw(data) {
  return request({
    url: '/order/draw/notify/mock',
    method: 'post',
    data
  })
}
