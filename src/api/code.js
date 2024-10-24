import request from '@/utils/request'

export function resetEmail(data) {
  return request({
    url: 'api/code/resetEmail',
    method: 'post',
    data
  })
}

export function updatePass(data) {
  return request({
    url: 'api/sys/user/pwd',
    method: 'post',
    data
  })
}
