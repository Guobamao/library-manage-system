<template>
    <div>
        <el-container>
            <!-- 页面顶部 -->
            <el-header>
                <el-row>
                    <el-col :span="12">
                        <!-- router-link -->
                        <router-link to="/" class="logo-title">
                            <i class="el-icon-s-home"></i>
                            <span style="margin-left: 10px">图书管理系统</span>
                        </router-link>
                    </el-col>
                    <el-col :span="12" style="display: flex; justify-content: end; align-items: center;">
                        <el-dropdown @command="handleMenuCommand">
                            <div class="el-dropdown-link">
                                <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
                                    style="vertical-align: middle;"></el-avatar>
                            </div>
                            <el-dropdown-menu>
                                <el-dropdown-item command="/user/info">个人中心</el-dropdown-item>
                                <el-dropdown-item command="applyCard">借书卡</el-dropdown-item>
                                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                        <span style="margin-left: 10px">{{ username }}</span>
                    </el-col>
                </el-row>
            </el-header>
            <!-- 页面主体容器 -->
            <el-container class="container-body">
                <!-- 侧边菜单栏 -->
                <el-aside style="width: 200px;">
                    <el-menu background-color="#28333e" text-color="#fff" active-text-color="#ffd04b"
                        :default-active="currentTabIndex">
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
            <!-- 对话框 -->
            <el-dialog title="图书卡申请进度" :visible.sync="applyCardDialogVisible" width="30%">
                <el-steps :active="applyCardStatus" align-center finish-status="success">
                    <el-step title="提交申请"></el-step>
                    <el-step title="管理员审核"></el-step>
                    <el-step title="申请成功"></el-step>
                </el-steps>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="applyCardDialogVisible = false" size="small">取 消</el-button>
                    <el-button type="primary" @click="applyCardDialogVisible = false" size="small">确 定</el-button>
                </span>
            </el-dialog>
        </el-container>
    </div>
</template>

<script>
import adminApi from "@/assets/admin.json";
import userApi from "@/assets/user.json";
import { adminRequest, userRequest } from "@/api/api";
export default {
    data() {
        return {
            apiData: [], // 侧边菜单栏数据
            currentTabIndex: "HomePage", // 当前激活的标签页
            tabs: [
                {
                    index: "HomePage",
                    tabName: "首页",
                    path: "/",
                    isClosable: false
                }
            ],
            applyCardDialogVisible: false, // 申请借书卡对话框
            applyCardStatus: 0, // 申请借书卡状态
        }
    },
    methods: {
        // 退出登录
        logout() {
            if (localStorage.getItem('isAdmin' === 1)) {
                adminRequest.post("/admin/logout").then(res => {
                    if (res.data.code === 1) {
                        this.$message.success("退出登录成功");
                        this.$router.push("/login");
                        localStorage.clear();
                    }
                });
            } else {
                userRequest.post("/user/logout").then(res => {
                    if (res.data.code === 1) {
                        this.$message.success("退出登录成功");
                        this.$router.push("/login");
                        localStorage.clear();
                    }
                });
            }
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
            sessionStorage.setItem("tabs", JSON.stringify(this.tabs));
            sessionStorage.setItem("currentTabIndex", this.currentTabIndex);
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
            sessionStorage.setItem("tabs", JSON.stringify(this.tabs));
            sessionStorage.setItem("currentTabIndex", this.currentTabIndex);
        },
        handleMenuClick(item) {
            this.addTab(item);
            this.$router.push(item.path);
        },
        handleTabClick(tab) {
            const path = this.tabs.find(item => item.index === tab.name).path;
            this.currentTabIndex = tab.name;
            sessionStorage.setItem("currentTabIndex", this.currentTabIndex);
            this.$router.push(path);
        },
        handleMenuCommand(command) {
            if (command === "logout") {
                this.logout();
            } else if (command === "applyCard") {
                this.applyCard();
            } else {
                window.open(command, "_blank")
            }
        },
        applyCard() {
            userRequest.post("/card/apply")
                .then(res => {
                    if (res.data.code === 1) {
                        this.$message.success("申请成功，请等待管理员审核");
                    } else {
                        if (res.data.msg === "已有借书卡") {
                            this.$confirm("您已有借书卡，是否挂失？", "提示", {
                                confirmButtonText: "确定",
                                cancelButtonText: "取消",
                                type: "warning"
                            }).then(() => {
                                userRequest.post('/card/report')
                                    .then(res => {
                                        if (res.data.code === 1) {
                                            this.$message.success("挂失成功");
                                        } else {
                                            this.$message.error(res.data.msg)
                                        }
                                    })
                            }).catch(() => { })
                        } else if (res.data.msg === "已申请，请勿重复申请") {
                            this.$confirm("已申请借书卡，是否查看申请进度？", "提示", {
                                confirmButtonText: "确定",
                                cancelButtonText: "取消",
                                type: "warning"
                            }).then(() => {
                                userRequest.get('/card/status')
                                    .then(res => {
                                        if (res.data.code === 1) {
                                            this.applyCardStatus = res.data.data.status + 1;
                                            this.applyCardDialogVisible = true;
                                        } else {
                                            this.$message.error(res.data.msg)
                                        }
                                    })
                            }).catch(() => { })
                        }
                    }
                })
        }
    },
    mounted() {
    },
    created() {
        this.username = localStorage.getItem("username");
        this.adminType = localStorage.getItem("adminType");
        this.apiData = localStorage.getItem('isAdmin') === 'true' ? adminApi : userApi; // 判断是否为管理员,加载不同的菜单栏
        this.currentTabIndex = sessionStorage.getItem("currentTabIndex") || "HomePage";
        this.tabs = sessionStorage.getItem("tabs") ? JSON.parse(sessionStorage.getItem("tabs")) : this.tabs;
    }
}
</script>

<style>
@import "../../styles/index.css";
</style>