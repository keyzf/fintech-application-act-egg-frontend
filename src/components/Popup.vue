<!-- 弹出层组件 -->
<template>
  <div class="popContainer" v-if="isShow">
    <div class="popuping">
      <!-- 中奖弹窗 -->
      <template v-if="data.isBoolear">
        <div class="popupAward">
          <p class="congratulate">恭喜您 中奖啦!</p>
          <div class="goods"><img id="img" :class="[isIntegral ? 'circleGoods' : 'frameGoods']" :src="src"></div>
          <p class="describe">{{content}}</p>
          <p class="explain">{{explain}}</p>
          <div class="result" @touchend="knowAction">我知道了</div>
        </div>
      </template>
      <!-- 机会用完弹窗 -->
      <template v-if="!data.isBoolear">
        <div class="popupFinish">
          <div class="finishBox">
            <div class="finishImg">
              <img src="../assets/image/Popup/empty.png" alt="已经参与活动了~">
            </div>
            <div class="declare">
              <p>您已参与活动，</p>
              <p>立即前往{{data.channel === 'gold' ? '\"我的奖品\"' : '长城炼金术'}}查看获奖情况吧~</p>
            </div>
            <div class="confirm">
              <div @touchend="knowAction">我知道了</div>
            </div>
          </div>
        </div>
      </template>
      <div class="buttonBox">
        <div class="circle" @touchend="closeAction"></div>
      </div>
    </div>
  </div>
</template>
<script>
import { getUrlKey } from '@/utils/common.js'
var prizeArr = ['5', '10', '50', 'a', 'x']
var srcArr = [
  require('@/assets/image/Popup/five.png'),
  require('@/assets/image/Popup/ten.png'),
  require('@/assets/image/Popup/hundred.png'),
  require('@/assets/image/Popup/iqiyi.png'),
  require('@/assets/image/Popup/tencent.png'),
  require('@/assets/image/Popup/integral.png')
]
export default {
  name: 'PopContainer',
  props: {
    isShow: {
      type: Boolean,
      default: () => { return false }
    },
    data: {
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
      isIntegral: false

    }
  },
  computed: {
    channel() {
      const isChannel = this.$store.getters.channel ? this.$store.getters.channel : getUrlKey('channel')
      return isChannel
    }
  },
  watch: {
    data() {
      this.PrizeAction()
    }
  },
  mounted() {
    this.PrizeAction()
  },
  methods: {
    closeAction() {
      this.$emit('isShowAction', !this.isShow)
    },
    knowAction() {
      this.$router.push({ name: 'myPrize', query: { channel: this.channel } })
      this.$emit('isShowAction', !this.isShow)
    },
    PrizeAction() {
      if (this.data.isBoolear) {
        const { channel, type, form } = this.data
        if (type === 3) {
          const index = this.prizeArr.indexOf(form)
          if (index < 3) {
            this.content = `京东商城购物券${form}元`
          } else if (index === 3) {
            this.content = '爱奇艺月卡'
          } else {
            this.content = '星巴克35元兑换券'
          }
          this.src = this.srcArr[index]
        } else {
          this.isIntegral = true
          this.content = `${form}积分`
          this.src = this.srcArr[this.srcArr.length - 1]
          if (channel === 'gold') {
            this.explain = '前往我的奖品查看'
          } else {
            if (type === 2) {
              this.explain = '前往我的奖品查看'
            } else {
              this.explain = '前往长城炼金术-我的奖品查看卡号卡密！'
            }
          }
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
  }
}

</script>
<style scoped lang="scss">
.popContainer {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, .8);
  /*opacity: 0.8;*/
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;

  .popuping {
    width: 82%;
    height: 670px;

    .popupFinish {
      width: 100%;
      height: 570px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 15px;

      .finishBox {
        width: 455px;
        height: 505px;
        background: rgba(253, 247, 242, 1);
        border-radius: 20px;
        padding-top: 20px;
        margin-bottom: 13px;

        .finishImg {
          width: 100%;
          height: 293px;
          display: flex;
          justify-content: center;
          align-items: center;

          img {
            display: block;
            width: 358px;
            height: 243px;
          }
        }

        .declare {
          p {
            color: #E2112C;
            text-align: center;
          }

          p:first-child {
            font-size: 30px;
            line-height: 50px
          }

          p:last-child {
            font-size: 15px;
            line-height: 32px;
          }
        }

        .confirm {
          width: 100%;
          height: 130px;
          display: flex;
          justify-content: center;
          /*align-items: center;*/
          padding-top: 22px;

          div {
            width: 413px;
            height: 75px;
            line-height: 75px;
            background: linear-gradient(0deg, rgba(252, 206, 157, 1) 0%, rgba(253, 229, 195, 1) 100%);
            border-radius: 38px;
            font-size: 38px;
            font-family: Medium, sans-serif;
            font-weight: 500;
            color: rgba(212, 19, 41, 1);
            text-align: center;
          }
        }
      }
    }

    .popupAward {
      width: 100%;
      height: 570px;
      background: url('../assets/image/Popup/popup.png') no-repeat;
      background-size: 100% 100%;
      position: relative;

      .congratulate {
        /*height: 24px;*/
        text-align: center;
        font-size: 25px;
        font-family: Regular, sans-serif;
        font-weight: 500;
        color: rgba(226, 17, 44, 1);
        line-height: 50px;
        /*letter-spacing: 1px;*/
        height: 100px;
        line-height: 102px;
      }

      .goods {
        width: 100%;
        height: 56px;
        display: flex;
        justify-content: center;

        img {
          display: block;
        }

        .circleGoods {
          width: 60px;
          height: 60px;
        }

        .frameGoods {
          width: 95px;
          height: 55px;
        }
      }

      .describe {
        font-size: 28px;
        font-family: Medium, sans-serif;
        font-weight: 500;
        color: rgba(226, 17, 44, 1);
        text-align: center;
        line-height: 94px;
      }

      .explain {
        width: 100%;
        height: 60px;
        line-height: 60px;
        text-align: center;
        font-size: 22px;
        font-family: Regular, sans-serif;
        font-weight: 400;
        color: rgba(155, 155, 155, 1);
        transform: scale(0.9);
      }

      .result {
        width: 413px;
        height: 75px;
        line-height: 75px;
        background: linear-gradient(0deg, rgba(252, 206, 157, 1) 0%, rgba(253, 229, 195, 1) 100%);
        border-radius: 38px;
        position: absolute;
        top: 390px;
        left: 50%;
        transform: translate(-50%, 0);
        font-size: 38px;
        font-family: Medium, sans-serif;
        font-weight: 500;
        color: rgba(212, 19, 41, 1);
        text-align: center;
      }
    }

    .buttonBox {
      width: 100%;
      height: 100px;
      display: flex;
      justify-content: center;

      .circle {
        width: 56px;
        height: 56px;
        border: 1px solid rgba(255, 255, 255, 1);
        border-radius: 50%;
        position: relative;
        /*background: url('../assets//image/Popup/close.png') no-repeat;
        background-size: 100% 100%;*/
      }

      .circle:before,
      .circle:after {
        position: absolute;
        left: 28px;
        top: 8px;
        content: ' ';
        height: 40px;
        width: 1.5px;
        background-color: #fff;
      }

      .circle:before {
        transform: rotate(45deg);
      }

      .circle:after {
        transform: rotate(-45deg);
      }
    }
  }
}

</style>
