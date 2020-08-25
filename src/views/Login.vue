<template>
  <div class="login">
    <Toast :contentObj="contentObj" />
    <div class="login_content">
      <div class="login_Title">登录</div>
      <div class="login-body">
        <div class="login-form">
          <form>
            <div class="account-number">
              <div class="glyphicon-user">
                <img src="../assets/image/Login/iphone.png" alt="输入电话号码">
                <span class="line"></span>
              </div>
              <input id="inputIphone" :class="{ invalid: iphoneObj.isIphone }" maxlength="11" type="tel" pattern="[0-9]*" :placeholder="iphoneObj.placeholder" :value="iphoneObj.iphone" required @blur="iphoneBlurAction" @focus="iphoneFocusAction" v-on:input="iphoneChangeValue" ref="iphoneRef" />
            </div>
            <div class="account-graph">
              <div class="glyphicon">
                <div class="graphBox">
                  <img class="graphImg" src="../assets/image/Login/graph.png" alt="输入图形验证码">
                  <span class="line"></span>
                </div>
                <input :class="{ invalid: graphObj.isGraph }" type="text" onKeyUp="value=value.replace(/[\W]/g,'')" :placeholder="graphObj.placeholder" :value="graphObj.graph" required @blur="graphBlurAction" @focus="graphFocusAction" v-on:input="graphChangeValue" ref="graphRef" maxlength="4" />
              </div>
              <!-- <div class="letter">{{graphObj.captcha}}</div> -->
              <valid-code class="letter" :value.sync="validCode" :time="time" @updateAction="validCodeAction($event)"></valid-code>
            </div>
            <div class="account-message">
              <div class="glyphicon">
                <div class="graphBox">
                  <img class="messageImg" src="../assets/image/Login/message.png" alt="输入短信验证码">
                  <span class="line"></span>
                </div>
                <input v-reset-page :class="{ invalid: messageObj.isMessage }" type="tel" pattern="[0-9]*" :placeholder="messageObj.placeholder" :value="messageObj.message" required @blur="messageBlurAction" @focus="messageFocusAction" v-on:input="messageChangeValue" ref="messageRef" maxlength="6" />
              </div>
              <div :class="[sendShow ? 'sendMessage' : 'unsentMessage']" @touchend="sendMessageAction">{{sendContent}}</div>
            </div>
            <div :class="[loginShow ? 'login-bright' : 'login-gray']" @touchend="loginButtonAction">登录</div>
            <div class="radio-box">
              <div class="radio" @touchend="radioShowAction">
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" style="width: 10px;height: 10px;">
                  <circle cx="5" cy="5" r="4.5" stroke="#fff" stroke-width="0.5" fill-opacity="0" />
                  <circle v-if="radioShow" cx="5" cy="5" r="2.5" stroke-width="3" fill="#fff" />
                </svg>
              </div>
              <div class="content">点击“登录”，表示您已阅读并同意
                <span @touchend="clauseAction">
                  《长城证券用户隐私条款》
                </span>
                全部条款</div>
            </div>
          </form>
        </div>
      </div>
      <div class="footer">长城证券客服：95514</div>
    </div>
  </div>
</template>
<script>
import ValidCode from '@/components/ValidCode.vue'
import Toast from '@/components/Toast.vue'
import { getUserSmsCode, getUserLoginInfo } from '@/api/index'
import { getUrlKey } from '@/utils/common.js'
export default {
  name: 'Login',
  components: { ValidCode, Toast },
  data() {
    return {
      iphoneObj: {
        placeholder: '请输入手机号码',
        iphone: '',
        isIphone: false
      },
      graphObj: {
        placeholder: '请输入图形验证码',
        graph: '',
        captcha: '',
        isGraph: false
      },
      messageObj: {
        placeholder: '请输入短信验证码',
        message: '',
        isMessage: false
      },
      radioShow: true,
      sendShow: true,
      sendContent: '获取验证码',
      loginShow: true,
      // 验证码
      validCode: {
        width: '168px',
        height: '90px',
        length: 4,
        t: 1
      },
      contentObj: {
        content: '',
        isShow: false
      },
      time: 0,
      codeFlag: true
    }
  },
  methods: {
    init() {
      this.checkCellMobile(this.iphoneObj.iphone)
      this.checkCellGraph(this.graphObj.graph)
      this.checkCellMessage(this.messageObj.message)
    },
    clauseAction() {
      window.location.href = 'https://fintechapp.cgws.com/h5/policy-page/html/privacy-policy.html'
    },
    // 勾选事件
    radioShowAction() {
      // this.radioShow = !this.radioShow
    },
    // 电话框获焦、失焦、value改变事件、和验证规则
    iphoneFocusAction() {
      this.iphoneObj.placeholder = ''
      // this.iphoneObj.iphone = ''
    },
    iphoneBlurAction() {
      const { iphone: value } = this.iphoneObj
      this.checkCellMobile(value)
    },
    iphoneChangeValue() {
      this.iphoneObj.iphone = this.$refs.iphoneRef.value
    },
    checkCellMobile(str) {
      if (str === '') {
        // callback(new Error('手机号不可为空'));
        this.iphoneObj.placeholder = '请输入手机号码'
      } else {
        if (str !== '') {
          var reg = /^1[3456789]\d{9}$/
          if (!reg.test(str)) {
            this.iphoneObj.code = 0
            this.toastAction('请输入有效的手机号码', true)
          } else {
            this.iphoneObj.code = 200
            this.$refs.iphoneRef.blur()
          }
        }
        // callback();
      }
    },
    // 图形验证框获焦、失焦、value改变事件和验证规则
    graphFocusAction() {
      this.graphObj.placeholder = ''
      // this.graphObj.graph = ''
    },
    graphBlurAction() {
      const { graph: value } = this.graphObj
      this.checkCellGraph(value)
    },
    graphChangeValue() {
      this.graphObj.graph = JSON.stringify(this.$refs.graphRef.value).replace(/\W/g, '')
    },
    validCodeAction(data) {
      this.graphObj.captcha = data
    },
    checkCellGraph(str) {
      if (str === '') {
        // callback(new Error('负责人手机号不可为空'));
        this.graphObj.isGraph = false
        this.graphObj.placeholder = '请输入图形验证码'
      } else {
        if (str !== '') {
          var reg = this.graphObj.captcha
          if (str.toLowerCase() !== reg.toLowerCase()) {
            this.graphObj.code = 0
            this.toastAction('请输入正确的图形验证码', true)
            this.time = new Date().getTime()
          } else {
            this.graphObj.code = 200
            this.$refs.graphRef.blur()
          }
        }
        // callback();
      }
    },
    // 短信验证框获焦、失焦、value改变事件和验证规则
    messageFocusAction() {
      this.messageObj.placeholder = ''
      const body = document.querySelector('.glyphicon') // input所在的容器
      body.scrollTop = body.scrollHeight
    },
    messageBlurAction() {
      const { message: value } = this.messageObj
      this.checkCellMessage(value)
      // 解决调起手机软键盘页面被顶到底部再关闭软键盘页面底部留白的问题
      // ios键盘弹出底部留白问题
      window.scroll(0, 0)
    },
    messageChangeValue() {
      this.messageObj.message = this.$refs.messageRef.value
    },
    checkCellMessage(str) {
      if (str === '') {
        this.messageObj.code = 0
        this.messageObj.placeholder = '请输入短信验证码'
      } else {
        this.messageObj.code = 200
      }
    },
    // 发送短信验证码倒计时
    sendMessageAction() {
      this.init()
      if (this.iphoneObj.code && this.graphObj.code) {
        if (!this.codeFlag) return
        this.codeFlag = false
        getUserSmsCode({ mobile: this.iphoneObj.iphone }).then((res) => {
          if (res.code === 0) {
            let time = 120
            this.sendShow = false
            this.sendContent = `重新发送${time}s`
            const downCount = () => {
              if (time > 1) {
                time--
                this.sendContent = `重新发送${time}s`
              } else {
                clearInterval(timer)
                this.codeFlag = true
                this.sendContent = '重新发送'
                this.sendShow = true
                time = null
              }
            }
            var start
            var end
            if (!this.codeFlag) {
              document.addEventListener('visibilitychange', () => {
                if (document.visibilityState === 'hidden') {
                  clearInterval(timer) // 为了兼容pc，pc切换到后台继续运行
                  start = new Date().getTime()
                } else if (document.visibilityState === 'visible') {
                  if (time === null) return
                  end = new Date().getTime()
                  var aa = (Number(end) - Number(start))
                  var s2 = Math.floor((end - start) / 1000)
                  time = time - s2
                  if (time > 0) {
                    this.sendContent = `重新发送${time}s`
                    timer = setInterval(downCount, 1000)
                  } else {
                    this.sendShow = true
                    this.sendContent = '重新发送'
                    this.codeFlag = true
                    time = null
                    clearInterval(timer)
                  }
                  removeEventListener('visibilitychange', () => {})
                }
              })
            } else {
              this.toastAction(res.msg)
            }
            var timer = setInterval(downCount, 1000)
          }
        })
      } else if (this.iphoneObj.code) {
        this.toastAction('请输入正确的图形验证码', true)
        this.time = new Date().getTime()
      } else {
        this.toastAction('请输入有效的手机号码', true)
      }
    },
    loginButtonAction() {
      this.init()
      if (this.messageObj.code) {
        if (this.iphoneObj.code && this.graphObj.code) {
          this.loginShow = false
          getUserLoginInfo({
            mobile: this.iphoneObj.iphone,
            code: this.messageObj.message
          }).then(res => {
            if (res.code === 0) {
              // this.$router.push({ path: '/' })
              this.$router.replace({ name: 'Activity', query: { channel: getUrlKey('channel') } })
              this.$center.$emit('sendAction', true)
            } else {
              this.time = new Date().getTime()
              this.loginShow = true
              this.toastAction(res.msg)
            }
          })
        } else if (!this.iphoneObj.code) {
          this.toastAction('请输入有效的手机号码')
        } else if (!this.graphObj.code) {
          this.time = new Date().getTime()
        } else {
          this.toastAction('请输入短信验证码')
        }
      } else {
        if (this.iphoneObj.code && this.graphObj.code) {
          this.toastAction(this.sendShow ? '请获取短信验证码' : '请输入短信验证码')
        } else if (!this.iphoneObj.code) {
          this.toastAction('请输入有效的手机号码')
        } else if (!this.graphObj.code) {
          this.toastAction('请输入正确的图形验证码')
          this.time = new Date().getTime()
        } else {
          this.toastAction('请输入有效的手机号码')
        }
      }
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
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.iphoneObj.iphone = ''
      vm.$refs.iphoneRef.blur()
      vm.graphObj.graph = ''
      vm.$refs.graphRef.blur()
      vm.messageObj.message = ''
      vm.$refs.messageRef.blur()
      vm.loginShow = true
      vm.sendShow = true
      vm.sendContent = '获取验证码'
    })
  },
  beforeDestroy() {
    // clearInterval(this.timer)
    // this.loginShow = true
    // this.sendShow = true
    // this.sendContent = '重新发送'
  }
}

</script>
<style scoped lang="scss">
.login {
  width: 100%;
  height: 100%;
  background: #A31929;
  position: relative;
  min-height: 800px;

  .login_content {
    width: 100%;
    height: 100%;

    .footer {
      width: 100%;
      height: 11.8%;
      display: flex;
      justify-content: center;
      align-items: center;
      /*line-height: 143px;*/
      text-align: center;
      font-size: 24px;
      font-family: Light, sans-serif;
      font-weight: 300;
      color: rgba(255, 255, 255, 1);
      /* position: absolute;
      bottom: 0;
      left: 0;*/
    }

    .login_Title {
      margin-left: 93px;
      height: 16.6%;
      /*line-height: 16.6%;*/
      display: flex;
      align-items: center;
      font-size: 54px;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
      font-family: Medium, sans-serif;
    }

    .login-body {
      display: flex;
      height: 71.6%;
      width: 100%;
      justify-content: center;
      align-items: center;

      .radio-box {
        width: 566px;
        display: flex;
        justify-content: center;

        .radio {
          width: 25px;
          display: flex;
          justify-content: center;
          padding-top: 3px;

          span {
            width: 9px;
            height: 9px;
            background: rgba(255, 255, 255, 1);
            border-radius: 50%;
          }
        }

        .content {
          font-size: 24px;
          font-family: Light, sans-serif;
          font-weight: 300;
          color: rgba(255, 255, 255, 1);
          line-height: 30px;
          padding-left: 10px;

          a {
            font-size: 24px;
            font-family: Light, sans-serif;
            font-weight: 300;
            color: rgba(255, 255, 255, 1);
            -webkit-tap-highlight-color: transparent;
            outline: none;
          }
        }
      }

      .login-bright,
      .login-gray {
        width: 566px;
        height: 99px;
        line-height: 99px;
        text-align: center;
        margin: 30px 0;
        border-radius: 50px;
        font-size: 45px;
        font-family: Medium, sans-serif;
        font-weight: 500;
      }

      .login-bright {
        background: linear-gradient(180deg, rgba(254, 230, 196, 1) 0%, rgba(251, 205, 155, 1) 100%);
        color: rgba(212, 19, 41, 1);
      }

      .login-gray {

        background: linear-gradient(180deg, rgba(243, 243, 243, 1) 0%, rgba(184, 184, 184, 1) 100%);
        color: rgba(128, 128, 128, 1);
      }

      .account-graph,
      .account-message {
        width: 566px;
        height: 90px;
        display: flex;
        justify-content: space-between;
        margin: 20px 0;

        .glyphicon {
          width: 389px;
          height: 90px;
          background: rgba(255, 255, 255, .2);
          /*opacity: 0.2;*/
          border-radius: 10px;
          display: flex;
          justify-content: flex-start;
          margin: 0;

          .graphBox {
            width: 80px;
            height: 100%;
            position: relative;
            margin: 0;

            img {
              display: block;
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
            }

            .graphImg {
              width: 40px;
              height: 36px;
            }

            .messageImg {
              width: 39px;
              height: 43px;
            }

            span {
              width: 50px;
              height: 40px;
              display: block;
              border-right: solid rgba(255, 255, 255, 1) 1px;
              position: absolute;
              top: 50%;
              right: 0;
              transform: translate(0, -50%);
            }
          }

          input {
            width: 270px;
            font-size: 28px;
            font-weight: 300;
            border: 0;
            font-family: Light, sans-serif;
            border-style: none none solid none;
            background-color: transparent;
            border: 0;
            outline: none;
            padding-left: 15px;
            color: rgba(255, 255, 255, 1);
          }
        }

        div,
          {
          width: 168px;
          height: 90px;
          line-height: 90px;
          text-align: center;
          border-radius: 10px;
          margin-left: 10px;
          font-family: Light, sans-serif;
        }

        .letter {
          text-align: center;
          border-radius: 10px;
          margin-left: 10px;
          font-family: Light, sans-serif;
          background: rgba(255, 255, 255, 1);
          font-size: 38px;
          letter-spacing: 5px;
        }

        .unsentMessage {
          background: linear-gradient(180deg, rgba(242, 242, 241, 1) 0%, rgba(189, 189, 189, 1) 100%);
          font-size: 26px;
          font-weight: 400;
          color: rgba(128, 128, 128, 1);
          font-family: Light, sans-serif;
          box-sizing: border-box;
        }

        .sendMessage {
          background: linear-gradient(180deg, rgba(253, 228, 192, 1) 0%, rgba(251, 207, 158, 1) 100%);
          border-radius: 10px;
          font-size: 26px;
          font-family: Regular, sans-serif;
          font-weight: 400;
          color: rgba(212, 19, 41, 1);
          box-sizing: border-box;
        }

      }

      .account-number {
        width: 566px;
        height: 90px;
        background: rgba(255, 255, 255, .2);
        /*opacity: 0.2;*/
        border-radius: 10px;
        display: flex;
        justify-content: flex-start;
        /*align-items: center;*/
        margin: 20px 0;

        .glyphicon-user {
          width: 80px;
          height: 100%;
          position: relative;
          /*margin-right: 15px;*/

          img {
            width: 28px;
            height: 48px;
            display: block;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }

          span {
            width: 50px;
            height: 40px;
            display: block;
            border-right: solid rgba(255, 255, 255, 1) 1px;
            position: absolute;
            top: 50%;
            right: 0;
            transform: translate(0, -50%);
          }
        }

        input {
          width: 450px;
          /*height: 80px;*/
          font-size: 28px;
          font-weight: 300;
          border: 0;
          font-family: Light, sans-serif;
          color: rgba(255, 255, 255, 1);
          border-style: none none solid none;
          background-color: transparent;
          border: 0;
          outline: none;
          padding-left: 15px;
        }
      }
    }
  }
}

::-webkit-input-placeholder {
  /* WebKit browsers */
  color: rgba(255, 255, 255, 1);
}

:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  color: rgba(255, 255, 255, 1);
}

::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: rgba(255, 255, 255, 1);
}

:-ms-input-placeholder {
  /* Internet Explorer 10+ */
  color: rgba(255, 255, 255, 1);
}

.invalid:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  color: #333;
}

.invalid::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: #333;
}

input.invalid:-ms-input-placeholder {
  color: #333;
}

input.invalid::-webkit-input-placeholder {
  color: #333;
}

.defaultColor {
  color: rgba(255, 255, 255, 1);
}

.errorColor {
  color: red;
}

</style>
