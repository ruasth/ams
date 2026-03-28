import axios from 'axios'
import { Message } from 'element-ui'

// 1. 创建 axios 实例
const service = axios.create({
  // 自动识别 .env 文件中的 VUE_APP_BASE_API
  baseURL: process.env.VUE_APP_BASE_API,
  // baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000 // 请求超时时间
})

// 2. 请求拦截器
service.interceptors.request.use(
  config => {
    return config
  },
  error => {
    console.error('请求出错：', error)
    return Promise.reject(error)
  }
)

// 3. 响应拦截器
service.interceptors.response.use(
  response => {
    /**
     * res 是 Mock 或 后端返回的原始数据
     * { code: 20000, data: { ... } }
     */
    const res = response.data

    if (res.code !== 20000) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    // 处理网络层错误（如 404, 500）
    console.error('响应报错：', error)
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
