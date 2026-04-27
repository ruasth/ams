const admin = `admin-token-${Date.now()}`

module.exports = [
  // 登录返回Token
  {
    url: '/user/login',
    type: 'post',
    response: config => {
      const { name, pass } = config.body
      if (name === 'admin' && pass === '123456') {
        return {
          code: 20000,
          data: {
            token: admin
          }
        }
      } else {
        return {
          code: 50008,
          message: '用户名或密码错误'
        }
      }
    }
  }
]
