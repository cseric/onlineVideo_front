import request from '@/utils/request'
// import qs from 'qs'

/**
 * 上传封面API
 * @param formData
 * @returns {Promise<AxiosResponse<any>>}
 */
export const uploadCoverAPI = formData => {
  return request({
    url: '/upload/cover',
    method: 'post',
    data: formData
  })
}

/**
 * 上传视频API
 * @param formData
 * @returns {Promise<AxiosResponse<any>>}
 */
export const uploadVideoAPI = formData => {
  return request({
    url: '/upload/video',
    method: 'post',
    data: formData
  })
}
