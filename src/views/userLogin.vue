<template>
  <el-container>
    <el-header>
      <div class="header-title">
        <img class="header-logo" src='../assets/img/logo.png' alt="">
        <span>在线视频分享平台</span>
      </div>
    </el-header>
    <el-main>
      <div class="login-box">
        <div class="login-title">
          <span>登录 | 欢迎使用</span>
        </div>
        <el-form ref="loginRef" :model="loginForm" :rules="loginRules" size="large">
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" prefix-icon="el-icon-user" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="loginForm.password" prefix-icon="el-icon-key" placeholder="请输入密码" show-password></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="login-btn" @click="loginValidate">登 录</el-button>
            <el-link type="primary" :underline="false" @click="toRegister">立即注册</el-link>
          </el-form-item>
        </el-form>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import { loginAPI } from '@/api/user'

export default {
  name: 'userLogin',
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    loginValidate () {
      this.$refs.loginRef.validate(async valid => {
        if (!valid) return false
        const { data: res } = await loginAPI(this.loginForm)
        if (res.code !== 2000) return this.$message.error(res.msg)
        this.$message.success(res.msg)
        this.$store.commit('updateToken', res.data.token)
        this.$store.commit('updateUserInfo', res.data.userInfo)
        await this.$router.replace('/')
      })
    },
    toRegister () {
      this.$router.replace('/register')
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
  background: url('../assets/img/bg.png') center no-repeat;
  //background-size: cover;
  //min-width: 1120px;
  .el-header {
    background-color: #f1f2f6;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .header-title {
      font-size: 24px;
      font-weight: 650;
      color: #1e90ff;
      span {
        vertical-align: middle;
      }
    }
    .header-logo {
      width: 30px;
      margin-right: 5px;
      vertical-align: middle;
    }
  }
  .el-main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    .login-box {
      align-self: center;
      width: 375px;
      height: 400px;
      padding: 10px 30px;
      border: 1px solid #ddd;
      border-radius: 5px;
      background-color: #FFF;
      .login-title {
        height: 60px;
        text-align: center;
        padding: 15px 0;
        font-size: 24px;
        color: #2f3542;
      }
      .el-form {
        .login-btn {
          width: 100%;
          font-size: 16px;
          margin-top: 10px;
        }
        .el-link {
          width: 100%;
        }
      }
    }
  }
}
</style>
