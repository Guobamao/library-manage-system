import axios from "axios";
import router from "./router";

// 创建后台管理端的axios实例
const adminRequest = axios.create({
    baseURL: 'http://localhost:8088/api/admin',
    timeout: 5000,
})

adminRequest.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['token'] = token
    }
    return config;
}, error => {
    return Promise.reject(error);
})
adminRequest.interceptors.response.use(response => {
    return response;
}, error => {
    if (error.response && error.response.status === 401) {
        alert('登录过期，请重新登录')
        localStorage.clear()
        router.replace('/login')
    }
    console.log("error:" + error)
    return Promise.reject(error);
})

// 创建用户端的axios实例
const userRequest = axios.create({
    baseURL: 'http://localhost:8088/api/user',
    timeout: 5000
})

userRequest.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['token'] = token
    }
    return config;
}, error => {
    return Promise.reject(error);
})
userRequest.interceptors.response.use(response => {
    return response;
}, error => {
    if (error.response && error.response.status === 401) {
        alert('登录过期，请重新登录')
        localStorage.clear()
        router.replace('/login')
    }
    console.log("error:" + error)
    return Promise.reject(error);
})

export {adminRequest, userRequest}