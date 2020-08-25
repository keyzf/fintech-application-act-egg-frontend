<template>
  <div class="Myprize">
    <prize v-if="index === 1" :params="params"></prize>
    <prizenone v-if="index === 2"></prizenone>
    <alchemy v-if="index === 3" :params="params"></alchemy>
  </div>
</template>
<script>
import Prize from '@/components/Prize.vue'
import Prizenone from '@/components/Prizenone.vue'
import Alchemy from '@/components/Alchemy.vue'
import { getMyPrizeAction } from '@/api/index'
import { getSendParams, getUrlKey } from '@/utils/common.js'
export default {
  name: 'Myprize',
  components: { Prize, Prizenone, Alchemy },
  data() {
    return {
      index: 0,
      params: {}
    }
  },
  computed: {
    channel() {
      const isChannel = this.$store.getters.channel ? this.$store.getters.channel : getUrlKey('channel')
      return isChannel
    }
  },
  mounted() {
    this.getMyPrize()
  },
  methods: {
    getMyPrize() {
      getMyPrizeAction({ channel: this.channel }).then(res => {
        const data = res.data
        if (data instanceof Array) {
          this.index = 2
        } else {
          if (data.type === 3 && this.channel !== 'gold') {
            // 卡券
            this.index = 1
            this.params = {
              type: 'coupon',
              form: data.name.toString()
            }
          } else if (this.channel === 'gold') {
            this.index = 3
            if (data.type === 3) {
              this.params = {
                type: data.type,
                form: data.name.toString(),
                card: data.card,
                card_password: data.card_password,
                time: data.time
              }
            } else {
              this.params = {
                type: data.type,
                form: data.name.toString(),
                time: data.time
              }
            }
          } else {
            // 积分
            this.index = 1
            this.params = {
              type: 'integral',
              form: data.name.toString()
            }
          }
        }
      })
    }
  }
}

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.Myprize {
  width: 100%;
  height: 100%;
}

</style>
