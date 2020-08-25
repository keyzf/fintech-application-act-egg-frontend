<template>
  <div class="Alchemy">
    <Toast :contentObj="contentObj" />
    <div class="wrap" v-if="params.type !== 3">
      <div class="content">
        <div class="left">
          <img src="../assets/image/Popup/integral.png" />
        </div>
        <div class="line"></div>
        <div class="right">
          <div class="title">{{params.form}}积分</div>
          <div class="employ" @touchend="employAction">立即使用</div>
          <div class="footer">{{params.time}}</div>
        </div>
      </div>
    </div>
    <div class="wrap" v-if="params.type === 3">
      <div class="content">
        <div class="left">
          <img class="coupon" :src="src" alt="卡券奖品">
        </div>
        <div class="line"></div>
        <div class="right">
          <div class="title">{{content}}</div>
          <div class="item">
            <div class="title">卡券账户：</div>
            <div class="content">{{params.card}}</div>
            <div class="icon copy" @click="copyLink('卡券账户', params.card)"></div>
          </div>
          <div class="item">
            <div class="title">卡券密码：</div>
            <div class="content">{{params.card_password}}</div>
            <div class="icon copy" @click="copyLink('卡券密码', params.card_password)"></div>
          </div>
          <div class="footer">{{params.time}}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import envConfig from '@/env'
import Bridges from '@/utils/bridges.js'
import Clipboard from 'clipboard'
import Toast from './Toast.vue'
var prizeArr = ['5', '10', '50', 'a', 'x']
var srcArr = [
  require('@/assets/image/Popup/five.png'),
  require('@/assets/image/Popup/ten.png'),
  require('@/assets/image/Popup/hundred.png'),
  require('@/assets/image/Popup/iqiyi.png'),
  require('@/assets/image/Popup/tencent.png')
]
export default {
  name: 'Alchemy',
  components: { Toast },
  props: {
    params: {
      type: Object,
      default: () => { return {} }
    }
  },
  data() {
    return {
      content: '',
      explain: '',
      src: '',
      prizeArr,
      srcArr,
      contentObj: {
        content: '',
        isShow: false
      }
    }
  },
  mounted() {
    this.goldPrizeAction()
  },
  methods: {
    employAction() {
      const { hostname, port } = window.location
      let url
      if (port) {
        url = `https://${hostname}:8443/oss-points-mall/h5/index.html#/myIntegral`
      } else {
        url = `https://${hostname}/oss-points-mall/h5/index.html#/myIntegral`
      }
      const jumpUrl = {
        type: 'h5',
        h5Bean: {
          // url: 'https://stgfintech.cgws.com:8443/oss-points-mall/h5/index.html#/myIntegral',
          url: url,
          title: '砸金蛋活动'
        }
      }
      Bridges.jumpNative(JSON.stringify({ jumpUrl: jumpUrl }))
    },
    goldPrizeAction() {
      if (this.params.type === 3) {
        const { form } = this.params
        const index = this.prizeArr.indexOf(form)
        if (index < 3) {
          this.content = `京东商城购物券${form}元`
        } else if (index === 3) {
          this.content = '爱奇艺月卡'
        } else {
          this.content = '星巴克35元兑换券'
        }
        this.src = this.srcArr[index]
      }
    },
    copyLink(str, data) {
      const clipboard = new Clipboard('.content', {
        text: () => {
          return data
        }
      })
      clipboard.on('success', e => {
        this.toastAction(`${str}复制成功`)
        // 释放内存
        clipboard.destroy()
      })
      clipboard.on('error', e => {
        this.toastAction(`${str}复制失败`)
        clipboard.destroy()
      })
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
  }
}

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.Alchemy {
  /*width:100%;*/
  height: 100%;
  background-color: #A31929;
  /*padding: 10px;*/
  padding-top: 50px;
}

.wrap {
  /*width: 100%;*/
  width: 664px;
  margin: 0 auto;
  padding: 16px 0;
  position: relative;
  background-color: #fff;
  border-radius: 8px;
}

.wrap:before,
.wrap:after {
  content: '';
  display: block;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #A31929;
  position: absolute;
  left: 28.5%;
}

.wrap:before {
  top: -15px;
}

.wrap:after {
  bottom: -15px;
}

.wrap>.content {
  display: flex;
  align-items: center;
  position: relative;
}

.wrap>.content>.left {
  height: 100%;
  width: calc(28.5% + 14px);
  text-align: center;
  /*padding-right: 10px;*/
}

.line {
  /*height: 140px;*/
  position: absolute;
  top: 20px;
  bottom: 20px;
  left: calc(28.5% + 14px);
  border-right: 2px dashed rgba(239, 239, 239, 1);
}

.employ {
  width: 121px;
  height: 47px;
  line-height: 47px;
  background: linear-gradient(0deg, rgba(251, 206, 156, 1) 0%, rgba(254, 229, 194, 1) 100%);
  border-radius: 24px;
  text-align: center;
  font-size: 24px;
  font-family: Medium, sans-serif;
  font-weight: 500;
  color: rgba(226, 65, 83, 1);
  margin: 13px 0;
}

.wrap>.content>.left>img {
  width: 85px;
  height: 85px;
  display: inline-block;
  /*background-color: #ddd;*/
}

.wrap>.content>.left>.coupon {
  width: 130px;
  height: 80px;
  display: inline-block;
}

.wrap>.content>.right {
  box-sizing: border-box;
  width: calc(71.5% - 18px);
  padding: 0 10px 0 40px;
  flex: 0 0 auto;
  min-height: 158px;
  /*border-left: 2px dashed red;*/

}

.wrap>.content>.right>.title {
  padding: 8px 0 17px 0;
  font-size: 32px;
  font-family: Medium, sans-serif;
  font-weight: 400;
  color: rgba(255, 28, 54, 1);
}

.icon {
  width: 28px;
  height: 28px;
  background: url('../assets/image/Myprize/copy.png');
  background-size: 100% 100%;
}

.copy {
  margin-bottom: 5px;
}

.wrap>.content>.right>.footer {
  padding-top: 17px;
  font-size: 22px;
  font-family: Light, sans-serif;
  font-weight: 500;
  color: rgba(165, 165, 165, 1);
}

.wrap>.content>.right>.item {
  font-size: 23px;
  color: #C5C5C5;
  display: flex;
  align-items: flex-start;
  line-height: 1.3;
}

.wrap>.content>.right>.item>.title {
  font-weight: bold;
  width: 120px;
}

.wrap>.content>.right>.item>.content {
  word-break: break-all;
  flex: 1;
}

</style>
