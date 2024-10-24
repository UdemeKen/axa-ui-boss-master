import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
import { getToken } from '@/utils/auth' // getToken from cookie
import { getTreeMenu } from '@/api/auth'
import { filterAsyncRouter } from './store/modules/permission'

NProgress.configure({ showSpinner: false })// NProgress Configuration

const whiteList = ['/login']// no redirect whitelist

// auth judge function
function hasPermission(roles, permissionRoles) {
  if (roles.indexOf('admin') >= 0) return true // admin auth passed directly
  if (!permissionRoles) return true
  return permissionRoles.indexOf(roles) >= 0
}

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  if (getToken()) {
    // 已登录且要跳转的页面是登录页
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      if (store.getters.roles.length === 0) { // 判断当前用户是否已拉取完user_info信息
        store.dispatch('GetInfo').then(user => { // 拉取user_info
          getTreeMenu().then(res => {
            const asyncRouter = filterAsyncRouter(res)
            store.dispatch('GenerateRoutes', asyncRouter).then(() => { // 存储路由
              router.addRoutes(asyncRouter) // 动态添加可访问路由表
              next({ ...to, replace: true })// hack方法 确保addRoutes已完成
            })
          })
        }).catch((err) => {
          store.dispatch('LogOut').then(() => {
            Message.error(err || '验证失败，请重新登录')
            next({ path: '/' })
          })
        })
      } else {
        // 没有动态改变权限的需求可直接next() 删除下方权限判断 ↓
        if (hasPermission(store.getters.roles, to.meta.roles)) {
          next()
        } else {
          next({ path: '/401', replace: true, query: { noGoBack: true }})
        }
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})