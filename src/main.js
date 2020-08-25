import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'amfe-flexible/index'
import '@/assets/css/reset.css'
import Bridge from './utils/bridges.js'
// import Vconsole from 'vconsole'
// const vConsole = new Vconsole()
// Vue.use(vConsole)

Vue.config.productionTip = false
Vue.prototype.$center = new Vue()
Vue.prototype.$bridge = Bridge

// 自定义指令解决ios12 收起键盘的留白问题
Vue.directive('resetPage', {
  inserted: function(el) {
    // 监听键盘收起事件
    document.body.addEventListener('focusout', () => {
      if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        // 软键盘收起的事件处理
        setTimeout(() => {
          const scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0
          window.scrollTo(0, Math.max(scrollHeight - 1, 0))
        }, 100)
      }
    })
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

router.afterEach((to, from, next) => {
  window.scrollTo(0, 0)
  document.documentElement.scrollTop = document.body.scrollTop = 0
})
