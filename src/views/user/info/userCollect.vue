<template>
  <div>
    <el-empty v-if="videoList.length === 0" description='暂无收藏'></el-empty>
    <div v-else>
      <div class="collect-content">
        <div class="video-list">
          <div v-for="item in videoList" :key="item.id" class="video-item">
            <div class="video-cover">
              <img :src="coverURL+item.cover" alt="" @click="toVideoPlay(item.id)">
            </div>
            <div class="video-info">
              <span class="video-title" @click="toVideoPlay(item.id)">{{ item.title }}</span>
              <span class="video-time">收藏于 {{ $formatDate(item.collect_time) }}</span>
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
import { coverURL } from '@/utils/request'
import { getCollectListAPI } from '@/api/video'

export default {
  name: 'userCollect',
  async created () {
    await this.getCollectVideo(this.$route.params.uid)
  },
  data () {
    return {
      videoList: [],
      total: 0,
      coverURL,
      params: {
        page: 1,
        pageSize: 10
      }
    }
  },
  methods: {
    toVideoPlay (vid) {
      const { href } = this.$router.resolve({ name: 'video_play', params: { vid: vid } })
      window.open(href, '_blank')
    },
    handleCurrentChange (newPage) {
      this.params.page = newPage
    },
    async getCollectVideo (uid) {
      const { data: res } = await getCollectListAPI(uid)
      if (res.code === 2000) {
        this.videoList = res.data.collects
        this.total = res.data.total
      }
    }
  }
}
</script>

<style lang="less" scoped>
.el-empty {
  height: 300px;
}
.collect-content {
  margin-top: 20px;
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
  .video-time {
    font-size: 13px;
    color: #999;
    margin-top: 5px;
    cursor: pointer;
  }
}
.el-pagination {
  margin-top: 30px;
  text-align: center;
}
</style>
