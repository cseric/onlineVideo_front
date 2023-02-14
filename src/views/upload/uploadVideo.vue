<template>
  <div class="upload-container">
    <div class="upload-body">
      <div class="upload-box">
      <div class="upload-title">
        <span>上传视频</span>
      </div>
      <el-form ref="uploadRef" :model="uploadForm" :rules="uploadRules" label-position="top" label-width="80px" size="large">
        <el-form-item label="视频标题" prop="title">
          <el-input v-model="uploadForm.title"
                    placeholder="给你的视频取个标题吧"
                    maxlength="50"
                    show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="视频简介" prop="brief">
          <el-input
            v-model="uploadForm.brief"
            placeholder="介绍一下你的视频吧"
            maxlength="100"
            show-word-limit>
          </el-input>
        </el-form-item>
        <el-form-item label="视频封面">
          <input type="file" accept="image/jpeg,image/png" style="display: none;" ref="covRef" @change="onCoverChange"/>
          <div class="cov-img">
            <div v-if="!covURL">封面预览</div>
            <img v-else :src="covURL" alt="">
          </div>
          <div style="margin-top: 5px;">
            <span class="tips">只能上传jpg/png文件，且不超过5M</span>
          </div>
          <div style="margin-top: 5px;">
            <el-button size="medium" @click="selectCover" :disabled="selectCoverDisabled">
              <i class="el-icon-document-add"></i> 添加
            </el-button>
            <el-button size="medium"
                       type="success"
                       @click="uploadCover"
                       :disabled="covURL === '' || uploadCoverDisabled"
                       :loading="uploadCoverStatus">
              <i class="el-icon-upload2"></i> 上传
            </el-button>
          </div>
        </el-form-item>
        <el-form-item label="视频文件">
          <input type="file" accept="video/mp4" style="display: none;" ref="vidRef" @change="onVideoChange"/>
          <div class="video-name">
            <span>{{ vidURL || '暂无文件' }}</span>
          </div>
          <div style="margin-top: 5px;">
            <span class="tips">只能上传mp4文件，且不超过500M</span>
          </div>
          <div style="margin-top: 5px;">
            <el-button size="medium" @click="selectVideo" :disabled="selectVideoDisabled">
              <i class="el-icon-document-add"></i> 添加
            </el-button>
            <el-button size="medium"
                       type="success"
                       @click="uploadVideo"
                       :disabled="vidURL === '' || uploadVideoDisabled"
                       :loading="uploadVideoStatus">
              <i class="el-icon-upload2"></i> 上传
            </el-button>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitAudit">提交审核</el-button>
        </el-form-item>
      </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { uploadCoverAPI, uploadVideoAPI } from '@/api/upload'
import { uploadVideoInfoAPI } from '@/api/video'

export default {
  name: 'uploadVideo',
  data () {
    return {
      covURL: '',
      vidURL: '',
      uploadCoverStatus: false,
      uploadVideoStatus: false,
      selectCoverDisabled: false,
      selectVideoDisabled: false,
      uploadCoverDisabled: false,
      uploadVideoDisabled: false,
      uploadForm: {
        title: '',
        cover: '',
        path: '',
        brief: ''
      },
      uploadRules: {
        title: [
          { required: true, message: '请输入视频标题', trigger: 'blur' },
          { max: 50, message: '标题最多50字', trigger: 'blur' }
        ],
        brief: [
          { required: true, message: '请输入视频简介', trigger: 'blur' },
          { max: 100, message: '简介最多100字', trigger: 'blur' }
        ]
      },
      imgExtList: ['png', 'jpg', 'jpeg']
    }
  },
  methods: {
    // 选择封面
    selectCover () {
      this.$refs.covRef.click()
    },
    // 选择视频
    selectVideo () {
      this.$refs.vidRef.click()
    },
    // 显示待上传的封面
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
      this.uploadForm.cover = res.data.coverPath
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
      this.uploadForm.path = res.data.videoPath
      this.uploadVideoStatus = false
      this.selectVideoDisabled = true
      this.uploadVideoDisabled = true
    },
    // 上传视频信息并提交审核
    submitAudit () {
      this.$refs.uploadRef.validate(async valid => {
        if (!valid) return false
        if (!this.uploadForm.cover) return this.$message.error('请上传封面')
        if (!this.uploadForm.path) return this.$message.error('请上传视频')

        const { data: res } = await uploadVideoInfoAPI(this.uploadForm)
        if (res.code !== 2000) return this.$message.error(res.msg)
        this.$message.success(res.msg)
        await this.$router.replace('/')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.upload-container {
  max-width: 2560px;
  padding: 20px 80px;
  .upload-body {
    min-width: 1120px;
  }
  .upload-box {
    width: 850px;
    margin: 0 auto;
    padding: 20px 30px;
    border: 1px solid #ddd;
    border-radius: 5px;
    box-shadow: 0 0 3px #ccc;
    background-color: #fff;
  }
  .upload-title {
    font-size: 20px;
    height: 30px;
    line-height: 30px;
    color: #2f3542;
  }
  .el-form {
    width: 800px;
    margin-top: 30px;
  }
  .video-name {
    width: 500px;
    height: 40px;
    line-height: 40px;
    padding-left: 10px;
    border: 1px dashed #ddd;
    border-radius: 5px;
    color: #999;
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
}
</style>
