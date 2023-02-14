import request from '@/utils/request'

/**
 * 关注
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const followAPI = id => {
  return request({
    url: '/follow/add',
    method: 'post',
    data: {
      id
    }
  })
}

/**
 * 取关
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const unFollowAPI = id => {
  return request({
    url: '/follow/cancel',
    method: 'delete',
    data: {
      id
    }
  })
}

/**
 * 获取关注列表
 * @param uid
 * @param page
 * @param pageSize
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getFollowListAPI = ({ uid, page, pageSize }) => {
  return request({
    url: '/follow/list',
    method: 'get',
    params: {
      uid,
      page,
      page_size: pageSize
    }
  })
}

/**
 * 获取粉丝列表
 * @param uid
 * @param page
 * @param pageSize
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getFansListAPI = ({ uid, page, pageSize }) => {
  return request({
    url: '/follow/fans',
    method: 'get',
    params: {
      uid,
      page,
      page_size: pageSize
    }
  })
}

/**
 * 获取关注状态
 * @param fid
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getFollowStatusAPI = fid => {
  return request({
    url: '/follow/status',
    method: 'get',
    params: {
      fid
    }
  })
}

/**
 * 获取关注与粉丝数据
 * @param uid
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getFollowDataAPI = uid => {
  return request({
    url: '/follow/data',
    method: 'get',
    params: {
      uid
    }
  })
}
