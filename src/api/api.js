import axios from "axios";

// 创建后台管理端的axios实例
export const adminRequest = axios.create({
    baseURL: 'http://localhost:8088/admin',
    timeout: 5000
})

// 创建用户端的axios实例
export const userRequest = axios.create({
    baseURL: 'http://localhost:8088/',
    timeout: 5000
})