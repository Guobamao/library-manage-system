<template>
    <div>
        <el-container>
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
            <el-container>
                <el-aside style="width: 200px">
                    <el-menu background-color="#28333e" text-color="#fff" active-text-color="#ffd04b">
                        <el-submenu v-for="item in apiData" :key="item.name" :index="item.name">
                            <template slot="title">
                                <i :class="item.icon"></i>
                                <span>{{ item.title }}</span>
                            </template>
                            <el-menu-item v-for="child in item.child" :key="child.name" :index="child.name" @click="handleClick(child)">
                                <i :class="child.icon"></i>
                                {{ child.title }}
                            </el-menu-item>
                        </el-submenu>
                    </el-menu>
                </el-aside>
                <el-main>
                    <el-tabs v-model="editableTabsValue" @tab-remove="removeTab" @tab-click="handleTabClick">
                        <el-tab-pane v-for="item in editableTabs" :key="item.name" :label="item.title"
                            :closable="item.closable" :name="item.name">
                        </el-tab-pane>
                    </el-tabs>
                    <el-container>
                        <router-view></router-view>
                    </el-container>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
import apiData from "@/assets/init.json";
export default {
    name: "Index",
    data() {
        return {
            apiData: [],
            editableTabsValue: "1",
            editableTabs: [
                {
                    title: "首页",
                    name: "1",
                    path: "/index",
                }
            ],
            tabIndex: 1,
        };
    },
    methods: {
        logout() {
            this.$axios
                .post(this.adminType ? "/admin/logout" : "/reader/logout")
                .then((res) => {
                    if (res.data.code === 1) {
                        this.$message.success("退出登录成功");
                        // 清除sessionStorage中的token和username
                        sessionStorage.removeItem("token");
                        sessionStorage.removeItem("username");
                        sessionStorage.removeItem("adminType");
                        // 跳转到登录页面
                        this.$router.replace({
                            path: "/login",
                        });
                    } else {
                        this.$message.error(res.data.msg);
                    }
                });
        },
        addTab(item) {
            let targetName = item.title;
            let newTabName = ++this.tabIndex + "";
            /* 如果editableTabs存在targetName(完全匹配），则不创建，跳转到该tab */
            let tab = this.editableTabs.find((item) => item.title === targetName);
            if (tab) {
                this.editableTabsValue = tab.name;
                return;
            }
            this.editableTabs.push({
                title: targetName,
                name: newTabName,
                closable: true,
                path: item.path
            });
            this.editableTabsValue = newTabName;
        },
        handleClick(item) {
            console.log(item);
            this.addTab(item);
            this.$router.push({ path: item.path })
        },
        handleTabClick(tab) {
            console.log(tab)
            const path = this.editableTabs.find(item => item.name === tab.name).path;
            this.$router.push({ path: path })
        },
        removeTab(targetName) {
            let tabs = this.editableTabs;
            let activeName = this.editableTabsValue;
            if (activeName === targetName) {
                tabs.forEach((tab, index) => {
                    if (tab.name === targetName) {
                        let nextTab = tabs[index + 1] || tabs[index - 1];
                        if (nextTab) {
                            activeName = nextTab.name;
                        }
                    }
                });
            }
            this.editableTabsValue = activeName;
            this.editableTabs = tabs.filter(tab => tab.name !== targetName);
        },
    },
    created() {
        this.username = sessionStorage.getItem("username");
        this.adminType = sessionStorage.getItem("adminType");
    },
    mounted() {
        this.apiData = apiData;
    }
};
</script>

<style>
@import "../../styles/index.css";
</style>