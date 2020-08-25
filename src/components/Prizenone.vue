<!-- 我的奖品中未中奖组件 -->
<template>
  <div class="Prizenone">
    <div class="prizeNoneImg"></div>
    <div class="content">
      <span>您暂未获得奖品</span>
      <span>快来参与活动获得更多奖励吧</span>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Prizenone'
}

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.Prizenone {
  width: 100%;
  height: 100%;
  background-color: #A31929;
  padding-top: 155px;

  .prizeNoneImg {
    width: 100%;
    height: 220px;
    background: url('../assets/image/Myprize/empty.png') no-repeat;
    background-size: 100% 100%;
    margin-bottom:30px;
  }

  .content {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    span {
      font-size: 24px;
      font-family: Light, sans-serif;
      font-weight: 300;
      color: rgba(255, 255, 255, 1);
      line-height: 48px;
    }
  }

}

</style>
