import request from '@/utils/request'
import { isEmpty } from '@/utils/index'

export function getOrderSum(startTime, endTime) {
  if (isEmpty(startTime)) {
    startTime = ''
  }
  if (isEmpty(endTime)) {
    endTime = ''
  }
  return request({
    url: '/finance/order?startTime=' + startTime + '&endTime=' + endTime,
    method: 'get'
  })
}
export function getDepositSum(startTime, endTime) {
  if (isEmpty(startTime)) {
    startTime = ''
  }
  if (isEmpty(endTime)) {
    endTime = ''
  }
  return request({
    url: '/finance/deposit?startTime=' + startTime + '&endTime=' + endTime,
    method: 'get'
  })
}
export function getDrawSum(startTime, endTime) {
  if (isEmpty(startTime)) {
    startTime = ''
  }
  if (isEmpty(endTime)) {
    endTime = ''
  }
  return request({
    url: '/finance/draw?startTime=' + startTime + '&endTime=' + endTime,
    method: 'get'
  })
}
