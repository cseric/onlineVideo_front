import request from '@/utils/request'

/**
 * 上传视频信息API
 * @param title
 * @param cover
 * @param path
 * @param brief
 * @returns {Promise<AxiosResponse<any>>}
 */
export const uploadVideoInfoAPI = ({ title, cover, path, brief }) => {
  return request({
    url: '/video/upload',
    method: 'post',
    data: {
      title,
      cover,
      path,
      brief
    }
  })
}

/**
 * 获取用户上传视频列表
 * @param page
 * @param pageSize
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getUploadVideoAPI = ({ page, pageSize }) => {
  return request({
    url: '/video/upload/list',
    method: 'get',
    params: {
      page,
      page_size: pageSize
    }
  })
}

/**
 * 更新视频信息API
 * @param id
 * @param title
 * @param cover
 * @param path
 * @param brief
 * @returns {Promise<AxiosResponse<any>>}
 */
export const updateVideoInfoAPI = ({ id, title, cover, path, brief }) => {
  return request({
    url: '/video/update',
    method: 'put',
    data: {
      id,
      title,
      cover,
      path,
      brief
    }
  })
}

/**
 * 删除视频API
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const deleteVideoAPI = id => {
  return request({
    url: '/video/delete',
    method: 'delete',
    data: {
      id
    }
  })
}

/**
 * 根据视频id获取视频信息
 * @param vid
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getVideoAPI = vid => {
  return request({
    url: '/video/get',
    method: 'get',
    params: {
      vid: parseInt(vid)
    }
  })
}

/**
 * 获取视频交互数据
 * @param vid
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getInteractiveDataAPI = vid => {
  return request({
    url: '/video/data',
    method: 'get',
    params: {
      vid: parseInt(vid)
    }
  })
}

/**
 * 根据用户id获取视频
 * @param uid
 * @param page
 * @param pageSize
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getUserVideoAPI = ({ uid, page, pageSize }) => {
  return request({
    url: '/video/user/get',
    method: 'get',
    params: {
      uid,
      page,
      page_size: pageSize
    }
  })
}

/**
 * 获取首页视频
 * @param page
 * @param pageSize
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getVideoListAPI = ({ page, pageSize }) => {
  return request({
    url: '/video/list',
    method: 'get',
    params: {
      page,
      page_size: pageSize
    }
  })
}

/**
 * 获取推荐视频
 * @param size
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getRecommendAPI = size => {
  return request({
    url: '/video/recommend',
    method: 'get',
    params: {
      size
    }
  })
}

/**
 * 获取推荐视频
 * @param size
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getNewestAPI = size => {
  return request({
    url: '/video/newest',
    method: 'get',
    params: {
      size
    }
  })
}

/**
 * 获取收藏列表
 * @param page
 * @param pageSize
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getCollectListAPI = ({ page, pageSize }) => {
  return request({
    url: '/video/collect',
    method: 'get',
    params: {
      page,
      page_size: pageSize
    }
  })
}

/**
 * 搜索视频
 * @param keyword
 * @param page
 * @param pageSize
 * @returns {Promise<AxiosResponse<any>>}
 */
export const searchVideoAPI = ({ keyword, page, pageSize }) => {
  return request({
    url: '/video/search',
    method: 'get',
    params: {
      keyword,
      page,
      page_size: pageSize
    }
  })
}
