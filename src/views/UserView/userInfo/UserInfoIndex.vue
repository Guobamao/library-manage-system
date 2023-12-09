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
                                <el-dropdown-item command="applyCard">借书卡</el-dropdown-item>
                                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                        <span style="margin-left: 10px">{{ username }}</span>
                    </el-col>
                </el-row>
            </el-header>
        </el-container>
        <!-- 页面主体容器 -->
        <el-container class="container-body">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>用户信息</span>
                </div>
                <el-form label-width="20%" :model="userInfo" size="small">
                    <el-form-item label="用户名">
                        <el-input v-model="userInfo.username" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="密码">
                        <el-input v-model="userInfo.password"></el-input>
                    </el-form-item>
                    <el-form-item label="姓名" required>
                        <el-input v-model="userInfo.name"></el-input>
                    </el-form-item>
                    <el-form-item label="性别">
                        <el-radio-group v-model="userInfo.gender">
                            <el-radio label="0">男</el-radio>
                            <el-radio label="1">女</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="生日" required>
                        <el-date-picker v-model="userInfo.birthday" type="date" placeholder="选择日期"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="邮箱">
                        <el-input v-model="userInfo.email"></el-input>
                    </el-form-item>
                    <el-form-item label="电话">
                        <el-input v-model="userInfo.phone"></el-input>
                    </el-form-item>
                    <el-form-item label="地址">
                        <el-input v-model="userInfo.address"></el-input>
                    </el-form-item>
                    <el-form-item label="图书卡号">
                        <el-input v-model="userInfo.cardNumber" disabled></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">修改</el-button>
                        <el-button>取消</el-button>
                    </el-form-item>
                </el-form>
            </el-card>
        </el-container>
    </div>
</template>

<script>
import { userRequest } from '@/api/api'
export default {
    data() {
        return {
            userInfo: {
                username: '',
                password: '',
                name: '',
                gender: '',
                birthday: '',
                email: '',
                phone: '',
                address: '',
                cardNumber: ''
            }
        }
    },
    methods: {
        // 退出登录
        logout() {
            userRequest.post("/user/logout").then(res => {
                if (res.data.code === 1) {
                    this.$message.success("退出登录成功");
                    this.$router.push("/login");
                    localStorage.clear();
                }
            });
        },
        handleMenuCommand(command) {
            if (command === "logout") {
                this.logout();
            } else if (command === "applyCard") {
                this.applyCard();
            }
        },
        loadData() {
            userRequest.get('/user/info')
                .then(res => {
                    if (res.data.code === 1) {
                        this.userInfo = res.data.data;
                        this.userInfo.password = '';
                    } else {
                        this.$message.error(res.data.msg);
                    }
                })
        },
        onSubmit() {
            userRequest.put('/user', this.userInfo)
                .then(res => {
                    if (res.data.code === 1) {
                        this.$message.success("修改成功");
                    } else {
                        this.$message.error(res.data.msg);
                    }
                })
        },

    },
    created() {
        this.username = localStorage.getItem("username");
        this.loadData();
    }
}
</script>

<style scoped>
@import "../../../styles/index.css";

.box-card {
    width: 40%;
    margin: 50px auto;
}
</style>