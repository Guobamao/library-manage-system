import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currentTabIndex: "HomePage", // 当前激活的标签页
    tabs: [
      {
        index: "HomePage",
        tabName: "首页",
        path: "/index",
        isClosable: false
      }
    ]
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }

})
