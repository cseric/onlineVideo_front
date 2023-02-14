import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import('@/views/userLayout'),
    redirect: '/home',
    children: [
      {
        path: '/home',
        component: () => import('@/views/home')
      },
      {
        path: '/search',
        component: () => import('@/views/video/videoSearch')
      },
      {
        path: '/upload',
        component: () => import('@/views/upload/uploadVideo')
      },
      {
        path: '/user/center',
        component: () => import('@/views/user/userCenter')
      },
      {
        path: '/user/:uid',
        name: 'user_space',
        component: () => import('@/views/user/userSpace'),
        redirect: '/user/:uid/video',
        children: [
          {
            path: 'video',
            component: () => import('@/views/user/info/userVideo')
          },
          {
            path: 'collect',
            component: () => import('@/views/user/info/userCollect')
          },
          {
            path: 'follow',
            component: () => import('@/views/user/info/userFollow')
          },
          {
            path: 'fans',
            component: () => import('@/views/user/info/userFans')
          }
        ]
      },
      {
        path: '/video/upload',
        component: () => import('@/views/video/videoManage')
      },
      {
        path: '/video/:vid',
        name: 'video_play',
        component: () => import('@/views/video/videoPlay')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/userLogin')
  },
  {
    path: '/register',
    component: () => import('@/views/userRegister')
  },
  {
    path: '*',
    component: () => import('@/views/404')
  }
]

const router = new VueRouter({
  routes
})

const whiteList = ['/login', '/register']

router.beforeEach((to, from, next) => {
  const token = store.state.userToken
  if (token) {
    // eslint-disable-next-line no-empty
    if (!store.state.userInfo.username) {
    }
    if (whiteList.includes(to.path)) {
      next('/')
    }
    next()
  } else {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
    }
  }
})

export default router
