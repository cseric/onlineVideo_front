<template>
  <div class="search-container">
    <div class="search-box">
      <div class="search-body">
        <div class="search-title">
          <span>搜索<b style="color: #1E90FF;">{{ $route.query.keyword }}</b>的结果</span>
        </div>
        <el-empty v-if="videoList.length === 0" description="未找到相关视频"></el-empty>
        <div v-else class="search-result">
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
</template>

<script>
import { coverURL } from '@/utils/request'
import { searchVideoAPI } from '@/api/video'

export default {
  name: 'videoSearch',
  async created () {
    await this.searchVideo(this.$route.query.keyword)
  },
  data () {
    return {
      videoList: [],
      total: 0,
      params: {
        page: 1,
        pageSize: 10
      },
      coverURL
    }
  },
  methods: {
    async searchVideo (keyword) {
      const { data: res } = await searchVideoAPI({ keyword: keyword, ...this.params })
      if (res.code === 2000) {
        this.videoList = res.data.videos
        this.total = res.data.total
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
.search-container {
  max-width: 2560px;
  padding: 0 80px;
  .search-box {
    min-width: 1120px;
  }
  .search-title {
    height: 40px;
    line-height: 40px;
    font-size: 20px;
    padding: 5px;
  }
  .el-empty {
    height: 500px;
  }
  .search-body {
    width: 1250px;
    background-color: #fff;
    margin: 10px auto;
    padding: 10px;
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
