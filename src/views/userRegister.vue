<template>
  <el-container>
    <el-header>
      <div class="header-title">
        <img class="header-logo" src='../assets/img/logo.png' alt="">
        <span>在线视频分享平台</span>
      </div>
    </el-header>
    <el-main>
      <div class="register-box">
        <div class="register-title">
          <span>注册 | 欢迎你的加入</span>
        </div>
        <el-form ref="registerRef" :model="registerForm" :rules="registerRules" size="large">
          <el-form-item prop="username">
            <el-input v-model="registerForm.username" prefix-icon="el-icon-user" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="registerForm.password" prefix-icon="el-icon-key" placeholder="请输入密码" show-password></el-input>
          </el-form-item>
          <el-form-item prop="repassword">
            <el-input v-model="registerForm.repassword" prefix-icon="el-icon-key" placeholder="请再次输入密码" show-password></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="register-btn" @click="registerValidate">注册</el-button>
            <el-link type="primary" :underline="false" @click="toLogin">前去登录</el-link>
          </el-form-item>
        </el-form>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import { checkNameAPI, registerAPI } from '@/api/user'

export default {
  name: 'userRegister',
  data () {
    const rePwdCheck = (rule, value, callback) => {
      if (value !== this.registerForm.password) {
        return callback(new Error('确认密码与密码不一致'))
      }
      callback()
    }
    const usernameCheck = async (rule, value, callback) => {
      const { data: res } = await checkNameAPI(this.registerForm.username)
      if (res.code !== 2000) {
        return callback(new Error(res.msg))
      }
      if (res.data.isExist) {
        return callback(new Error('用户名已存在'))
      } else {
        callback()
      }
    }
    return {
      registerForm: {
        username: '',
        password: '',
        repassword: ''
      },
      registerRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, message: '用户名至少3个字', trigger: 'blur' },
          { validator: usernameCheck, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码至少6位', trigger: 'blur' }
        ],
        repassword: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { validator: rePwdCheck, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    registerValidate () {
      this.$refs.registerRef.validate(async valid => {
        if (!valid) return false
        const { data: res } = await registerAPI(this.registerForm)
        if (res.code !== 2000) return this.$message.error(res.msg)
        this.$message.success(res.msg)
        await this.$router.replace('/login')
      })
    },
    toLogin () {
      this.$router.replace('/login')
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
  background: url('../assets/img/bg.png') center no-repeat;
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
    .register-box {
      align-self: center;
      width: 375px;
      height: 400px;
      padding: 10px 30px;
      border: 1px solid #ddd;
      border-radius: 5px;
      background-color: #FFF;
      .register-title {
        height: 60px;
        text-align: center;
        padding: 15px 0;
        font-size: 24px;
        color: #2f3542;
      }
      .el-form {
        .register-btn {
          width: 100%;
        }
        .el-link {
          width: 100%;
        }
      }
    }
  }
}
</style>
