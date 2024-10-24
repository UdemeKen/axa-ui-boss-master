import request from '@/utils/request'

export function getSysConfig() {
  return request({
    url: '/sys/config',
    method: 'get'
  })
}
