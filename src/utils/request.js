/* eslint-disable no-unused-vars */
import axios from 'axios'
import { Notification, MessageBox } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'
import { isEmpty } from '@/utils/index'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // api 的 base_url
  timeout: 20000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
  config => {
    config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    config.headers['Content-Type'] = 'application/json'
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    const success = response.data.success
    const errCode = response.data.errCode
    if (errCode !== undefined && response.data.errCode === 'UNAUTHORIZED') {
      MessageBox.alert('登录状态失效，请重新登录', '提示', {
        confirmButtonText: '确定',
        type: 'warning',
        center: true,
        callback: action => {
          store.dispatch('LogOut').then(() => {
            location.reload()
          })
        }
      })
    } else if ((success !== undefined && !success)) {
      const msg = isEmpty(response.data.message) ? '操作失败' : response.data.message
      Notification.error({
        title: '提示：' + msg
      })
      return Promise.reject(msg)
    } else {
      return response.data
    }
  },
  error => {
    let code = 'ERROR'
    try {
      code = error.response.data.errCode
    } catch (e) {
      if (error.toString().indexOf('timeout')) {
        Notification.error({
          title: '请求超时',
          duration: 2500
        })
        return Promise.reject(error)
      }
    }
    if (code === 'UNAUTHORIZED') {
      let msg = error.response.data.message
      if (msg === '' || msg === undefined) {
        msg = '登录状态已失效，请重新登录'
      }
      MessageBox.alert(msg, '提示', {
        confirmButtonText: '确定',
        type: 'warning',
        center: true,
        callback: action => {
          store.dispatch('LogOut').then(() => {
            location.reload()
          })
        }
      })
    } else {
      const errorMsg = isEmpty(error.response.data.message) ? '操作失败' : error.response.data.message
      if (errorMsg !== undefined) {
        Notification.error({
          title: errorMsg,
          duration: 2500
        })
      }
    }
    return Promise.reject(error)
  }
)
export default service
