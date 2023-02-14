<template>
  <div class="home-container">
    <div class="home-box">
      <div class="home-body">
        <div class="home-item">
          <el-empty v-if="recommends.length === 0" description="暂无视频"></el-empty>
          <div v-else class="video-body">
            <div class="content-title">
              <span style="color: #ff4757;">最新视频</span>
              <el-button type="text" @click="getNewest" size="large"><i class="el-icon-refresh"></i>刷新</el-button>
            </div>
            <div class="video-list">
              <div v-for="item in newest" :key="item.id" class="video-item">
                <div class="video-cover">
                  <img :src="coverURL+item.cover" alt="" @click="toVideoPlay(item.id)">
                </div>
                <div class="video-info">
                  <span class="video-title" @click="toVideoPlay(item.id)">{{ item.title }}</span>
                  <span class="video-author" @click="toUserSpace(item.uid)"><i class="el-icon-user"></i> {{ item.author }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="home-item">
          <el-empty v-if="recommends.length === 0" description="暂无推荐"></el-empty>
          <div v-else class="video-body">
            <div class="content-title">
              <span style="color: #ffa502;">推荐视频</span>
              <el-button type="text" @click="getRecommend" size="large"><i class="el-icon-refresh"></i>刷新</el-button>
            </div>
            <div class="video-list">
              <div v-for="item in recommends" :key="item.id" class="video-item">
                <div class="video-cover">
                  <img :src="coverURL+item.cover" alt="" @click="toVideoPlay(item.id)">
                </div>
                <div class="video-info">
                  <span class="video-title" @click="toVideoPlay(item.id)">{{ item.title }}</span>
                  <span class="video-author" @click="toUserSpace(item.uid)"><i class="el-icon-user"></i> {{ item.author }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="home-item">
          <el-empty v-if="videoList.length === 0" description="暂无视频"></el-empty>
          <div v-else class="video-body">
            <div class="content-title">
              <span style="color: #2ed573;">所有视频</span>
            </div>
            <div class="video-list">
              <div v-for="item in videoList" :key="item.id" class="video-item">
                <div class="video-cover">
                  <img :src="coverURL+item.cover" alt="" @click="toVideoPlay(item.id)">
                </div>
                <div class="video-info">
                  <span class="video-title" @click="toVideoPlay(item.id)">{{ item.title }}</span>
                  <span class="video-author" @click="toUserSpace(item.uid)"><i class="el-icon-user"></i> {{ item.author }}</span>
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
      </div>
    </div>
  </div>
</template>

<script>
import { getNewestAPI, getRecommendAPI, getVideoListAPI } from '@/api/video'
import { coverURL } from '@/utils/request'

export default {
  name: 'userHome',
  async created () {
    await this.getNewest()
    await this.getRecommend()
    await this.getVideoList()
  },
  data () {
    return {
      videoList: [],
      total: 0,
      recommends: [],
      newest: [],
      size: 5,
      params: {
        page: 1,
        pageSize: 10
      },
      coverURL,
      keyword: '',
      searchKeyword: '',
      isSearch: false
    }
  },
  methods: {
    async getVideoList () {
      const { data: res } = await getVideoListAPI(this.params)
      if (res.code === 2000) {
        this.videoList = res.data.videos
        this.total = res.data.total
      }
    },
    async getRecommend () {
      const { data: res } = await getRecommendAPI(this.size)
      if (res.code === 2000) {
        this.recommends = res.data.recommends
      }
    },
    async getNewest () {
      const { data: res } = await getNewestAPI(this.size)
      if (res.code === 2000) {
        this.newest = res.data.newest
      }
    },
    toUserSpace (uid) {
      const { href } = this.$router.resolve({ name: 'user_space', params: { uid: uid } })
      window.open(href, '_blank')
    },
    toVideoPlay (vid) {
      const { href } = this.$router.resolve({ name: 'video_play', params: { vid: vid } })
      window.open(href, '_blank')
    },
    handleCurrentChange (newPage) {
      this.params.page = newPage
      this.getVideoList()
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  max-width: 2560px;
  .el-empty {
    height: 500px;
  }
  .home-box {
    min-width: 1120px;
    padding: 0 80px;
  }
  .home-body {
    width: 1300px;
    height: 100%;
    margin: 0 auto;
    background-color: #fff;
  }
  .home-item {
    padding: 5px 0;
  }
  .video-body {
    width: 1250px;
    margin: 20px auto;
  }
  .content-title {
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 20px;
    padding: 5px;
  }
  .video-list {
    display: flex;
    flex-wrap: wrap;
  }
  .video-item {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin: 5px;
  }
  .video-cover {
    img {
      width: 240px;
      object-fit: cover;
      border-radius: 5px;
      cursor: pointer;
    }
  }
  .video-info {
    display: flex;
    flex-direction: column;
    margin-top: 5px;
    .video-title {
      width: 240px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      cursor: pointer;
    }
    .video-title:hover {
      color: #1e90ff;
    }
    .video-author {
      font-size: 13px;
      color: #999;
      margin-top: 5px;
      cursor: pointer;
    }
    .video-author:hover {
      color: #1e90ff;
    }
  }
  .el-pagination {
    margin-top: 30px;
    text-align: center;
  }
}
</style>
