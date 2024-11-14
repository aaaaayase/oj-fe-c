import axios from 'axios'
import { getToken, removeToken } from './cookie';
import router from '@/router';

axios.defaults.headers["Content-Type"] = "application/json;charset=utf-8"

// 不同的接口请求的是不同的地址 这里起到类似于基类的作用
const service = axios.create({
    baseURL: "/dev-api",
    timeout: 5000,
})

// 请求拦截器
service.interceptors.request.use(
    (config) => {
        if (getToken()) {
            config.headers["Authorization"] = "Bearer " + getToken();
        }
        return config;
    },
    // 返回出现异常
    (error) => {
        console.log(error)
        Promise.reject(error);
    }
);

// 响应拦截器
service.interceptors.response.use(
    (res) => {
        // 未设置状态码则默认成功状态
        const code = res.data.code;
        const msg = res.data.msg;
        // 当redis中的token失效时返回3001 这时就需要返回登录页面
        if (code === 3001) {
            ElMessage.error(msg);
            removeToken()
            router.push('/oj/login')
            return Promise.reject(new Error(msg));
        } else if (code !== 1000) {
            ElMessage.error(msg);
            // 在控制台打印错误信息 类似于异常的抛出
            return Promise.reject(new Error(msg));
        } else {
            return Promise.resolve(res.data);
        }
    },
    // 返回出现异常
    (error) => {
        return Promise.reject(error);
    }
);


// 将service暴露出去
export default service

// 从前端页面直接发起请求会有同源问题
// 要使用代理服务器 前端请求-->代理服务器-->后端接收请求