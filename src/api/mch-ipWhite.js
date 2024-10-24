import request from '@/utils/request'
import { isEmpty } from '@/utils/index'

export function addIpWhite(data) {
  return request({
    url: '/merchant/ip/white/add',
    method: 'post',
    data
  })
}

export function getIpWhiteInfo(data) {
  return request({
    url: '/merchant/ip/white/info',
    method: 'post',
    data
  })
}

export function editIpWhite(data) {
  return request({
    url: 'merchant/ip/white/update',
    method: 'post',
    data
  })
}

export function disIpWhite(data) {
  return request({
    url: '/merchant/ip/white/delete',
    method: 'post',
    data
  })
}

