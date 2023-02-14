<template>
  <div class="user-container">
    <div class="user-body">
      <div class="user-content">
        <div class="flex user-box">
          <div class="user-info">
            <el-avatar :size="100" :src="this.userInfo.avatar ? avatarPath : defaultAvatar"></el-avatar>
            <div class="user-detail">
              <span class="user-name">{{ userInfo.username }} <i :class="gender"></i></span>
              <span class="user-sign">{{ userInfo.sign }}</span>
            </div>
          </div>
          <div class="follow-area">
            <span>{{ followCount }} 关注</span>
            <el-divider direction="vertical"></el-divider>
            <span>{{ fansCount }} 粉丝</span>
            <el-button v-if="!follow" type="primary" @click="followUser">关注</el-button>
            <el-button v-else type="info" @click="unFollowUser">已关注</el-button>
          </div>
        </div>
        <el-menu :default-active="$route.path" class="el-menu-demo" mode="horizontal" router>
          <el-menu-item v-for="item in navList" :index="item.path" :key="item.path">{{ item.title }}</el-menu-item>
        </el-menu>
        <div>
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getUserInfoAPI } from '@/api/user'
import { followAPI, getFollowDataAPI, getFollowStatusAPI, unFollowAPI } from '@/api/follow'
import { avatarURL } from '@/utils/request'
import defaultAvatar from '@/assets/img/avatar.png'

export default {
  name: 'userSpace',
  async created () {
    await this.getUserInfo(this.$route.params.uid)
    await this.getFollowStatus(this.$route.params.uid)
    await this.getFollowData(this.$route.params.uid)
  },
  computed: {
    avatarPath () {
      return this.avatarURL + this.userInfo.avatar
    },
    gender () {
      return this.showGender()
    }
  },
  data () {
    return {
      userInfo: {},
      follow: false,
      followCount: 0,
      fansCount: 0,
      avatarURL,
      defaultAvatar,
      navList: [
        { path: '/user/' + this.$route.params.uid + '/video', title: '视频' },
        { path: '/user/' + this.$route.params.uid + '/collect', title: '收藏' },
        { path: '/user/' + this.$route.params.uid + '/follow', title: '关注' },
        { path: '/user/' + this.$route.params.uid + '/fans', title: '粉丝' }
      ]
    }
  },
  methods: {
    async getUserInfo (uid) {
      const { data: res } = await getUserInfoAPI(uid)
      if (res.code !== 2000) return this.$message.error(res.msg)
      this.userInfo = res.data.userInfo
    },
    async getFollowStatus (fid) {
      if (fid === this.$store.state.userInfo.id) {
        return
      }
      const { data: res } = await getFollowStatusAPI(fid)
      if (res.code === 2000) {
        this.follow = res.data.follow
      }
    },
    async getFollowData (uid) {
      const { data: res } = await getFollowDataAPI(uid)
      if (res.code === 2000) {
        this.followCount = res.data.follow
        this.fansCount = res.data.fans
      }
    },
    showGender () {
      const gender = this.userInfo.gender
      switch (gender) {
        case 0:
          return ''
        case 1:
          return 'el-icon-male blue-icon'
        case 2:
          return 'el-icon-female red-icon'
      }
    },
    async followUser () {
      if (this.userInfo.id === this.$store.state.userInfo.id) {
        return this.$message.error('不能对自己进行操作')
      }
      const { data: res } = await followAPI(this.userInfo.id)
      if (res.code !== 2000) return this.$message.error(res.msg)
      this.$message.success(res.msg)
      await this.getFollowStatus(this.userInfo.id)
      await this.getFollowData(this.userInfo.id)
    },
    async unFollowUser () {
      const { data: res } = await unFollowAPI(this.userInfo.id)
      if (res.code !== 2000) return this.$message.error(res.msg)
      this.$message.success(res.msg)
      await this.getFollowStatus(this.userInfo.id)
      await this.getFollowData(this.userInfo.id)
    }
  }
}
</script>

<style lang="less" scoped>
.user-container {
  max-width: 2560px;
  height: 100%;
  .user-body {
    width: 1000px;
    height: 100%;
    margin: 0 auto;
    padding: 0 80px;
    background-color: #FFF;
  }
  .flex {
    display: flex;
    justify-content: space-between;
    .follow-area {
      display: flex;
      align-items: center;
      font-size: 14px;
      .el-button {
        margin-left: 20px;
      }
      span {
        color: #999;
      }
    }
  }
  .user-box {
    height: 120px;
    padding: 15px 0;
  }
  //.user-content {
  //  margin-top: 30px;
  //}
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
  }
  .el-menu {
    margin-top: 10px;
    .el-menu-item {
      font-size: 16px;
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
