<template>
    <div class="layui-container">
        <div class="admin-login-background">
            <el-form class="login-form" ref="registerForm" :model="registerForm" :rules="registerFormRules">
            <el-form-item class="logo-title">
                <h1>用户注册</h1>
            </el-form-item>
            <el-form-item prop="username">
                <el-input v-model="registerForm.username" placeholder="用户名" autocomplete="off" class="el-form-item"></el-input>
            </el-form-item>
            <el-form-item prop="password1">
                <el-input type="password" v-model="registerForm.password1" placeholder="密码" autocomplete="off" class="el-form-item"></el-input>
            </el-form-item>
            <el-form-item prop="password2">
                <el-input type="password" v-model="registerForm.password2" placeholder="确认密码" autocomplete="off" class="el-form-item"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="success" @click="register()" class="el-form-item">注册</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="$router.push('/login')" class="el-form-item">返回登录</el-button>
            </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Register',
    data() {
        return {
            registerForm: {
                username: '',
                password1: '',
                password2: '',
            },
            registerFormRules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' }
                ],
                password1: [
                    { required: true, message: '请输入密码', trigger: 'blur' }
                ],
                password2: [
                    { required: true, message: '请确认密码', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        register() {
            this.$refs.registerForm.validate(valid => {
                if (valid) {
                    if (this.registerForm.password1 != this.registerForm.password2) {
                        this.$message.error('两次输入的密码不一致');
                        return;
                    }
                    this.$axios.post('/reader/register', {
                        username: this.registerForm.username,
                        password1: this.registerForm.password1,
                        password2: this.registerForm.password2
                    }).then(res => {
                        if (res.data.code == 1) {
                            this.$message.success('注册成功');
                            this.$router.push('/login');
                        } else {
                            this.$message.error(res.data.msg);
                        }
                    })
                }
            })
        }
    }
}
</script>

<style>
@import "../../styles/login.css";
</style>