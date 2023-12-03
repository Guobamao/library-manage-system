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
    next('/login')
    // 弹出提示框
    Vue.prototype.$message({
      type: 'warning',
      message: '请先登录'
    })
  } else {
    axios.defaults.headers.common['Token'] = token
    next()
  }
})


export default router
