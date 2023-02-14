<template>
  <div>
    <el-empty v-if="fansList.length === 0" description="暂无粉丝"></el-empty>
    <div v-else>
      <div class="fans-content">
        <div class="follow-list">
          <div v-for="item in fansList" :key="item.id" class="follow-item">
            <div class="follow-user">
              <el-avatar v-if="item.avatar === undefined || item.avatar === ''"
                         :size="50"
                         style="cursor: pointer;"
                         :src="defaultAvatar"
              ></el-avatar>
              <el-avatar v-else
                         :size="50"
                         :src="avatarURL+item.avatar"
                         style="cursor: pointer;"
              ></el-avatar>
              <div class="follow-info">
                <span class="user-name">{{ item.username }}</span>
                <span class="user-desc">{{ item.sign }}</span>
              </div>
            </div>
            <div class="follow-link">
              <el-link :underline="false" type="primary" @click="toUserSpace(item.id)">查看个人主页</el-link>
            </div>
          </div>
        </div>
      </div>
      <el-pagination
        background
        hide-on-single-page
        @current-change="handleCurrentChange"
        :current-page.sync="params.page"
        layout="total, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { avatarURL } from '@/utils/request'
import { getFansListAPI } from '@/api/follow'
import defaultAvatar from '@/assets/img/avatar.png'

export default {
  name: 'userFans',
  async created () {
    await this.getFansList(this.$route.params.uid)
  },
  data () {
    return {
      fansList: [],
      total: 0,
      params: {
        page: 1,
        pageSize: 10
      },
      avatarURL,
      defaultAvatar
    }
  },
  methods: {
    handleCurrentChange (newPage) {
      this.params.page = newPage
      this.getFansList(this.$route.params.uid)
    },
    async getFansList (uid) {
      const { data: res } = await getFansListAPI({ uid: uid, ...this.params })
      if (res.code === 2000) {
        this.fansList = res.data.fansUsers
        this.total = res.data.total
      }
    },
    toUserSpace (uid) {
      const { href } = this.$router.resolve({ name: 'user_space', params: { uid: uid } })
      window.open(href, '_blank')
    }
  }
}
</script>

<style lang="less" scoped>
.el-empty {
  height: 300px;
}
.follow-list {
  padding: 5px;
.follow-item {
  height: 80px;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #ddd;
}
.follow-user {
  display: flex;
  align-items: center;
.follow-info {
  display: flex;
  flex-direction: column;
  margin-left: 10px;
}
.user-name {
  font-size: 18px;
  color: #2f3542;
}
.user-desc {
  font-size: 13px;
  color: #999;
}
}
}
.el-pagination {
  margin-top: 30px;
  text-align: center;
}
</style>
