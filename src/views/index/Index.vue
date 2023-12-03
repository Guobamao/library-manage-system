<template>
    <div>
        <el-container >
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
                    <el-menu background-color="#28333e" text-color="#fff" active-text-color="#ffd04b">
                        <!-- 遍历父级菜单 -->
                        <el-submenu v-for="item in apiData" :key="item.name" :index="item.name">
                            <template slot="title">
                                <i :class="item.icon"></i>
                                <span>{{ item.title }}</span>
                            </template>
                            <!-- 遍历子级菜单 -->
                            <el-menu-item v-for="child in item.child" :key="child.name" :index="child.name" @click="handleMenuClick(child)">
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
                        <el-tab-pane v-for="item in Tabs" :key="item.index" :label="item.tagName" :closable="item.isClosable" :name="item.index"></el-tab-pane>
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
            tabIndex: 1, // 标签页索引
            currentTabIndex: "1", // 当前激活的标签页
            Tabs: [
                {
                    index: "1",
                    tagName: "首页",
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
                }
            });
        },
        addTab(item) {
            // 判断标签页是否已经存在
            // 判断标签名 是否等于 菜单项的标题
            const tab = this.Tabs.find(tab => tab.tagName === item.title);
            if (tab) { // 标签页已存在
                this.currentTabIndex = tab.index;
            } else { // 标签页不存在
                ++this.tabIndex;
                this.currentTabIndex = this.tabIndex.toString(); // 设置当前激活的标签页
                this.Tabs.push({
                    index: this.currentTabIndex,
                    tagName: item.title,
                    path: item.path,
                    isClosable: true
                });
            }
        },
        removeTab(targetName) {
            const tabs = this.Tabs;
            const activeName = this.currentTabIndex;
            /* 输出类型 */
            if (activeName === targetName) {
                tabs.forEach((tab, index) => {
                    if (tab.index === targetName) {
                        const nextTab = tabs[index + 1] || tabs[index - 1];
                        if (nextTab) {
                            this.currentTabIndex = nextTab.index;
                            this.$router.push(nextTab.path)
                        }
                    }
                })
            }
            this.Tabs = tabs.filter(tab => tab.index !== targetName);
        },
        handleMenuClick(item) {
            this.addTab(item);
            this.$router.push(item.path);
        },
        handleTabClick(tag) {
            console.log(tag);
            const path = this.Tabs.find(item => item.index === tag.name).path;
            this.$router.push(path);
        }
    },
    mounted() {
        this.apiData = apiData;
    },
    created() {
        this.username = localStorage.getItem("username");
        this.adminType = localStorage.getItem("adminType");
    }

}
</script>

<style>
@import "../../styles/index.css";
</style>