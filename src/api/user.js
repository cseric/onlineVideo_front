import request from '@/utils/request'
// import qs from 'qs'

/**
 * 用户登录API
 * @param username
 * @param password
 * @returns {Promise<AxiosResponse<any>>}
 */
export const loginAPI = ({ username, password }) => {
  return request({
    url: '/user/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

/**
 * 用户注册API
 * @param username
 * @param password
 * @param rePassword
 * @returns {Promise<AxiosResponse<any>>}
 */
export const registerAPI = ({ username, password, repassword }) => {
  return request({
    url: '/user/register',
    method: 'post',
    data: {
      username,
      password,
      re_password: repassword
    }
  })
}

/**
 * 验证用户名是否存在
 * @param username
 * @returns {Promise<AxiosResponse<any>>}
 */
export const checkNameAPI = username => {
  return request({
    url: '/user/check',
    method: 'patch',
    data: {
      username
    }
  })
}

/**
 * 获取当前用户信息
 * @returns {Promise<AxiosResponse<any>>}
 */
export const initUserInfoAPI = () => {
  return request({
    url: '/user/info',
    method: 'get'
  })
}

/**
 * 获取其他用户信息
 * @param uid
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getUserInfoAPI = uid => {
  return request({
    url: '/user/other/info',
    method: 'get',
    params: {
      uid
    }
  })
}

/**
 * 修改用户信息API
 * @param username
 * @param gender
 * @param sign
 * @returns {Promise<AxiosResponse<any>>}
 */
export const updateUserInfoAPI = ({ username, gender, sign }) => {
  return request({
    url: '/user/update/info',
    method: 'put',
    data: {
      username,
      gender: parseInt(gender),
      sign
    }
  })
}

/**
 * 修改用户密码
 * @param oldPassword
 * @param newPassword
 * @param rePassword
 * @returns {Promise<AxiosResponse<any>>}
 */
export const updatePassAPI = ({ oldPassword, newPassword, rePassword }) => {
  return request({
    url: '/user/update/pass',
    method: 'put',
    data: {
      old_password: oldPassword,
      new_password: newPassword,
      re_password: rePassword
    }
  })
}

/**
 * 用户修改头像API
 * @param formData
 * @returns {Promise<AxiosResponse<any>>}
 */
export const uploadAvatarAPI = formData => {
  return request({
    url: '/user/update/avatar',
    method: 'put',
    data: formData
  })
}
