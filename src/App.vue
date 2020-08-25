<template>
  <div id="app">
    <!-- <transition :name="transitionName"> -->
    <keep-alive exclude="Login,Myprize">
      <router-view class="transitionBody"></router-view>
    </keep-alive>
    <!-- </transition> -->
    <Toast :contentObj="contentObj" />
  </div>
</template>
<script>
import Toast from '@/components/Toast.vue'
import { getIsAppPlatform, updateUserInfo, isWechatPlatform } from '@/utils/common.js'
import { getUserAgent } from '@/utils/setShare'
import { showWechartShare } from '@/utils/wechart.js'
import { initSensors, trackEvent } from '@/utils/sensor.js' // 引入神策
window.onload = function() {
  document.addEventListener('touchstart', function(event) {
    if (event.touches.length > 1) {
      event.preventDefault()
    }
  })
  document.addEventListener('gesturestart', function(event) {
    event.preventDefault()
  })
}
export default {
  name: 'App',
  components: { Toast },
  data() {
    return {
      transitionName: 'transitionLeft', // 动画体验效果不好
      contentObj: {
        content: '',
        isShow: false
      }
    }
  },
  created() {
    this.$bridge.getAccessToken() // 初始化获取token
  },
  mounted() {
    // 初始化神策+解决二次分享链接冲突
    let userId
    const url = decodeURIComponent(window.location.href)
    const num1 = url.indexOf('#')
    const num2 = url.indexOf('?')
    if (url.indexOf('from=') !== -1 && num1 > num2) {
      const str1 = url.slice(num2, num1)
      const str = url.replace(str1, '')
      window.location.replace(str)
    }
    const num = url.indexOf('userId')
    if (num !== -1) {
      // 如果是长城长分发过来的内容
      var params = url.slice(num)
      var index = params.indexOf('&')
      var indexs = params.indexOf('?')
      if (index > -1 || indexs > -1) {
         if (index > -1 && indexs > -1) {
           userId = index > indexs ? params.slice(7, indexs) : params.slice(7, index)
         } else {
           userId = index > -1 ? params.slice(7, index) : params.slice(7, indexs)
      } else {
         userId = params.slice(7)
      }
    }
    if (userId) {
      initSensors(userId) // 长城长分发的初始化数据埋点
    } else {
      initSensors(null) // 初始化数据埋点
    }
    getUserAgent() // app中分享到微信
    // var isWechat = isWechatPlatform()
    if (navigator.userAgent.toLowerCase().indexOf('micromessenger') !== -1) {
      // 判断是否在微信中打开
      showWechartShare() // 微信中二次分享的初始化
    }
    // 禁止在safari中双击缩放的功能
    // 阻止双击放大
    var lastTouchEnd = 0
    document.addEventListener('touchstart', function(event) {
      if (event.touches.length > 1) {
        event.preventDefault()
      }
    })
    document.addEventListener('touchend', function(event) {
      var now = (new Date()).getTime()
      if (now - lastTouchEnd <= 300) {
        event.preventDefault()
      }
      lastTouchEnd = now
    }, false)

    // 阻止双指放大
    document.addEventListener('gesturestart', function(event) {
      event.preventDefault()
    })
    // 将backToday方法绑定到window下面，提供给外部调用
    window.appConnect = this
  },
  methods: {
    firstShare() {
      // 对分享成功做埋点
      trackEvent('ActClick', {
        ActButtonName: '分享成功'
      })
      this.toastAction('分享成功！', true)
    },
    toastAction(content, isShow = true) {
      this.contentObj = {
        content,
        isShow
      }
      setTimeout(() => {
        this.contentObj = {
          content: '',
          isShow: false
        }
      }, 2000)
    }
  },
  watch: {
    // 使用watch 监听$router的变化
    $route(to, from) {}
  }
}

</script>
<style lang="scss">
#app {
  width: 100%;
  height: 100%;
}

.transitionBody {
  transition: all 0.15s ease;
  /*定义动画的时间和过渡效果*/
}

.transitionLeft-enter,
.transitionRight-leave-active {
  -webkit-transform: translate(100%, 0);
  transform: translate(100%, 0);
  /*当左滑进入右滑进入过渡动画*/
}

.transitionLeft-leave-active,
.transitionRight-enter {
  -webkit-transform: translate(-100%, 0);
  transform: translate(-100%, 0);
}

</style>
