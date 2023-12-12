<template>
    <div class="layui-container">
        <div class="admin-login-background">
            <el-form class="login-form" ref="loginForm" :model="loginForm" :rules="loginFormRules">
                <el-form-item class="logo-title">
                    <h1 style="margin: 0;">图书管理系统</h1>
                    <i style="line-height: 20px; margin: 10px 0 0 0;">Library Management System</i>
                </el-form-item>
                <el-form-item prop="username">
                    <el-input v-model="loginForm.username" placeholder="用户名" autocomplete="on"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" v-model="loginForm.password" placeholder="密码" autocomplete="on"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="loginForm.loginType" placeholder="请选择" style="width: 100%;">
                        <el-option label="普通用户" value="0"></el-option>
                        <el-option label="管理员" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('loginForm')" style="width: 100%;">登录</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="success" @click="$router.push('/register')" style="width: 100%;">注册</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import { adminRequest, userRequest } from '@/api'
export default {
    data() {
        return {
            loginForm: {
                username: '',
                password: '',
                loginType: '',
            },
            loginFormRules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' }
                ],
                loginType: [
                    { required: true, message: '请选择用户类型', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        submitForm(formName) {
            // 为表单绑定验证功能
            this.$refs[formName].validate(valid => {
                if (valid) {
                    // 管理员登录
                    if (this.loginForm.loginType === '1') {
                        adminRequest.post('/login', {
                            username: this.loginForm.username,
                            password: this.loginForm.password,
                        }).then(res => {
                            if (res.data.code === 1) {
                                localStorage.setItem('username', res.data.data.username)
                                localStorage.setItem('token', res.data.data.token)
                                localStorage.setItem('isAdmin', true)
                                this.$notify({
                                    title: '登录成功',
                                    message: '欢迎回来:  ' + res.data.data.username,
                                    type: 'success'
                                })
                                this.$router.replace({
                                    path: '/'
                                })
                            } else {
                                this.$message.error(res.data.msg)
                            }
                        })
                    } else { // 用户登录
                        userRequest.post('/user/login', {
                            username: this.loginForm.username,
                            password: this.loginForm.password,
                        }).then(res => {
                            if (res.data.code === 1) {
                                localStorage.setItem('username', res.data.data.username)
                                localStorage.setItem('token', res.data.data.token)
                                localStorage.setItem('isAdmin', false)
                                this.$notify({
                                    title: '登录成功',
                                    message: '欢迎回来: ' + res.data.data.username,
                                    type: 'success'
                                })
                                this.$router.replace({
                                    path: '/'
                                })
                            } else {
                                this.$message.error(res.data.msg)
                            }
                        })
                    }
                } else {
                    if (this.loginForm.username === '') {
                        this.$message.error('请输入用户名')
                    } else if (this.loginForm.password === '') {
                        this.$message.error('请输入密码')
                    } else if (this.loginForm.type === '') {
                        this.$message.error('请选择用户类型')
                    }
                }
            });
        }
    }
}
</script>   

<style scoped>
@import "../../styles/login.css";
</style>