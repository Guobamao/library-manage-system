import Vue from 'vue'
import VueRouter from 'vue-router'
import { Message } from 'element-ui'
import axios from 'axios'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: localStorage.getItem('isAdmin') === 'true' ? '/admin' : '/user'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/login/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/login/Register.vue')
  },
  {
    path: '/admin',
    meta: { requiresAdmin: true, requiresAuth: true }, // 需要管理员权限，需要登录
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
        path: 'BorrowPendingIndex',
        component: () => import("../views/AdminView/pending/BorrowPendingIndex.vue")
      },
      {
        path: 'CardPendingIndex',
        component: () => import("../views/AdminView/pending/CardPendingIndex.vue")
      },
      {
        path: 'StatisticsIndex',
        component: () => import('../views/AdminView/statistics/StatisticsIndex.vue')
      }
    ]
  },
  {
    path: '/user',
    meta: { requiresAuth: true }, // 需要登录
    component: () => import('../views/index/Index.vue'),
    children: [
      {
        path: '',
        component: () => import('../views/index/Welcome.vue')
      },
      {
        path: 'BookIndex',
        component: () => import('../views/UserView/book/BookIndex.vue')
      },
      {
        path: 'ReturnIndex',
        component: () => import('../views/UserView/return/ReturnIndex.vue')
      },
      {
        path: 'RecordIndex',
        component: () => import('../views/UserView/record/RecordIndex.vue')
      }
    ]
  },
  {
    path: '/user/profile',
    name: 'UserProfile',
    meta: { requiresAuth: true }, // 需要登录
    component: () => import('../views/UserView/userProfile/UserProfileIndex.vue')
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
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const token = localStorage.getItem('token')
  if (requiresAuth && !token) {
    Message.error('请先登录')
    next('/login')
  } else if (requiresAdmin && !isAdmin) {
    Message.error('您不是管理员，无法访问')
    next('/user')
  } else {
    axios.defaults.headers.common['Token'] = token
    next()
  }
})

export default router