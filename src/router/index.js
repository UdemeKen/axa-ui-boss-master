import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/

export const constantRouterMap = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  { path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: '首页',
        meta: { title: '首页', icon: 'index', noCache: true }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'center',
        component: () => import('@/views/system/user/center'),
        name: '个人中心',
        meta: { title: '个人中心', icon: 'user' }
      }
    ]
  },
  {
    path: '/order/pay',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'info/:orderNo',
        component: () => import('@/views/order/info'),
        name: '订单详情',
        meta: { title: '订单详情', noCache: true }
      }
    ]
  },
  {
    path: '/order/draw',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'info/:transNo',
        component: () => import('@/views/draw/order/info'),
        name: '提现详情',
        meta: { title: '提现详情', noCache: true }
      }
    ]
  },
  {
    path: '/order/rechg',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'info/:transNo',
        component: () => import('@/views/recharge/info'),
        name: '充值详情',
        meta: { title: '充值详情', noCache: true }
      }
    ]
  }
]

export default new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
