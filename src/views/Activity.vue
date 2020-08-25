<template>
  <div class="activityBox">
    <Toast :contentObj="contentObj" />
    <Popup :isShow="isShow" :data="data" @isShowAction="getIsShowAction" />
    <div class="activity">
      <div>
        <audio id="audio" src="../assets/audio/openEgg.mp3" hidden="true" controls></audio>
      </div>
      <div class="active_Header">
        <div class="myPrize" @touchend.stop="myPrizeAction"></div>
        <div class="hammer" :class="[isRotate ? 'animationName' : 'rotateName', {actives: 'pause'}]" @touchend.stop="hammerAction" v-if="!isStatus"></div>
        <div class="hammer" @touchend.stop="hammerAction" v-if="isStatus"></div>
        <div class="eggBox" :class="[isActive ? 'goldenEgg' : 'openEgg']" @touchend.stop="eggBoxAction" v-if="!isStatus">
          <img src="../assets/image/Activity/egg_01.png" alt="金蛋" v-if="isActive">
          <img src="../assets/image/Activity/egg_04.png" alt="金蛋" v-if="!isActive">
        </div>
        <div class="eggBox openEgg" @touchend.stop="eggBoxAction" v-if="isStatus">
          <img src="../assets/image/Activity/egg_04.png" alt="金蛋">
        </div>
        <div class="eggFooter">
          <div class="convert" @touchend="convertAction" v-if="channel !== 'gold'">立即兑换</div>
          <div class="trumpet">
            <img src="../assets/image/Activity/trumpet.png" alt="喇叭" />
            <ul class="_container" id="demo">
              <li class="containerLi" v-for="(item,index) in scrollData" :key="index">{{item}}</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="prizes"><img src="../assets/image/Activity/prizes.png" alt="奖金池" /></div>
      <div class="lightspot"><img src="../assets/image/Activity/lightspot.png" alt="长城炼金术亮点" /></div>
      <div class="experience">
        <div class="experienceBox" @touchend="experienceAction" v-if="channel !== 'gold'">立即体验</div>
      </div>
      <div class="footBox">
        <h3><i>活动规则</i></h3>
        <ul>
          <li class="explain" v-for="(item,index) in explainArr" :key="index">{{item}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import Popup from '@/components/Popup.vue'
import { joinLuckyDraw, getDrawAction, getMyPrizeAction } from '@/api/index'

import { getUrlKey, isWechatPlatform, getIsAppPlatform, getSendParams, getSkipInwechat, updateUserInfo, activeDescription } from '@/utils/common.js'
import { initSensors, trackEvent } from '@/utils/sensor.js' // 引入神策
import Toast from '@/components/Toast.vue'
import Bridges from '@/utils/bridges.js'
export default {
  name: 'Activity',
  data() {
    return {
      isActive: true, // 控制开奖
      isRotate: true, // 控制动画
      isShow: false, // 控制弹窗
      explainArr: [], // 活动说明文字
      scrollData: [], // 轮播滚动的内容
      channel: '', // 活动渠道
      data: {}, // 弹窗的内容
      url: '', // 浏览器下的跳转的地址
      isFlag: true, // 加锁，防止事件多次触发
      isStatus: false, // 控制是否已参与抽奖
      // toast轻提示
      contentObj: {
        content: '',
        isShow: false
      },
      // 设置文字轮播的参数
      scrollArea: '',
      speed: 10,
      timer: null,
      delay: 2000,
      liHeight: ''
    }
  },
  components: { Popup, Toast },
  beforeRouteEnter(to, from, next) {
    const isApp = getIsAppPlatform() // 判断是否在app中
    const getUrlKey = function(name) {
      // gold = 炼金术 大智慧、随身股 stocks
      var href = window.location.href
      return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(href) || [, ''])[1].replace(/\+/g, '%20')) || null
    }
    var channel = getUrlKey('channel')
    if (channel && channel.indexOf('gold') > -1) {
      channel = 'gold' // 为了处理在长城长分发中，获取不到正确渠道的问题
    }
    // 初始化获取token 判断是否已经开奖
    const getMyPrize = function() {
      getMyPrizeAction({ channel }).then((res) => {
        var isStatus
        if (res.code === 0 && Object.prototype.toString.call(res.data) === '[object Object]') {
          isStatus = true
        } else {
          isStatus = false
        }
        next(vm => {
          vm.channel = channel
          vm.isApp = isApp
          vm.isStatus = isStatus
          vm.$store.dispatch('setChannel', channel)
        })
      })
    }
    if (channel) { // 存在渠道 炼金术或者大智慧、随身股
      if (channel === 'gold' && isApp) { // 上线要条件要改为channel === 'gold' && isApp
        Bridges.getAccessToken(data => {
          getMyPrize()
        })
      } else { // 在随身股和大智慧渠道
        getMyPrize()
      }
    } else { // 在浏览器中打开
      next(vm => {
        vm.channel = channel
        vm.isApp = isApp
        vm.$store.dispatch('setChannel', channel)
      })
    }
  },
  created() {
    this.url = getSkipInwechat() // 获取浏览器下跳转的地址
    this.$center.$on('sendAction', val => {
      this.isFlag = val
    })
    // 注册炼金术登录之后的回调
    var _this = this
    this.$bridge.registerhandler('callRefreshAccessToken', (data, responseCallback) => {
      updateUserInfo(data)
      _this.getHummerAction()
    })
    window.callRefreshAccessToken = data => {
      // 暴露方法给Android终端
      _this.callRefreshAccessToken(data)
    }
  },
  mounted() {
    this.getScrollData() // 获取所有中奖数据
    this.explainArr = activeDescription() // 获取底部的活动说明

    function Scroll() {} // 轮播
    Scroll.prototype.upScroll = function(dom, _h, interval) {
      var dom = document.getElementById(dom)
      var timer = setTimeout(function() {
        var _field = dom.firstElementChild
        _field.style.marginTop = _h
        clearTimeout(timer)
      }, 1000)
      setInterval(function() {
        var _field = dom.firstElementChild
        _field.style.marginTop = "0px"
        dom.appendChild(_field)
        var _field = dom.firstElementChild
        _field.style.marginTop = _h
      }, interval)
    }
    this.myScroll = new Scroll()
  },
  methods: {
    callRefreshAccessToken(data) { // 练金术登录之后回调执行开奖
      updateUserInfo(data)
      this.getHummerAction()
    },
    // 用户所有奖品接口
    getScrollData() {
      getDrawAction().then((res) => {
        if (res.code === 0) {
          var datas = res.data
          if (!datas.length) {
            return
          } else if (datas.length === 1) {
            datas.push(datas[0])
          }
          datas.map((item, index) => {
            if (item.type === 3) {
              switch (item.name) {
                case 'x':
                  this.scrollData.push(`恭喜${item.user}获得星巴克35元兑换券`)
                  break
                case 'a':
                  this.scrollData.push(`恭喜${item.user}获得爱奇艺月卡`)
                  break
                default:
                  this.scrollData.push(`恭喜${item.user}获得京东商城购物券${item.name}元`)
              }
            } else {
              this.scrollData.push(`恭喜${item.user}获得${item.name}积分`)
            }
          })
          this.myScroll.upScroll('demo', '-0.6667rem', 3000)
        } else {
          this.toastAction(res.msg)
        }
      })
    },
    myPrizeAction() {
      if (this.channel === 'gold') { // 先判断渠道
        if (getIsAppPlatform()) { // 再判断是否在APP中
          if (this.$store.state.isAuthorization) {
            this.getMyPrize()
          } else {
            this.$bridge.goNativeLogin()
          }
        } else {
          window.location.href = this.url
        }
      } else if (this.channel === null) {
        window.location.href = this.url
      } else if (this.channel === 'stocks') {
        this.getMyPrize()
      }
    },
    getMyPrize() {
      getMyPrizeAction({ channel: this.channel }).then((res) => {
        if (res.code === 4002020002) {
          // this.$router.push({ path: '/login' })
          this.$router.push({ name: 'login', query: { channel: this.channel } })
        } else if (res.code === 4100 || res.code === 4101 || res.code === 0) {
          // this.$router.push({ path: '/myPrize' })
          this.$router.push({ name: 'myPrize', query: { channel: this.channel } })
        } else {
          this.toastAction(res.msg)
        }
      })
    },
    eggBoxAction() {
      this.hammerAction()
    },
    hammerAction() {
      if (this.channel === 'gold') { // 先判断渠道
        if (getIsAppPlatform()) { // 再判断是否在APP中
          if (this.$store.state.isAuthorization) {
            this.getHummerAction()
          } else {
            this.$bridge.goNativeLogin()
          }
        } else {
          window.location.href = this.url
        }
      } else if (this.channel === null) {
        window.location.href = this.url
      } else if (this.channel === 'stocks') {
        this.getHummerAction()
      }
    },
    getHummerAction() {
      if (!this.isFlag) return
      this.isFlag = false
      // 先判断一下是否登录
      // 对砸金蛋做埋点
      trackEvent('ActClick', {
        ActButtonName: '参与砸蛋'
      })
      joinLuckyDraw({ channel: this.channel }).then(res => {
        if (res.code === 4002020002) {
          // 练金术 4002020001 或者h5 4002020001 没有登录
          this.isFlag = true
          // this.$router.push({ path: '/login' })
          this.$router.push({ name: 'login', query: { channel: this.channel } })
        } else if (res.code === 4100 || res.code === 4101 || res.code === 0) {
          this.isRotate = false
          const rotate = document.querySelector('.hammer')
          if (this.isActive && !this.isStatus) {
            const audio = document.getElementById('audio')
            const box = document.querySelector('.eggBox')
            rotate.addEventListener('webkitAnimationEnd', () => {
              rotate.classList.remove('rotateName')
              // 兼容 ios safari浏览器
              var imgSrcArr = [
                require('@/assets/image/Activity/egg_01.png'),
                require('@/assets/image/Activity/egg_02.png'),
                require('@/assets/image/Activity/egg_03.png'),
                require('@/assets/image/Activity/egg_04.png')
              ]
              var imgWrap = []

              function preloadImg(arr) {
                for (var i = 0; i < arr.length; i++) {
                  imgWrap[i] = new Image()
                  imgWrap[i].src = arr[i]
                  imgWrap[i].style.width = '100%'
                  imgWrap[i].style.height = '100%'
                  if (i === 3) {
                    imgWrap[i].style.display = 'none'
                  }
                }
              }
              preloadImg(imgSrcArr)
              audio.play()
              var index = 0
              setTimeout(() => {
                this.setTimer = setInterval(() => {
                  box.innerHTML = ''
                  box.appendChild(imgWrap[index])
                  if (index <= 2) {
                    index++
                  } else {
                    this.isActive = false
                    this.stopBodyScroll(true)
                    this.timer = setTimeout(() => {
                      this.$nextTick(() => {
                        if (res.code === 4101 || res.code === 4100) {
                          this.data = {
                            channel: this.channel,
                            isBoolear: false
                          }
                        } else {
                          this.data = {
                            channel: this.channel,
                            isBoolear: true,
                            type: res.data.type,
                            form: res.data.prize
                          }
                        }
                        this.isShow = true
                        this.isFlag = true
                        clearTimeout(this.timer)
                      })
                    }, 1000)
                    clearInterval(this.setTimer)
                  }
                }, 20)
              }, 200)
            }, false)
          } else {
            this.$nextTick(() => {
              if (res.code === 4101 || res.code === 4100) {
                this.data = {
                  channel: this.channel,
                  isBoolear: false
                }
              } else {
                this.data = {
                  channel: this.channel,
                  isBoolear: true,
                  type: res.data.type,
                  form: res.data.prize
                }
              }
              this.isShow = true
              this.isFlag = true
            })
          }
        } else {
          this.toastAction(res.msg)
        }
      })
    },
    convertAction() {
      trackEvent('ActClick', {
        ActButtonName: '立即兑换'
      })
      setTimeout(() => {
        window.location.href = 'https://fintechapp.cgws.com/h5/downloadA/newone/'
      }, 200)
    },
    experienceAction(url) {
      trackEvent('ActClick', {
        ActButtonName: '立即体验'
      })
      setTimeout(() => {
        window.location.href = 'https://fintechapp.cgws.com/h5/downloadA/newone/'
      }, 200)
    },
    // 弹窗后落地页恢复初始位置
    stopBodyScroll(isFixed) {
      var activity = document.querySelector('.activity')
      let top = 0
      if (isFixed) {
        top = window.scrollY
        activity.style.position = 'fixed'
        // activity.style.top = -top + 'px'
      } else {
        activity.style.position = ''
        activity.style.top = ''
      }
      window.scrollTo(0, top) // 回到原先的top
    },
    getIsShowAction(paramas) {
      this.isShow = paramas
      this.stopBodyScroll(this.isShow)
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
      }, 1000)
    }
  },
  beforeDestroy() {
    // clearInterval(this.setTimer)
    // clearTimeout(this.timer)
    // this.isShow = false
  }
}

</script>
<style scoped lang="scss">
._container {
  height: 50px;
  overflow: hidden;
  margin: 0;
  padding: 0;
}

._container .containerLi {
  height: 50px;
  line-height: 50px;
  font-size: 24px;
  font-family: Regular, sans-serif;
  font-weight: 400;
  color: rgba(253, 223, 185, 1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-left: 30px;
}

._container .containerLi:first-child {
  margin-top: 0;
  transition: margin-top .8s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.activityBox {
  .activity {
    width: 100%;
    height: 3079px;
    background: #A31929;
    position: relative;

    .active_Header {
      width: 100%;
      height: 1234px;
      background: url('../assets/image/Activity/openEgg.png');
      background-repeat: no-repeat;
      background-size: 100% 100%;
      position: relative;

      .goldenEgg {
        background: url('../assets/image/Activity/egg_01.png');
      }

      .openEgg {
        background: url('../assets/image/Activity/egg_04.png');
      }

      .eggBox {
        /*width: 100%;
        height: 792px;*/
        /* background-size: 100% 100%;*/
        /*background: #333;*/
        width: 435px;
        /*height: 420px;*/
        /*background: url('../assets/image/Activity/egg_01.png');*/
        /*background: url('../assets/image/Activity/egg_04.png');*/
        background-size: 100% 100%;
        /*margin: 0 auto;*/
        /*background: #ccc;*/
        position: absolute;
        /*top: 340px;*/
        bottom: 465px;
        left: 50%;
        transform: translate(-50%, 0);
        z-index: 0;
        display: flex;
        justify-content: center;

        img {
          display: block;
          width: 100%;
          height: 100%;
        }
      }

      .eggFooter {
        width: 100%;
        height: 442px;
        /*background: url('../assets/image/Activity/eggFooter.png');
        background-size: 100% 100%;*/
        position: absolute;
        bottom: 0;
      }

      .myPrize {
        width: 82px;
        height: 77px;
        position: absolute;
        top: 0;
        left: 604px;
        background: url('../assets/image/Activity/myPrize.png') no-repeat;
        background-size: 100% 100%;
        cursor: pointer;
      }

      .hammer {
        width: 200px;
        height: 187px;
        position: absolute;
        top: 366px;
        left: 436px;
        background: url('../assets/image/Activity/hammer.png') no-repeat;
        background-size: 100% 100%;
        cursor: pointer;
        z-index: 1;

        img {
          display: block;
          width: 100%;
          height: 100%;
          display: none !important;
        }
      }

      .convert {
        width: 640px;
        height: 105px;
        position: absolute;
        bottom: 160px;
        left: 50%;
        transform: translate(-50%, 0);
        background: linear-gradient(180deg, rgba(254, 230, 196, 1) 0%, rgba(251, 205, 155, 1) 100%);
        border-radius: 53px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-family: Medium, sans-serif;
        font-size: 45px;
        font-weight: 500;
        color: rgba(212, 19, 41, 1);
        cursor: pointer;
      }

      .trumpet {
        width: 480px;
        /*height: 50px;*/
        border: 2px solid rgba(252, 211, 165, 1);
        border-radius: 25px;
        position: absolute;
        bottom: 65px;
        left: 50%;
        transform: translate(-50%, 0);
        display: flex;
        align-items: center;
        padding-left: 58px;

        img {
          width: 32px;
          height: 32px;
          display: block;
        }

        .scroll-up {
          height: 50px;
          line-height: 50px;
          overflow: hidden;
          padding-left: 30px;
        }

        .containerLi {
          /* height: 50px;
          line-height: 50px;*/
          font-size: 24px;
          font-family: Regular, sans-serif;
          font-weight: 400;
          color: rgba(253, 223, 185, 1);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          /* display: flex;
          align-items: center;*/
        }
      }
    }

    .prizes {
      width: 100%;
      height: 515px;
      position: relative;
      margin-bottom: 10px;

      img {
        width: 697px;
        height: 100%;
        display: block;
        position: absolute;
        top: -20px;
        left: 50%;
        transform: translate(-50%, 0);
      }
    }

    .lightspot {
      width: 100%;
      height: 480px;
      display: flex;
      justify-content: center;

      img {
        width: 697px;
        height: 100%;
        display: block;
      }
    }

    .experience {
      width: 100%;
      height: 105px;
      display: flex;
      justify-content: center;
      margin: 50px 0 60px 0;

      .experienceBox {
        width: 654px;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-family: Medium, sans-serif;
        font-size: 45px;
        font-weight: 500;
        color: rgba(212, 19, 41, 1);
        background: linear-gradient(180deg, rgba(254, 230, 196, 1) 0%, rgba(251, 205, 155, 1) 100%);
        border-radius: 53px;
        cursor: pointer;
      }
    }

    .footBox {
      width: 100%;
      padding: 0 20px 0 40px;
      box-sizing: border-box;

      h3 {
        height: 100px;
        line-height: 100px;
        font-family: Bold, sans-serif;
        font-size: 38px;
        font-weight: bold;
        font-style: italic;
        color: rgba(254, 211, 173, 1);
      }

      ul .explain {
        color: rgba(254, 211, 173, 1);
        line-height: 45px;
        font-family: Light, sans-serif;
        font-size: 25px;
        letter-spacing: 2px;
      }
    }
  }
}

/*砸蛋锤子旋转动画*/
@keyframes changDeg {
  0% {
    transform: rotate(0deg);
    transform-origin: right bottom;
  }

  50% {
    transform: rotate(20deg);
    transform-origin: right bottom;
  }

  100% {
    transform: rotate(-0deg);
    transform-origin: right bottom;
  }
}

.animationName {
  animation: changDeg 1s linear 0.2s infinite;
  -webkit-animation: changDeg 1s linear 0.2s infinite;
  -moz-animation: changDeg 1s linear 0.2s infinite;
  -o-animation: changDeg 1s linear 0.2s infinite;
  -ms-animation: changDeg 1s linear 0.2s infinite;
}

/*砸蛋锤子旋转动画*/
@keyframes chang {
  0% {
    transform: rotate(0deg);
    transform-origin: right bottom;
  }

  50% {
    transform: rotate(45deg);
    transform-origin: right bottom;
  }

  100% {
    transform: rotate(-0deg);
    transform-origin: right bottom;
  }
}

.rotateName {
  animation: chang 0.2s linear 0.2s;
}

.pause {
  animation-play-state: paused;
}

</style>
