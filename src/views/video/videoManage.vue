<template>
  <div class="manage-container">
    <div class="manage-box">
      <div class="manage-area">
        <div class="manage-title">
          <span><i class="el-icon-video-camera"></i> 视频管理</span>
        </div>
        <div class="manage-body">
          <div class="video-list">
            <div v-for="item in videoList" :key="item.id" class="video-item">
              <div class="video-content">
                <div class="video-cover">
                  <img :src="coverURL+item.cover" alt="" @click="toVideoPlay(item.id)"/>
                </div>
                <div class="video-info">
                  <span class="video-title" @click="toVideoPlay(item.id)">{{ item.title }}</span>
                  <span v-if="item.status === 0" class="video-status warning-status">等待审核中</span>
                  <span v-else-if="item.status === 1" class="video-status danger-status">未通过审核</span>
                  <span v-else-if="item.status === 2" class="video-status success-status">已通过审核</span>
                  <span class="video-date">上传于{{ $formatTime(item.upload_time) }}</span>
                </div>
              </div>
              <div class="video-data">
                <span>{{ item.likes }} 点赞</span>
                <el-divider direction="vertical"></el-divider>
                <span>{{ item.collect }} 收藏</span>
              </div>
              <div class="video-option">
                <el-button type="primary" size="small" @click="showUpdateVideo(item)"><i class="el-icon-edit"></i> 修改</el-button>
                <el-button type="danger" size="small" @click="deleteVideo(item.id)"><i class="el-icon-delete"></i> 删除</el-button>
              </div>
            </div>
          </div>
          <el-pagination
            background
            @size-change="sizeChangeHandler"
            @current-change="handleCurrentChange"
            :current-page.sync="params.page"
            :page-sizes="[3, 5, 10, 20]"
            :page-size.sync="params.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
    <!--修改对话框-->
    <el-dialog
      title="修改视频"
      :visible.sync="updateVideoVisible"
      width="800px"
      :before-close="resetVideo">
      <el-form ref="updateVideoRef" :model="updateVideoForm" :rules="updateVideoRules" label-width="80px">
        <el-form-item label="视频标题" prop="title">
          <el-input v-model="updateVideoForm.title" maxlength="50" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="视频简介" prop="brief">
          <el-input v-model="updateVideoForm.brief" maxlength="100" show-word-limit>
          </el-input>
        </el-form-item>
        <el-form-item label="视频封面">
          <input type="file" accept="image/jpeg,image/png" style="display: none;" ref="covRef" @change="onCoverChange"/>
          <div class="cov-img">
            <img v-if="!covURL" :src="coverURL+updateVideoForm.cover" alt=""/>
            <img v-else :src="covURL" alt="">
          </div>
          <div style="margin-top: 5px;">
            <span class="tips">只能上传jpg/png文件，且不超过5M</span>
          </div>
          <div style="margin-top: 5px;">
            <el-button @click="selectCover" :disabled="selectCoverDisabled">修改封面</el-button>
            <el-button type="success" @click="uploadCover" :disabled="covURL === '' || uploadCoverDisabled" :loading="uploadCoverStatus">上传封面</el-button>
          </div>
        </el-form-item>
        <el-form-item label="视频文件">
          <input type="file" accept="video/mp4" style="display: none;" ref="vidRef" @change="onVideoChange"/>
          <div class="video-name">
            <span>{{ vidURL || updateVideoForm.path }}</span>
          </div>
          <div style="margin-top: 5px;">
            <span class="tips">只能上传mp4文件，且不超过500M</span>
          </div>
          <div style="margin-top: 5px;">
            <el-button @click="selectVideo" :disabled="selectVideoDisabled">修改视频</el-button>
            <el-button type="success" @click="uploadVideo" :disabled="vidURL === '' || uploadVideoDisabled" :loading="uploadVideoStatus">上传视频</el-button>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelVideo">取消</el-button>
        <el-button type="primary" @click="updateVideoInfo">修改</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { deleteVideoAPI, getUploadVideoAPI, updateVideoInfoAPI } from '@/api/video'
import { coverURL } from '@/utils/request'
import { uploadCoverAPI, uploadVideoAPI } from '@/api/upload'

export default {
  name: 'videoManage',
  async created () {
    await this.getUploadVideo()
  },
  data () {
    return {
      covURL: '',
      vidURL: '',
      videoList: [],
      updateVideoVisible: false,
      selectCoverDisabled: false,
      selectVideoDisabled: false,
      uploadCoverDisabled: false,
      uploadVideoDisabled: false,
      uploadCoverStatus: false,
      uploadVideoStatus: false,
      total: 0,
      params: {
        page: 1,
        pageSize: 5
      },
      coverURL,
      updateVideoForm: {
        id: 0,
        title: '',
        brief: '',
        cover: '',
        path: ''
      },
      updateVideoRules: {
        title: [
          { required: true, message: '请输入视频标题', trigger: 'blur' }
        ],
        brief: [
          { required: true, message: '请输入视频简介', trigger: 'blur' }
        ]
      },
      imgExtList: ['png', 'jpg', 'jpeg']
    }
  },
  methods: {
    // 获取上传的视频列表
    async getUploadVideo () {
      const { data: res } = await getUploadVideoAPI(this.params)
      console.log(res)
      if (res.code === 2000) {
        this.videoList = res.data.videos
        this.total = res.data.total
      }
    },
    // 页码发生变化时
    handleCurrentChange (newPage) {
      this.params.page = newPage
      this.getUploadVideo()
    },
    sizeChangeHandler (newSize) {
      this.params.pageSize = newSize
      this.params.page = 1
      this.getUploadVideo()
    },
    // 重置对话框
    resetVideo (done) {
      this.$refs.covRef.value = ''
      this.$refs.vidRef.value = ''
      this.covURL = ''
      this.vidURL = ''
      this.$refs.updateVideoRef.resetFields()
      done()
    },
    // 对话框取消操作
    cancelVideo () {
      this.$refs.covRef.value = ''
      this.$refs.vidRef.value = ''
      this.covURL = ''
      this.vidURL = ''
      this.$refs.updateVideoRef.resetFields()
      this.updateVideoVisible = false
    },
    // 显示对话框
    showUpdateVideo (obj) {
      this.updateVideoVisible = true
      this.$nextTick(() => {
        this.updateVideoForm.id = obj.id
        this.updateVideoForm.title = obj.title
        this.updateVideoForm.cover = obj.cover
        this.updateVideoForm.path = obj.path
        this.updateVideoForm.brief = obj.brief
      })
    },
    onCoverChange (e) {
      const files = e.target.files
      if (files.length === 0) {
        this.covURL = ''
      } else {
        if (this.imgExtList.indexOf(files[0].name.substr(files[0].name.lastIndexOf('.') + 1)) === -1) {
          this.covURL = ''
          return this.$message.error('封面图片只能是PNG、JPEG、JPG格式')
        }
        const fileReader = new FileReader()
        fileReader.readAsDataURL(files[0])
        fileReader.onload = e => {
          this.covURL = e.target.result
        }
      }
    },
    // 显示待上传的文件名
    onVideoChange (e) {
      const files = e.target.files
      if (files.length === 0) {
        this.vidURL = ''
      } else {
        if (files[0].name.substr(files[0].name.lastIndexOf('.') + 1) !== 'mp4') {
          this.vidURL = ''
          return this.$message.error('视频格式只能是MP4格式')
        }
        this.vidURL = files[0].name
      }
    },
    selectCover () {
      this.$refs.covRef.click()
    },
    selectVideo () {
      this.$refs.vidRef.click()
    },
    // 上传封面
    async uploadCover () {
      const isAllowSize = this.$refs.covRef.files[0].size / 1024 / 1024 < 5
      if (!isAllowSize) {
        return this.$message.error('上传的封面大小不能超过5M')
      }
      this.uploadCoverStatus = true
      const formData = new FormData()
      formData.append('cover', this.$refs.covRef.files[0])
      const { data: res } = await uploadCoverAPI(formData)
      if (res.code !== 2000) {
        this.uploadCoverStatus = false
        return this.$message.error(res.msg)
      }
      this.$message.success(res.msg)
      this.updateVideoForm.cover = res.data.coverPath
      this.uploadCoverStatus = false
      this.selectCoverDisabled = true
      this.uploadCoverDisabled = true
    },
    // 上传视频
    async uploadVideo () {
      const isAllowSize = this.$refs.vidRef.files[0].size / 1024 / 1024 < 500
      if (!isAllowSize) {
        return this.$message.error('上传的视频大小不能超过500M')
      }
      this.uploadVideoStatus = true
      const formData = new FormData()
      formData.append('video', this.$refs.vidRef.files[0])
      const { data: res } = await uploadVideoAPI(formData)
      if (res.code !== 2000) {
        this.uploadVideoStatus = false
        return this.$message.error(res.msg)
      }
      this.$message.success(res.msg)
      this.updateVideoForm.path = res.data.videoPath
      this.uploadVideoStatus = false
      this.selectVideoDisabled = true
      this.uploadVideoDisabled = true
    },
    // 提交修改
    updateVideoInfo () {
      this.$refs.updateVideoRef.validate(async valid => {
        if (!valid) return false
        if (!this.updateVideoForm.cover) return this.$message.error('请上传封面')
        if (!this.updateVideoForm.path) return this.$message.error('请上传视频')
        const { data: res } = await updateVideoInfoAPI(this.updateVideoForm)
        if (res.code !== 2000) return this.$message.error(res.msg)
        this.$message.success(res.msg)
        this.cancelVideo()
        await this.getUploadVideo()
      })
    },
    deleteVideo (id) {
      this.$confirm('确定要删除这个视频吗？', '提示', {
        confirmButtonText: '我已确定',
        cancelButtonText: '我再想想',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await deleteVideoAPI(id)
        if (res.code !== 2000) return this.$message.error(res.msg)
        this.$message.success(res.msg)
        if (this.videoList.length === 1 && this.params.page > 1) {
          this.params.page--
        }
        await this.getUploadVideo()
      })
    },
    toVideoPlay (vid) {
      const { href } = this.$router.resolve({ name: 'video_play', params: { vid: vid } })
      window.open(href, '_blank')
    },
    showStatus (status) {
      switch (status) {
        case 0 :
          return '等待审核中'
        case 1 :
          return '未通过审核'
        case 2 :
          return '已通过审核'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.manage-container {
  max-width: 2560px;
  height: 100%;
  .manage-box {
    min-width: 1120px;
    padding: 0 80px;
  }
  .manage-area {
    width: 1350px;
    height: 100%;
    margin: 0 auto;
    padding: 10px 20px;
    background-color: #fff;
  }
  .manage-title {
    height: 30px;
    line-height: 30px;
    font-size: 20px;
  }
  .manage-body {
    margin-top: 20px;
  }
  .video-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 20px;
    height: 145px;
    margin-top: 5px;
    border: 1px solid #ddd;
  }
  .video-content {
    display: flex;
    flex: 2;
    .video-info {
      margin-left: 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      .video-title {
        font-size: 18px;
        cursor: pointer;
        &:hover {
          color: #1e90ff;
        }
      }
      .video-status {
        font-size: 13px;
      }
      .video-date {
        font-size: 13px;
        color: #999;
      }
    }
  }
  .video-cover {
    img {
      width: 200px;
      object-fit: cover;
      cursor: pointer;
    }
  }
  .video-data {
    display: flex;
    flex: 1;
    align-items: center;
    span {
      font-size: 14px;
      color: #666;
    }
  }
  .video-option {
    display: flex;
  }
  .el-pagination {
    margin-top: 20px;
  }
  .video-name {
    width: 500px;
    height: 50px;
    line-height: 50px;
    padding-left: 10px;
    border: 1px dashed #ddd;
    border-radius: 5px;
  }
  .cov-img {
    width: 500px;
    height: 300px;
    border-radius: 5px;
    div {
      text-align: center;
      line-height: 300px;
      color: #999;
      border: 1px dashed #ddd;
      border-radius: 5px;
    }
    img {
      width: 100%;
      object-fit: cover;
    }
  }
  .tips {
    color: #ff6b81;
    font-size: 12px;
  }
  .warning-status {
    color: #ffa502;
  }
  .danger-status {
    color: #ff4757;
  }
  .success-status {
    color: #2ed573;
  }
}
</style>
