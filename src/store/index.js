import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const userToken = 'userToken'
const userInfo = 'userInfo'

export default new Vuex.Store({
  state: {
    userToken: localStorage.getItem(userToken) || '',
    userInfo: JSON.parse(localStorage.getItem(userInfo)) || {}
  },
  getters: {
    avatar: state => state.userInfo.avatar,
    username: state => state.userInfo.username,
    gender: state => state.userInfo.gender,
    sign: state => state.userInfo.sign
  },
  mutations: {
    updateToken (state, newToken) {
      state.userToken = newToken
      localStorage.setItem(userToken, newToken)
    },
    updateUserInfo (state, newInfo) {
      state.userInfo = newInfo
      localStorage.setItem(userInfo, JSON.stringify(newInfo))
    },
    removeToken (state) {
      state.userToken = ''
      localStorage.removeItem(userToken)
    },
    removeUserInfo (state) {
      state.userInfo = {}
      localStorage.removeItem(userInfo)
    }
  },
  actions: {
  },
  modules: {
  }
})
