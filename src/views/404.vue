<template>
  <div class="page-container">
    <div class="page-body">
      <div class="page-box">
        <h1>404</h1>
        <el-button type="primary" @click="toHome">返回主页</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ErrPage404',
  methods: {
    toHome () {
      this.$router.replace('/').catch((err) => err)
    }
  }
}
</script>

<style lang="less" scoped>
.page-container {
  height: 100%;
  max-width: 2560px;
  background: url('../assets/img/bg.png') center no-repeat;
  .page-body {
    height: 100%;
    min-width: 1120px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .page-box {
    text-align: center;
    h1 {
      font-size: 120px;
      color: #f1f2f6;
    }
  }
}
</style>
