import { login, logout, getCurrent, getAuthCode, getCaptcha } from '@/api/auth'
import { setToken, removeToken, setAuthCode } from '@/utils/auth'

const user = {
  state: {
    name: '',
    roles: []
  },

  mutations: {
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },
  actions: {
    // 验证码
    CaptchaBase64({ commit }, uuid) {
      return new Promise((resolve, reject) => {
        getCaptcha(uuid).then(res => {
          resolve(res.data)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登录
    Login({ commit }, user) {
      return new Promise((resolve, reject) => {
        login(user).then(res => {
          if (res.success) {
            setToken(res.data)
            getAuthCode().then(p => {
              setAuthCode(p.data)
            })
          }
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getCurrent().then(res => {
          commit('SET_ROLES', res.data.roleCode)
          commit('SET_NAME', res.data.name)
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        commit('SET_ROLES', [])
        removeToken()
        resolve()
      })
    },

    // 用户主动退出
    SignOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout().then(res => {
          commit('SET_ROLES', [])
          removeToken()
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default user
