import Vue from 'vue'
import VueRouter from 'vue-router'
import axios from 'axios'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/index'
  },
  {
    path: '/login',
    name:'Login',
    component: () => import('../views/login/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/login/Register.vue')
  },
  {
    path: '/index',
    name: 'Index',
    component: () => import('../views/index/Index.vue'),
    children: [
      {
        path: '',
        component: () => import('../views/index/Welcome.vue')
      },
      {
        path: 'lendList',
        component: () => import('../views/lend/LendList.vue')
      },
      {
        path: 'bookList',
        component: () => import('../views/book/BookList.vue')
      },
      {
        path: 'adminList',
        component: () => import('../views/admin/AdminIndex.vue')
      },
      {
        path: 'noticeList',
        component: () => import('../views/notice/NoticeIndex.vue')
      },
      {
        path: 'readerList',
        component: () => import('../views/reader/ReaderIndex.vue')
      },
      {
        path: 'typeList',
        component: () => import('../views/type/TypeIndex.vue')
      }
    ]
  },
]

// 获取原型对象上的push函数
const originalPush = VueRouter.prototype.push
// 修改原型对象中的push方法
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (!token && to.path !== '/login' && to.path !== '/register') {
    // 删除localStorage的信息
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    localStorage.removeItem('adminType')
    localStorage.removeItem('id')

    // 跳转到登录页面
    next('/login')
  } else {
    axios.defaults.headers.common['Token'] = token
    next()
  }
})

// 添加axios的响应拦截器
axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error.response && error.response.status === 401) {
      // 删除localStorage的信息
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      localStorage.removeItem('adminType')
      localStorage.removeItem('id')

      // 跳转到登录页面
      router.push('/login')
    }
    return Promise.reject(error)
  }
)

export default router