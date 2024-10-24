import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'sys/notice/add',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'sys/notice/delete/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'sys/notice/update',
    method: 'post',
    data
  })
}
