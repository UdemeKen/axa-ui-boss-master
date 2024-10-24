import request from '@/utils/request'

export function getRechargeInfo(rechargeNo) {
  return request({
    url: 'recharge/info?rechargeNo=' + rechargeNo,
    method: 'get'
  })
}

export function settleRecharge(rechargeNo) {
  return request({
    url: 'recharge/settled?rechargeNo=' + rechargeNo,
    method: 'post'
  })
}

export function confirmRecharge(data) {
  return request({
    url: 'recharge/confirm',
    method: 'post',
    data
  })
}

export function bindDraw(rechargeNo, drawNo) {
  return request({
    url: 'recharge/bind/draw?rechargeNo=' + rechargeNo + '&drawNo=' + drawNo,
    method: 'post'
  })
}

export function bindSys(data) {
  return request({
    url: 'recharge/bind/sys',
    method: 'post',
    data
  })
}

export function unbind(rechargeNo) {
  return request({
    url: 'recharge/unbind?rechargeNo=' + rechargeNo,
    method: 'post'
  })
}

export function refusedRecharge(rechargeNo, remark) {
  return request({
    url: 'recharge/refused?rechargeNo=' + rechargeNo + '&remark=' + remark,
    method: 'post'
  })
}
