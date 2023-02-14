<template>
  <div class="play-container">
    <div class="play-box">
      <div class="video-box">
        <div class="video-header">
          <span class="video-title">{{ playVideo.title }}</span>
          <span class="video-time">{{ $formatTime(playVideo.upload_time) }}</span>
        </div>
        <div class="video-body">
          <my-player ref="player"></my-player>
        </div>
        <div class="video-footer">
          <div class="author-box">
            <el-avatar class="avatar-img" :size="50" :src="AuthorAvatar" @click.native="toUserSpace(playVideo.uid)"></el-avatar>
            <div class="author-info">
              <span class="author-name" @click="toUserSpace(playVideo.uid)">{{ playVideo.author }}</span>
              <span class="author-brief">{{ playVideo.sign }}</span>
            </div>
          </div>
          <div class="video-option">
            <span v-if="!interactive.is_like" class="option-item" @click="likeVideo">
              <img src="../../assets/img/unlike.svg" alt=""> {{ interactive.likes }}
            </span>
            <span v-else class="option-item option-active" @click="unLikeVideo">
              <img src="../../assets/img/liked.svg" alt=""> {{ interactive.likes }}
            </span>
            <span v-if="!interactive.is_collect" class="option-item" @click="collectVideo">
              <img src="../../assets/img/unstar.svg" alt=""> {{ interactive.collect }}
            </span>
            <span v-else class="option-item option-active" @click="unCollectVideo">
              <img src="../../assets/img/stared.svg" alt=""> {{ interactive.collect }}
            </span>
          </div>
          <div class="author-option">
            <el-button v-if="!interactive.is_follow" type="primary" @click="followAuthor">关注</el-button>
            <el-button v-else type="info" @click="unFollowAuthor">已关注</el-button>
          </div>
        </div>
        <div class="video-brief">
          <span>{{ playVideo.brief }}</span>
        </div>
      </div>
      <div class="comment-box">
        <div class="comment-header">
          <span class="comment-title">评论（{{ total }}）</span>
        </div>
        <div class="send-comment">
          <el-avatar :size="50" :src="UserAvatar"></el-avatar>
          <div class="send-box">
            <el-input type="textarea" :rows="2" placeholder="快来发表你的评论吧" v-model="commentContent" maxlength="120" show-word-limit></el-input>
            <el-button class="send-btn" type="primary" @click="sendComment">发送</el-button>
          </div>
        </div>
        <div class="comment-body">
          <el-empty v-if="commentList.length === 0" description="还没有评论哦"></el-empty>
          <div v-else class="comment-list">
            <div v-for="item in commentList" :key="item.id" class="comment-item">
              <el-avatar class="avatar-img"
                         :size="50"
                         :src="item.avatar ? avatarURL+item.avatar : defaultAvatar"
                         @click.native="toUserSpace(item.uid)">
              </el-avatar>
              <div class="comment-content">
                <span class="comment-user" @click="toUserSpace(item.uid)">
                  {{ item.username }}
                  <span v-if="item.uid === playVideo.uid" class="author-tag">作者</span>
                  <span v-if="item.uid === $store.state.userInfo.id" class="own-tag">（我）</span>
                </span>
                <span class="comment-text">{{ item.content }}</span>
                <div class="comment-extra">
                  <span class="comment-time">{{ $formatTime(item.comment_time) }}</span>
                  <span v-if="isOwn" class="delete-btn" @click="deleteComment(item.id)"><i class="el-icon-delete"></i>删除</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="comment-footer">
          <el-pagination
            hide-on-single-page
            @current-change="handleCurrentChange"
            :current-page.sync="params.page"
            layout="prev, pager, next"
            :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { avatarURL, coverURL, videoURL } from '@/utils/request'
import { getInteractiveDataAPI, getVideoAPI } from '@/api/video'
import { collectAPI, likeAPI, unCollectAPI, unLikeAPI } from '@/api/interactive'
import { followAPI, unFollowAPI } from '@/api/follow'
import { deleteCommentAPI, getCommentAPI, sendCommentAPI } from '@/api/comment'
import defaultAvatar from '@/assets/img/avatar.png'
import MyPlayer from '@/components/MyPlayer'

export default {
  name: 'videoPlay',
  components: {
    'my-player': MyPlayer
  },
  async created () {
    await this.getVideo(this.$route.params.vid)
    await this.getInteractive(this.$route.params.vid)
    await this.getComment(this.$route.params.vid)
  },
  computed: {
    AuthorAvatar () {
      return this.playVideo.avatar ? this.avatarURL + this.playVideo.avatar : defaultAvatar
    },
    UserAvatar () {
      return this.$store.getters.avatar ? this.avatarURL + this.$store.getters.avatar : defaultAvatar
    }
  },
  data () {
    return {
      playVideo: {},
      interactive: {},
      commentList: [],
      total: 0,
      commentContent: '',
      params: {
        page: 1,
        pageSize: 10
      },
      avatarURL,
      videoURL,
      coverURL,
      isOwn: false,
      defaultAvatar,
      videoPath: ''
    }
  },
  methods: {
    // 获取视频信息
    async getVideo (vid) {
      const { data: res } = await getVideoAPI(vid)
      if (res.code !== 2000) {
        this.$message.error(res.msg)
        await this.$router.push('/')
      }
      this.playVideo = res.data.video
      this.isOwn = res.data.isOwn
      this.$refs.player.initPlayer(this.videoURL + this.playVideo.path)
    },
    // 获取交互信息
    async getInteractive (vid) {
      const { data: res } = await getInteractiveDataAPI(vid)
      if (res.code === 2000) {
        this.interactive = res.data.interactive
      }
    },
    // 点赞
    async likeVideo () {
      const { data: res } = await likeAPI(this.playVideo.id)
      if (res.code !== 2000) return this.$message.error(res.msg)
      this.$message.success(res.msg)
      await this.getInteractive(this.playVideo.id)
    },
    // 取消点赞
    async unLikeVideo () {
      const { data: res } = await unLikeAPI(this.playVideo.id)
      if (res.code !== 2000) return this.$message.error(res.msg)
      this.$message.success(res.msg)
      await this.getInteractive(this.playVideo.id)
    },
    // 收藏
    async collectVideo () {
      const { data: res } = await collectAPI(this.playVideo.id)
      if (res.code !== 2000) return this.$message.error(res.msg)
      this.$message.success(res.msg)
      await this.getInteractive(this.playVideo.id)
    },
    // 取消收藏
    async unCollectVideo () {
      const { data: res } = await unCollectAPI(this.playVideo.id)
      if (res.code !== 2000) return this.$message.error(res.msg)
      this.$message.success(res.msg)
      await this.getInteractive(this.playVideo.id)
    },
    // 关注
    async followAuthor () {
      if (this.playVideo.uid === this.$store.state.userInfo.id) {
        return this.$message.error('不能对自己进行操作')
      }
      const { data: res } = await followAPI(this.playVideo.uid)
      if (res.code !== 2000) return this.$message.error(res.msg)
      this.$message.success(res.msg)
      await this.getInteractive(this.playVideo.id)
    },
    // 取关
    async unFollowAuthor () {
      const { data: res } = await unFollowAPI(this.playVideo.uid)
      if (res.code !== 2000) return this.$message.error(res.msg)
      this.$message.success(res.msg)
      await this.getInteractive(this.playVideo.id)
    },
    async getComment (vid) {
      const { data: res } = await getCommentAPI({ vid: vid, ...this.params })
      if (res.code === 2000) {
        this.commentList = res.data.comments
        this.total = res.data.total
      }
    },
    async sendComment () {
      if (this.commentContent === '') {
        return this.$message.error('评论内容不能为空')
      }
      const { data: res } = await sendCommentAPI({ vid: this.playVideo.id, content: this.commentContent })
      if (res.code !== 2000) return this.$message.error(res.msg)
      this.$message.success(res.msg)
      this.commentContent = ''
      await this.getComment(this.playVideo.id)
    },
    deleteComment (id) {
      this.$confirm('确定要删除此条评论吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '再想想',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await deleteCommentAPI(id)
        if (res.code !== 2000) return this.$message.error(res.msg)
        this.$message.success(res.msg)
        if (this.commentList.length === 1 && this.params.page > 1) {
          this.params.page--
        }
        await this.getComment(this.playVideo.id)
      }).catch((err) => err)
    },
    handleCurrentChange (newPage) {
      this.params.page = newPage
      this.getComment(this.playVideo.id)
    },
    toUserSpace (uid) {
      const { href } = this.$router.resolve({ name: 'user_space', params: { uid: uid } })
      window.open(href, '_blank')
    }
  }
}
</script>

<style lang="less" scoped>
.play-container {
  max-width: 2560px;
  height: 100%;
  padding: 0 80px;
  .play-box {
    width: 1000px;
    margin: 10px auto;
    padding: 20px 30px;
    background-color: #FFF;
  }
  .video-box {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .video-header {
    display: flex;
    flex-direction: column;
    .video-title {
      font-size: 20px;
      color: #2f3542;
    }
    .video-time {
      font-size: 13px;
      color: #999;
    }
  }
  .video-body {
    margin-top: 10px;
    width: 100%;
  }
  .video-footer {
    display: flex;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #ddd;
  }
  .author-box {
    display: flex;
    flex: 2;
    .author-info {
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin-left: 10px;
    }
    .author-name {
      font-size: 18px;
      color: #2f3542;
      cursor: pointer;
    }
    .author-brief {
      font-size: 13px;
      color: #999;
    }
  }
  .video-option {
    display: flex;
    align-items: center;
    .option-item {
      margin: 0 10px;
      cursor: pointer;
      img {
        vertical-align: middle;
      }
    }
    .option-active {
      color: #1e90ff;
    }
  }
  .author-option {
    margin: 0 10px;
  }
  .video-brief {
    margin-top: 10px;
    padding: 10px;
    font-size: 13px;
    color: #2f3542;
  }
  .comment-box {
    margin-top: 20px;
    padding: 0 5px;
    display: flex;
    flex-direction: column;
  }
  .comment-header {
    color: #2f3542;
    padding: 10px 0;
  }
  .send-comment {
    display: flex;
    margin-top: 20px;
  }
  .send-box {
    display: flex;
    flex: 2;
    margin: 0 10px;
    .send-btn {
      margin: 0 5px;
    }
  }
  .comment-body {
    margin-top: 30px;
  }
  .comment-item {
    display: flex;
    padding: 5px 0;
    margin: 10px 0;
  }
  .comment-content {
    display: flex;
    flex-direction: column;
    flex: 2;
    margin: 0 10px;
    border-bottom: 1px solid #ddd;
    .comment-user {
      font-size: 14px;
      color: #2f3542;
      font-weight: 650;
      cursor: pointer;
    }
    .author-tag {
      font-size: 12px;
      color: #f1f2f6;
      border-radius: 5px;
      font-weight: normal;
      padding: 2px;
      margin: 0 1px;
      background-color: #1e90ff;
    }
    .own-tag {
      font-size: 12px;
      color: #1e90ff;
    }
    .comment-text {
      font-size: 14px;
      white-space: pre-wrap;
      margin: 5px 0;
    }
  }
  .comment-extra {
    margin-bottom: 5px;
    .comment-time {
      font-size: 13px;
      margin-top: 5px;
      color: #999;
    }
    .delete-btn {
      margin: 0 10px;
      font-size: 13px;
      color: #1e90ff;
      cursor: pointer;
    }
  }
  .el-pagination {
    margin-top: 30px;
    text-align: center;
  }
  .avatar-img {
    cursor: pointer;
  }
}
</style>
