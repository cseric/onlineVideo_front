<template>
  <el-container>
    <el-header>
      <div class="header-title">
        <img class="header-logo" src='../assets/img/logo.png' alt="">
        <el-link :underline="false" @click="toHome"><span>在线视频分享平台</span></el-link>
      </div>
      <div class="search-box">
        <el-input v-model="keyword" placeholder="请输入搜索内容" clearable>
          <el-button slot="append" @click="toSearch"><i class="el-icon-search"></i></el-button>
        </el-input>
      </div>
      <div class="user-box">
        <el-dropdown placement="bottom">
          <div class="user-info">
            <el-avatar :src="$store.getters.avatar ? avtURL : defaultAvatar" fit="cover"></el-avatar>
            <span class="user-name">{{ username }}</span>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <el-link :underline="false" @click="toUserSpace"><i class="el-icon-house"></i>个人主页</el-link>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-link :underline="false" @click="toUserCenter"><i class="el-icon-user"></i>个人中心</el-link>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-link :underline="false" @click="toVideoManage"><i class="el-icon-video-play"></i>视频管理</el-link>
            </el-dropdown-item>
            <el-dropdown-item divided>
              <el-link :underline="false" @click="logoutConfirm"><i class="el-icon-switch-button"></i>退出登录</el-link>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <!--上传按钮-->
        <div class="user-item">
          <el-button @click="toUpload"><i class="el-icon-upload2"></i>上传</el-button>
        </div>
      </div>
    </el-header>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script>
import { avatarURL } from '@/utils/request'
import defaultAvatar from '@/assets/img/avatar.png'

export default {
  name: 'userLayout',
  data () {
    return {
      keyword: '',
      defaultAvatar
    }
  },
  computed: {
    avtURL () {
      return avatarURL + this.$store.getters.avatar
    },
    username () {
      return this.$store.getters.username
    },
    uid () {
      return this.$store.state.userInfo.id
    }
  },
  methods: {
    toHome () {
      this.keyword = ''
      this.$router.replace('/')
    },
    toUpload () {
      const { href } = this.$router.resolve({ path: '/upload' })
      window.open(href, '_blank')
    },
    toSearch () {
      if (this.keyword === '') {
        return this.$message.error('搜索内容不能为空')
      }
      this.$router.push({ path: '/search', query: { keyword: this.keyword } })
    },
    toUserSpace () {
      this.keyword = ''
      this.$router.push({ name: 'user_space', params: { uid: String(this.uid) } })
    },
    toUserCenter () {
      this.keyword = ''
      this.$router.push('/user/center')
    },
    toVideoManage () {
      const { href } = this.$router.resolve({ path: '/video/upload' })
      window.open(href, '_blank')
    },
    logoutConfirm () {
      this.$confirm('确定要退出吗？', '提示', {
        confirmButtonText: '残忍离开',
        cancelButtonText: '我再想想',
        type: 'info'
      }).then(() => {
        this.$store.commit('removeUserInfo')
        this.$store.commit('removeToken')
        this.$router.replace('/login')
      }).catch((err) => err)
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
  max-width: 2560px;
  .el-header {
    min-width: 1120px;
    background-color: #f1f2f6;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .header-title {
      .el-link span {
        font-size: 24px;
        font-weight: 650;
        color: #1e90ff;
        vertical-align: middle;
      }
    }
    .header-logo {
      width: 30px;
      margin-right: 5px;
      vertical-align: middle;
    }
    .search-box {
      width: 375px;
    }
    .user-box {
      display: flex;
      align-items: center;
      height: 60px;
      .user-info {
        display: flex;
        align-items: center;
        cursor: pointer;
        &:hover>.user-name {
          color: #1e90ff;
        }
        .user-name {
          font-size: 18px;
          margin-left: 5px;
          color: #333;
        }
      }
      .user-item {
        margin-left: 30px;
        .el-button {
          background-color: #1e90ff;
          color: #f1f2f6;
        }
      }
    }
  }
  .el-main {
    min-width: 1120px;
    background: url('../assets/img/bg.png') center no-repeat;
    padding: 0;
    overflow-x: hidden;
  }
}
</style>
