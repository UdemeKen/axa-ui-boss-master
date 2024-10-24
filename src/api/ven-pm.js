import request from '@/utils/request'

export function getVenPm(data) {
  return request({
    url: '/vendor/pm/info',
    method: 'post',
    data
  })
}

export function addVenPm(data) {
  return request({
    url: '/vendor/pm/add',
    method: 'post',
    data
  })
}

export function editVenPm(data) {
  return request({
    url: 'vendor/pm/update',
    method: 'post',
    data
  })
}

export function disVenPm(data) {
  return request({
    url: '/vendor/pm/disabled',
    method: 'post',
    data
  })
}
