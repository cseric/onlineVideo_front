<template>
  <div class="center-container">
    <div class="center-body">
      <div class="center-title">
        <span>个人中心</span>
      </div>
      <!--个人信息卡片区域-->
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <span>个人信息</span>
        </div>
        <div class="flex">
          <div class="user-info">
            <el-avatar :src="avatar" :size="100"></el-avatar>
            <div class="user-detail">
              <span class="user-name">{{ username }} <i :class="gender"></i></span>
              <span class="user-sign">{{ sign }}</span>
            </div>
          </div>
          <div class="modify-info">
            <el-button type="primary" size="medium" @click="showInfo"><i class="el-icon-edit"></i> 修改信息</el-button>
            <el-button size="medium" @click="updateAvatarVisible=true"><i class="el-icon-picture-outline"></i> 修改头像</el-button>
          </div>
        </div>
      </el-card>
      <!--账号安全卡片区域-->
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <span>账号安全</span>
        </div>
        <el-button type="danger" size="medium" @click="updatePassVisible=true"><i class="el-icon-key"></i> 修改密码</el-button>
      </el-card>
    </div>
    <!--修改密码对话框-->
    <el-dialog width="500px" title="修改密码" :visible.sync="updatePassVisible" :before-close="resetPass">
      <el-form ref="updatePassRef" :model="updatePassForm" :rules="updatePassRules" label-width="80px">
        <el-form-item label="原密码" prop="oldPassword">
          <el-input v-model="updatePassForm.oldPassword" show-password></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="updatePassForm.newPassword" show-password></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="rePassword">
          <el-input v-model="updatePassForm.rePassword" show-password></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelPass">取消</el-button>
        <el-button type="primary" @click="updatePass">修改</el-button>
      </div>
    </el-dialog>
    <!--修改头像对话框-->
    <el-dialog title="修改头像" :visible.sync="updateAvatarVisible" width="400px" :before-close="resetAvatar">
      <div>
        <input type="file" accept="image/jpeg,image/png" style="display: none" ref="avatarRef" @change="onAvatarChange"/>
        <div v-if="!avtURL" style="height: 270px; text-align: center; line-height: 270px; border: 1px dashed #ddd;">请选择头像</div>
        <img v-else :src="avtURL" alt="" style="width: 100%;"/>
        <el-link style="margin-top: 10px;" type="primary" :underline="false" @click="selectAvatar">选择头像</el-link>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelAvatar">取消</el-button>
        <el-button type="primary" @click="updateAvatar">上传头像</el-button>
      </span>
    </el-dialog>
    <!--修改信息对话框-->
    <el-dialog title="修改信息" :visible.sync="updateInfoVisible" width="500px" :before-close="resetInfo">
      <el-form ref="updateInfoRef" :model="updateInfoForm" :rules="updateInfoRules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="updateInfoForm.username"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="updateInfoForm.gender">
            <el-option v-for="item in genderList"
                       :key="item.gender"
                       :label="item.gender"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="个性签名" prop="sign">
          <el-input v-model="updateInfoForm.sign" maxlength="30" show-word-limit></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelInfo">取消</el-button>
        <el-button type="primary" @click="updateInfo">修改</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { avatarURL } from '@/utils/request'
import { initUserInfoAPI, updatePassAPI, updateUserInfoAPI, uploadAvatarAPI } from '@/api/user'
import defaultAvatar from '@/assets/img/avatar.png'

export default {
  name: 'userCenter',
  data () {
    const rePwdCheck = (rule, value, callback) => {
      if (value !== this.updatePassForm.newPassword) {
        return callback(new Error('输入的密码与新密码不一致'))
      }
      callback()
    }
    return {
      avtURL: '',
      updatePassVisible: false,
      updateAvatarVisible: false,
      updateInfoVisible: false,
      defaultAvatar,
      genderList: [
        { gender: '保密', value: 0 },
        { gender: '男', value: 1 },
        { gender: '女', value: 2 }
      ],
      updatePassForm: {
        oldPassword: '',
        newPassword: '',
        rePassword: ''
      },
      updateInfoForm: {
        username: '',
        gender: 0,
        sign: ''
      },
      updatePassRules: {
        oldPassword: [
          { required: true, message: '请输入原密码', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, message: '密码至少6位', trigger: 'blur' }
        ],
        rePassword: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { validator: rePwdCheck, trigger: 'blur' }
        ]
      },
      updateInfoRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        gender: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ],
        sign: [
          { max: 30, message: '个性签名最多50字', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    username () {
      return this.$store.getters.username
    },
    avatar () {
      return this.$store.getters.avatar === '' || this.$store.getters.avatar === undefined ? defaultAvatar : avatarURL + this.$store.getters.avatar
    },
    sign () {
      return this.$store.getters.sign
    },
    gender () {
      return this.showGender()
    }
  },
  methods: {
    // 以图标形式显示性别
    showGender () {
      const gender = this.$store.getters.gender
      switch (gender) {
        case 0:
          return ''
        case 1:
          return 'el-icon-male blue-icon'
        case 2:
          return 'el-icon-female red-icon'
      }
    },
    // 重置修改密码对话框
    resetPass (done) {
      this.$refs.updatePassRef.resetFields()
      done()
    },
    // 取消修改密码
    cancelPass () {
      this.$refs.updatePassRef.resetFields()
      this.updatePassVisible = false
    },
    // 修改密码
    updatePass () {
      this.$refs.updatePassRef.validate(async valid => {
        if (!valid) return false
        const { data: res } = await updatePassAPI(this.updatePassForm)
        if (res.code !== 2000) return this.$message.error(res.msg)
        this.cancelPass()
        this.$message.warning('密码已修改，请重新登录')
        this.$store.commit('removeUserInfo')
        this.$store.commit('removeToken')
        await this.$router.replace('/login')
      })
    },
    // 选择封面
    selectAvatar () {
      this.$refs.avatarRef.click()
    },
    // 取消修改头像
    cancelAvatar () {
      this.$refs.avatarRef.value = ''
      this.avtURL = ''
      this.updateAvatarVisible = false
    },
    // 重置修改头像对话框
    resetAvatar (done) {
      this.$refs.avatarRef.value = ''
      this.avtURL = ''
      done()
    },
    // 显示待上传的头像
    onAvatarChange (e) {
      const files = e.target.files
      if (files.length === 0) {
        this.avtURL = ''
      } else {
        const fileReader = new FileReader()
        fileReader.readAsDataURL(files[0])
        fileReader.onload = e => {
          this.avtURL = e.target.result
        }
      }
    },
    // 修改头像
    async updateAvatar () {
      const avatar = this.$refs.avatarRef.files[0]
      if (avatar == null) {
        return this.$message.error('请先选择图片')
      }
      if (avatar.size / 1024 / 1024 >= 5) {
        return this.$message.error('上传的头像大小不能超过5M')
      }
      const formData = new FormData()
      formData.append('avatar', avatar)
      const { data: res } = await uploadAvatarAPI(formData)
      if (res.code !== 2000) return this.$message.error(res.msg)
      this.$message.success(res.msg)
      await this.getUserInfo()
      this.cancelAvatar()
    },
    // 获取用户信息
    async getUserInfo () {
      const { data: res } = await initUserInfoAPI()
      if (res.code === 2000) {
        this.$store.commit('updateUserInfo', res.data.userInfo)
      }
    },
    cancelInfo () {
      this.$refs.updateInfoRef.resetFields()
      this.updateInfoVisible = false
    },
    resetInfo (done) {
      this.$refs.updateInfoRef.resetFields()
      done()
    },
    showInfo () {
      this.getUserInfo()
      this.updateInfoVisible = true
      this.$nextTick(() => {
        this.updateInfoForm.username = this.$store.getters.username
        this.updateInfoForm.gender = this.$store.getters.gender
        this.updateInfoForm.sign = this.$store.getters.sign
      })
    },
    updateInfo () {
      this.$refs.updateInfoRef.validate(async valid => {
        if (!valid) return false
        const { data: res } = await updateUserInfoAPI(this.updateInfoForm)
        if (res.code !== 2000) return this.$message.error(res.msg)
        this.$message.success(res.msg)
        await this.getUserInfo()
        this.cancelInfo()
      })
    }
  }
}
</script>

<style lang="less" scoped>
.center-container {
  max-width: 2560px;
  height: 100%;
  margin: 0 auto;
  padding: 0 80px;
  .center-body {
    width: 1000px;
    margin: 20px auto;
    padding: 10px 30px;
  }
  .center-title {
    height: 40px;
    line-height: 40px;
    font-size: 20px;
    color: #f1f2f6;
  }
  .flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .el-card {
    margin-top: 30px;
  }

  .user-info {
    display: flex;
    align-items: center;

    .user-detail {
      display: flex;
      flex-direction: column;
      margin-left: 15px;

      .user-name {
        font-size: 24px;
        color: #2f3542;
      }

      .user-sign {
        font-size: 13px;
        color: #999;
      }
    }
  .modify-info {
    display: flex;
    align-items: center;
  }
  }
  .blue-icon {
    color: #70a1ff;
    font-size: 18px;
  }
  .red-icon {
    color: #ff4757;
    font-size: 18px;
  }
}
</style>
