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
                                <el-dropdown-item command="/user/info" v-if="this.isAdmin === 'false'">个人中心</el-dropdown-item>
                                <el-dropdown-item command="CardInfo" v-if="this.isAdmin === 'false'">借书卡</el-dropdown-item>
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
                    <el-badge v-if="isAdmin == 'true'" :hidden="unsolvedCount <= 0" :value="unsolvedCount" class="item"
                        style="position: absolute; right: 4%; top: 10%;">
                        <el-button size="small" @click="showUnsolvedDialog">待处理</el-button>
                    </el-badge>
                </el-main>
            </el-container>
            <!-- 对话框 -->
            <el-dialog title="借书卡信息" :visible.sync="cardInfoDialogVisible" center width="30rem">
                <!-- 有借书卡则显示信息 -->
                <el-descriptions :column="2">
                    <el-descriptions-item label="借书卡号">{{ cardInfo.cardNumber }}</el-descriptions-item>
                    <el-descriptions-item label="姓名">{{ cardInfo.readerName ? cardInfo.readerName : '未设置'
                    }}</el-descriptions-item>
                    <el-descriptions-item label="发放时间">{{ cardInfo.createTime }}</el-descriptions-item>
                    <el-descriptions-item label="状态">{{ cardInfo.status === 1 ? '正常' : '挂失' }}</el-descriptions-item>
                </el-descriptions>
                <span slot="footer" class="dialog-footer">
                    <el-button type="danger" @click="cardReport" size="small">挂失</el-button>
                    <el-button v-if="cardInfo.status === 2" type="primary" @click="showApplyStatus"
                        size="small">申请进度</el-button>
                    <el-button type="primary" @click="cardInfoDialogVisible = false" size="small">确定</el-button>
                </span>
            </el-dialog>
            <el-dialog title="图书卡申请进度" :visible.sync="applyCardDialogVisible" width="40rem">
                <el-steps :active="applyCardStatus.status + 1" align-center finish-status="success">
                    <el-step title="提交申请" :description="applyCardStatus.applyTime"></el-step>
                    <el-step title="管理员审核"
                        :description="applyCardStatus.status === 0 ? '' : applyCardStatus.handleTime"></el-step>
                    <el-step title="申请成功"
                        :description="applyCardStatus.status === 0 ? '' : applyCardStatus.handleTime"></el-step>
                </el-steps>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="applyCardDialogVisible = false" size="small">确定</el-button>
                </span>
            </el-dialog>

            <!-- 抽屉 -->
            <el-drawer title="我是标题" :visible.sync="drawerVisible" :with-header="false">
                <el-collapse accordion style="margin: 20px;">
                    <el-collapse-item title="待处理借阅图书">
                        // TODO: 待处理借阅图书
                    </el-collapse-item>
                    <el-collapse-item title="待处理借书卡申请">
                        <el-table :data="cardApplyData" border size="small">
                            <el-table-column prop="readerId" label="读者ID"></el-table-column>
                            <el-table-column prop="name" label="姓名">
                                <template slot-scope="scope">
                                    {{ scope.row.name ? scope.row.name : "未填写" }}
                                </template>
                            </el-table-column>
                            <el-table-column prop="applyTime" label="申请事件"></el-table-column>
                            <el-table-column prop="type" label="类型">
                                <template slot-scope="scope">
                                    {{ scope.row.type === 0 ? "申请" : "挂失" }}
                                </template>
                            </el-table-column>
                            <el-table-column label="操作">
                                <template slot-scope="scope">
                                    <el-button type="primary" size="mini" @click="pass(scope.row)">
                                        <i class="el-icon-check"></i>
                                        通过
                                    </el-button>
                                    <br>
                                    <el-button type="danger" size="mini" @click="reject(scope.row)">
                                        <i class="el-icon-close"></i>
                                        驳回
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-collapse-item>
                </el-collapse>
            </el-drawer>
        </el-container>
    </div>
</template>

<script>
import adminApi from "@/assets/admin.json";
import userApi from "@/assets/user.json";
import { adminRequest, userRequest } from "@/api";
import userMethods from '@/api/admin/index'
import adminMethods from '@/api/user/index'
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
            cardInfoDialogVisible: false, // 借书卡信息对话框
            cardInfo: {}, // 借书卡信息
            applyCardDialogVisible: false, // 申请借书卡对话框
            applyCardStatus: [], // 申请借书卡状态
            drawerVisible: false, // 抽屉
            unsolvedCount: 0, // 待处理的消息数量
            cardApplyData: [], // 借书卡申请数据
            bookBorrowData: [] // 图书借阅数据
        }
    },
    methods: {
        // 导入方法
        ...adminMethods,
        ...userMethods,
        // 退出登录
        logout() {
            if (localStorage.getItem('isAdmin' === 1)) {
                adminRequest.post("/admin/logout").then(res => {
                    if (res.data.code === 1) {
                        this.$message.success("退出登录成功");
                        this.$router.push("/login");
                        localStorage.clear();
                        sessionStorage.clear();
                    }
                });
            } else {
                userRequest.post("/user/logout").then(res => {
                    if (res.data.code === 1) {
                        this.$message.success("退出登录成功");
                        this.$router.push("/login");
                        localStorage.clear();
                        sessionStorage.clear();
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
            } else if (command === "CardInfo") {
                this.showCardInfo();
                console.log("CardInfo");
            } else {
                window.open(command, "_blank")
            }
        }
    },
    mounted() {
    },
    created() {
        this.username = localStorage.getItem("username");
        this.adminType = localStorage.getItem("adminType");
        this.isAdmin = localStorage.getItem("isAdmin");
        this.apiData = this.isAdmin === 'true' ? adminApi : userApi; // 判断是否为管理员,加载不同的菜单栏
        this.currentTabIndex = sessionStorage.getItem("currentTabIndex") || "HomePage";
        this.tabs = sessionStorage.getItem("tabs") ? JSON.parse(sessionStorage.getItem("tabs")) : this.tabs;
        if (this.isAdmin === 'true') {
            this.getUnsolvedCount();
        }
    }
}
</script>

<style>
@import "../../styles/index.css";
</style>