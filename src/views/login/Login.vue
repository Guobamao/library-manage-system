<template>
    <div class="layui-container">
        <div class="admin-login-background">
            <el-form class="login-form" ref="loginForm" :model="loginForm" :rules="loginFormRules">
            <el-form-item class="logo-title">
                <h1>图书管理系统</h1>
            </el-form-item>
            <el-form-item prop="username">
                <el-input v-model="loginForm.username" placeholder="用户名" autocomplete="off" class="el-form-item"></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input type="password" v-model="loginForm.password" placeholder="密码" autocomplete="off" class="el-form-item"></el-input>
            </el-form-item>
            <el-form-item prop="type">
                <el-select v-model="loginForm.type" placeholder="请选择用户类型" class="el-form-item">
                <el-option label="管理员" value="1"></el-option>
                <el-option label="读者" value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('loginForm')" class="el-form-item">登录</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="success" @click="$router.push('/register')" class="el-form-item">注册</el-button>
            </el-form-item>
            
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Login',
    data() {
        return {
            loginForm: {
                username: '',
                password: '',
                type: '',
            },
            loginFormRules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' }
                ],
                type: [
                    { required: true, message: '请选择用户类型', trigger: 'change' }
                ]
            }
        }
    },
    methods: {
        submitForm(formName) {
            // 为表单绑定验证功能
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.$axios.post(this.loginForm.type === '1' ? '/admin/login' : '/reader/login',{
                        username: this.loginForm.username,
                        password: this.loginForm.password,
                    }).then(res => {
                        if (res.data.code === 1) {
                            this.$message.success('登录成功')
                            localStorage.setItem('username', res.data.data.username)
                            localStorage.setItem('adminType', res.data.data.adminType)
                            localStorage.setItem('token', res.data.data.token)
                            this.$router.replace({
                                path: '/'
                            })
                        } else {
                            this.$message.error(res.data.msg)
                        }
                    })
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

<style>
@import "../../styles/login.css";
</style>