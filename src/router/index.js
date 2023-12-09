import Vue from 'vue'
import VueRouter from 'vue-router'
import axios from 'axios'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: localStorage.getItem('admin') == 1 ? '/admin' : '/user'
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
    path: '/admin',
    name: 'Admin',
    component: () => import('../views/index/Index.vue'),
    children: [
      {
        path: '',
        component: () => import('../views/index/Welcome.vue')
      },
      {
        path: 'BorrowIndex',
        component: () => import('../views/AdminView/borrow/BorrowIndex.vue')
      },
      {
        path: 'BookIndex',
        component: () => import('../views/AdminView/book/BookIndex.vue')
      },
      {
        path: 'AdminIndex',
        component: () => import('../views/AdminView/admin/AdminIndex.vue')
      },
      {
        path: 'NoticeIndex',
        component: () => import('../views/AdminView/notice/NoticeIndex.vue')
      },
      {
        path: 'ReaderIndex',
        component: () => import('../views/AdminView/reader/ReaderIndex.vue')
      },
      {
        path: 'CategoryIndex',
        component: () => import('../views/AdminView/category/CategoryIndex.vue')
      },
      {
        path: 'StatisticsIndex',
        component: () => import('../views/AdminView/statistics/StatisticsIndex.vue')
      }
    ]
  },
  {
    path: '/user',
    name: 'User',
    component: () => import('../views/index/Index.vue'),
    children: [
      {
        path: '',
        component: () => import('../views/index/Welcome.vue')
      },
      {
        path: 'BorrowIndex',
        component: () => import('../views/UserView/borrow/BorrowIndex.vue')
      },
      {
        path: 'BookIndex',
        component: () => import('../views/UserView/book/BookIndex.vue')
      },
      {
        path: 'ReturnIndex',
        component: () => import('../views/UserView/return/ReturnIndex.vue')
      }
    ]
  }
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
    localStorage.clear()

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
      localStorage.clear()

      // 跳转到登录页面
      router.push('/login')
    }
    return Promise.reject(error)
  }
)

export default router