import request from '@/utils/request'

/**
 * 获取评论
 * @param vid
 * @param page
 * @param pageSize
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getCommentAPI = ({ vid, page, pageSize }) => {
  return request({
    url: '/comment/get',
    method: 'get',
    params: {
      vid,
      page,
      page_size: pageSize
    }
  })
}

/**
 * 删除评论
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const deleteCommentAPI = id => {
  return request({
    url: '/comment/delete',
    method: 'delete',
    data: {
      id
    }
  })
}

/**
 * 发送评论
 * @param vid
 * @param content
 * @returns {Promise<AxiosResponse<any>>}
 */
export const sendCommentAPI = ({ vid, content }) => {
  return request({
    url: '/comment/send',
    method: 'post',
    data: {
      vid,
      content
    }
  })
}
