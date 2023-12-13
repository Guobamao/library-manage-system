<template>
    <div class="layui-container">
        <div class="admin-login-background">
            <el-form class="login-form" ref="registerForm" :model="registerForm" :rules="registerFormRules">
                <el-form-item class="logo-title">
                    <h1 style="margin: 0;">用户注册</h1>
                    <i style="line-height: 20px; margin: 10px 0 0 0;">Library Management System</i>
                </el-form-item>
            <el-form-item prop="username">
                <el-input v-model="registerForm.username" placeholder="用户名" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input type="password" v-model="registerForm.password" placeholder="密码" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item prop="password2">
                <el-input type="password" v-model="registerForm.password2" placeholder="确认密码" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item>
                <el-input v-model="registerForm.phone" placeholder="手机号" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="success" @click="register()" style="width: 100%;">注册</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="$router.push('/login')" style="width: 100%;">返回登录</el-button>
            </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import { userRequest } from '@/api'
export default {
    data() {
        return {
            registerForm: {
                username: '',
                password: '',
                password2: '',
                phone: ''
            },
            registerFormRules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' }
                ],
                password2: [
                    { required: true, message: '请确认密码', trigger: 'blur' }
                ],
                phone: [
                    { required: true, message: '请输入手机号', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        register() {
            this.$refs.registerForm.validate(valid => {
                if (valid) {
                    if (this.registerForm.password != this.registerForm.password2) {
                        this.$notify.error({
                            title: '错误',
                            message: '两次输入的密码不一致'
                        });
                        return;
                    }
                    userRequest.post('/register', {
                        username: this.registerForm.username,
                        password: this.registerForm.password,
                        password2: this.registerForm.password2,
                        phone: this.registerForm.phone
                    }).then(res => {
                        if (res.data.code == 1) {
                            this.$notify.success({
                                title: '成功',
                                message: "注册成功，请登录"
                            });
                            this.$router.push('/login');
                        } else {
                            this.$notify.error({
                                title: '错误',
                                message: res.data.msg
                            });
                        }
                    })
                }
            })
        }
    }
}
</script>

<style scoped>
@import "../../styles/login.css";
</style>