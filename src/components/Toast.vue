<!-- 弹出层组件 -->
<template>
  <div class="toast" v-if="contentObj.isShow">
    <div class="toastBox">{{contentObj.content}}</div>
  </div>
</template>
<script>
export default {
  props: {
    contentObj: {
      type: Object,
      default: () => { return {} }
    }
  },
  name: 'toast'
}

</script>
<style scoped lang="scss">
.toast {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  /*opacity: 0.8;*/
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;

  .toastBox {
    padding: 20px;
    background-color: rgba(58, 58, 58, .9);
    font-size: 25px;
    color: #fff;
    border-radius: 5px;
    /*font-family: Light, sans-serif;*/
  }
}

</style>
