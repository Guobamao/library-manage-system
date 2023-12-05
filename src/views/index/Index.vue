<template>
    <div>
        <el-container>
            <!-- 页面顶部 -->
            <el-header>
                <el-row>
                    <el-col :span="12">
                        <a href="/index" class="logo-title">
                            <i class="el-icon-s-home"></i>
                            <span style="margin-left: 10px">图书管理系统</span>
                        </a>
                    </el-col>
                    <el-col :span="12" style="display: flex; justify-content: end">
                        <span class="header-name">{{ username }}</span>
                        <el-button type="danger" size="mini" @click="logout">退出登录</el-button>
                    </el-col>
                </el-row>
            </el-header>
            <!-- 页面主体容器 -->
            <el-container class="container-body">
                <!-- 侧边菜单栏 -->
                <el-aside style="width: 200px;">
                    <el-menu background-color="#28333e" text-color="#fff" active-text-color="#ffd04b" :default-active="currentTabIndex">
                        <!-- 遍历父级菜单 -->
                        <el-submenu v-for="item in apiData" :key="item.name" :index="item.name">
                            <template slot="title">
                                <i :class="item.icon"></i>
                                <span>{{ item.title }}</span>
                            </template>
                            <!-- 遍历子级菜单 -->
                            <el-menu-item v-for="child in item.child" :key="child.name" :index="child.name"
                                @click="handleMenuClick(child)">
                                <i :class="child.icon"></i>
                                <span>{{ child.title }}</span>
                            </el-menu-item>
                        </el-submenu>
                    </el-menu>
                </el-aside>
                <!-- 主体内容 -->
                <el-main class="container-main">
                    <!-- 标签栏 -->
                    <el-tabs v-model="currentTabIndex" @tab-remove="removeTab" @tab-click="handleTabClick">
                        <el-tab-pane v-for="item in tabs" :key="item.index" :label="item.tabName"
                            :closable="item.isClosable" :name="item.index"></el-tab-pane>
                    </el-tabs>
                    <!-- 路由容器 -->
                    <el-container>
                        <router-view />
                    </el-container>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
import apiData from "@/assets/init.json";
export default {
    data() {
        return {
            apiData: [], // 侧边菜单栏数据
            currentTabIndex: "HomePage", // 当前激活的标签页
            tabs: [
                {
                    index: "HomePage",
                    tabName: "首页",
                    path: "/index",
                    isClosable: false
                }
            ]
        }
    },
    methods: {
        // 退出登录
        logout() {
            this.$axios.post(this.adminType ? "/admin/logout" : "/reader/logout").then(res => {
                if (res.data.code === 1) {
                    this.$message.success("退出登录成功");
                    this.$router.push("/login");
                    localStorage.clear();
                }
            });
        },
        addTab(menuItem) {
            // 判断标签页是否已经存在
            // 判断标签名 是否等于 菜单项的标题
            const tab = this.tabs.find(tab => tab.index === menuItem.name);
            if (tab) { // 标签页已存在
                this.currentTabIndex = tab.index; // 将当前激活的标签页设为点击的菜单项
            } else { // 标签页不存在
                this.currentTabIndex = menuItem.name; // 设置当前激活的标签页
                this.tabs.push({
                    index: this.currentTabIndex,
                    tabName: menuItem.title,
                    path: menuItem.path,
                    isClosable: true
                });
            }
        },
        removeTab(tabName) {
            // 判断当前激活的标签是否为传入的标签
            if (this.currentTabIndex === tabName) {
                this.tabs.forEach((tab, index) => {
                    if (tab.index === tabName) { // 遍历判断是否为当前标签
                        // 获取下一个Tabex)
                        const nextTab = this.tabs[index + 1] || this.tabs[index - 1]; // 如果该元素有下一个元素，则为下一个元素。没有则为上一个元素
                        if (nextTab) { // 如果元素存在
                            this.currentTabIndex = nextTab.index;
                            this.$router.push(nextTab.path); // 跳转
                        }
                    }
                })
            }
            this.tabs = this.tabs.filter(tab => tab.index !== tabName);
        },
        handleMenuClick(item) {
            this.addTab(item);
            this.$router.push(item.path);
        },
        handleTabClick(tab) {
            const path = this.tabs.find(item => item.index === tab.name).path;
            this.$router.push(path);
        }
    },
    mounted() {
    },
    created() {
        this.username = localStorage.getItem("username");
        this.adminType = localStorage.getItem("adminType");
        this.apiData = apiData;
    }
}
</script>

<style>
@import "../../styles/index.css";
</style>