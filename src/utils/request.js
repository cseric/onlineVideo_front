import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { Message } from 'element-ui'

const domain = 'http://localhost:9096'
// 请求基础地址
export const baseURL = domain + '/api/v1'
// 头像资源地址
export const avatarURL = domain + '/res/avatar/'
// 封面资源地址
export const coverURL = domain + '/res/cover/'
// 视频资源地址
export const videoURL = domain + '/res/video/'
// 封装axios请求
const ApiRequest = axios.create({
  baseURL
})

// 请求白名单，不需要携带token
const whiteAPIList = ['/user/login', '/user/register', '/user/check']

ApiRequest.interceptors.request.use(function (config) {
  if (!whiteAPIList.includes(config.url)) {
    config.headers.Authorization = store.state.userToken
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

ApiRequest.interceptors.response.use(function (response) {
  return response
}, function (error) {
  console.log(error)
  if (error.response.status === 401) {
    store.commit('removeUserInfo')
    store.commit('removeToken')
    Message.error('用户授权已过期')
    router.replace('/login').catch((err) => err)
  }
  return Promise.reject(error)
})

export default ApiRequest
