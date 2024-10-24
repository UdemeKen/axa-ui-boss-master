import request from '@/utils/request'
import { isEmpty } from '@/utils/index'

export function getCountryOptions(disabled) {
  if (isEmpty(disabled)) {
    disabled = ''
  }
  return request({
    url: '/sys/country/options?disabled=' + disabled,
    method: 'get'
  })
}

export function addCountryConfig(data) {
  return request({
    url: '/sys/country/config/add',
    method: 'post',
    data
  })
}

export function editCountryConfig(data) {
  return request({
    url: '/sys/country/config/update',
    method: 'post',
    data
  })
}

export function disCountry(data) {
  return request({
    url: '/sys/country/disabled',
    method: 'post',
    data
  })
}
