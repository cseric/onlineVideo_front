import request from '@/utils/request'

/**
 * 点赞视频API
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const likeAPI = id => {
  return request({
    url: '/interactive/like/add',
    method: 'post',
    data: {
      id
    }
  })
}

/**
 * 取消点赞API
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const unLikeAPI = id => {
  return request({
    url: '/interactive/like/cancel',
    method: 'put',
    data: {
      id
    }
  })
}

/**
 * 收藏视频API
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const collectAPI = id => {
  return request({
    url: '/interactive/collect/add',
    method: 'post',
    data: {
      id
    }
  })
}

/**
 * 取消收藏API
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const unCollectAPI = id => {
  return request({
    url: '/interactive/collect/cancel',
    method: 'put',
    data: {
      id
    }
  })
}
