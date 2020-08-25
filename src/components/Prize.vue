<template>
  <div class="Prize">
    <div>
      <img :src="src" alt="奖品">
    </div>
    <div>
      <h3>{{content}}</h3>
      <div class="exchange">
        <div class="changeButton" @touchend="exchangeAction()">立即兑换奖品</div>
      </div>
      <div class="replenish">
        <div class="footer-box">
          <p v-if="params.type === 'coupon'">您也可以在“长城炼金术APP”“我的”页面-活动奖品中查看您的奖品</p>
          <p v-else>您也可以在“长城炼金术APP-积分商城-积分明细”中查看您的奖品</p>
          <span>长城证券客服热线 95514</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { initSensors, trackEvent } from '@/utils/sensor.js' // 引入神策

const prizeArr = ['5', '10', '50', 'a', 'x']
var srcArr = [
  require('@/assets/image/Myprize/JDfive.png'),
  require('@/assets/image/Myprize/JDten.png'),
  require('@/assets/image/Myprize/JDhundred.png'),
  require('@/assets/image/Myprize/iqiyi.png'),
  require('@/assets/image/Myprize/starbucks.png'),
  require('@/assets/image/Myprize/integral.png')
]

export default {
  name: 'Prize',
  props: {
    params: {
      type: Object,
      default: () => { return {} }
    }
  },
  data() {
    return {
      prizeArr,
      srcArr,
      src: '',
      content: ''
    }
  },
  watch: {
    params() {
      this.paramsAction()
    }
  },
  mounted() {
    initSensors()
    this.paramsAction()
  },
  methods: {
    exchangeAction() {
      function timeout1(ms) {
        return new Promise(resolve => {
          trackEvent('ActClick', {
            ActButtonName: '立即兑换奖品'
          })
          setTimeout(resolve, ms)
        })
      }
      timeout1(500).then(() => {
        window.location.href = 'https://fintechapp.cgws.com/h5/downloadA/newone/'
      })
      // setTimeout(() => {
      //   window.location.href = 'https://fintechapp.cgws.com/h5/downloadA/newone/'
      // }, 500)
    },
    paramsAction() {
      const { type, form } = this.params
      if (type === 'coupon') {
        const indexs = this.prizeArr.indexOf(form)
        if (indexs < 3) {
          this.content = `京东商城购物券${form}元`
        } else if (indexs === 3) {
          this.content = '爱奇艺月卡'
        } else {
          this.content = '星巴克35元兑换券'
        }
        this.src = this.srcArr[indexs]
      } else {
        this.content = `${form}积分`
        this.src = this.srcArr[this.srcArr.length - 1]
      }
    }
  }
}

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.Prize {
  width: 100%;
  height: 100%;

  div:first-child {
    width: 100%;
    height: 32.5%;
    background: rgba(255, 255, 255, 1);
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      width: 750px;
      height: 418px;
    }
  }

  div:last-child {
    width: 100%;
    height: 67.5%;
    background-color: #A31929;

    h3 {
      width: 88%;
      height: 21.4%;
      display: flex;
      align-items: center;
      font-size: 37px;
      font-family: Medium, sans-serif;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
      padding-left: 12%;
      box-sizing: border-box;
    }

    .exchange {
      width: 100%;
      height: 63.6%;
      display: flex;
      justify-content: center;
      align-items: flex-end;

      .changeButton {
        width: 654px;
        height: 105px;
        background: linear-gradient(180deg, rgba(254, 230, 196, 1) 0%, rgba(251, 205, 155, 1) 100%);
        border-radius: 53px;
        font-size: 45px;
        font-family: Medium, sans-serif;
        font-weight: 500;
        color: rgba(212, 19, 41, 1);
        cursor: pointer;
        margin-bottom: 10px;
      }
    }

    .replenish {
      height: 15%;
      text-align: center;
      font-size: 24px;
      font-family: Light, sans-serif;
      font-weight: 300;
      position: relative;

      .footer-box {
        width: 100%;
        position: absolute;
        bottom: 0;
        left: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 0 0 25px 0;
        box-sizing: border-box;

        p {
          color: rgba(255, 255, 255, 1);
          line-height: 35px;
        }

        span {
          display: block;
          color: rgba(249, 154, 165, 1);
          line-height: 50px;
        }
      }
    }
  }
}

</style>
