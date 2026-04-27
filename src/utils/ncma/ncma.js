import axios from 'axios'

const ncamAxios = axios.create({
  baseURL: 'http://localhost:3000'
})

// 请求拦截
ncamAxios.interceptors.request.use(
  config => {
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截
ncamAxios.interceptors.response.use(
  response => {
    const res = response

    // console.log(res)
    // return res
    if (res.status !== 200) {
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      // console.log('返回的res', res)
      return res
    }
  },
  error => {
    return Promise.reject(error)
  }
)

export default ncamAxios
