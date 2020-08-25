import Vue from 'vue'
import VueRouter from 'vue-router'
import Activity from '../views/Activity.vue'
// import Loading from '../views/Loading.vue'
import { getUserInfo } from '@/api/index'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    name: 'Activity',
    component: Activity,
    meta: {
      title: '活动页',
      index: 1
    }
  },
  {
    path: '/myPrize',
    name: 'myPrize',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Myprize.vue'),
    meta: {
      title: '奖品',
      index: 2
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "about" */ '../views/Login.vue'),
    meta: {
      title: '登录/注册',
      index: 3
    }
  }
]

const router = new VueRouter({
  mode: 'hash',
  // mode: 'history', // 如果使用history模式 上线需要服务端配置
  base: process.env.BASE_URL,
  routes,
  scrollBehavior(to, from, savedPosition) {
    return {
      x: 0,
      y: 0
    }
  }
})
// 全局路由守卫
// router.afterEach((to, from, next) => {
//   window.scrollTo(0, 0)
//   next()
// })
export default router
