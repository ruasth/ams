// vercel-mock.js
const fs = require('fs')
const path = require('path')

// 读取 mock 文件夹下所有 .js 文件（除了 index.js）
const mockDir = path.join(__dirname, 'mock')
const routeHandlers = []

if (fs.existsSync(mockDir)) {
  const files = fs.readdirSync(mockDir)
  files.forEach(file => {
    if (file.endsWith('.js') && file !== 'index.js') {
      const module = require(path.join(mockDir, file))
      if (Array.isArray(module)) {
        routeHandlers.push(...module)
      }
    }
  })
}

module.exports = function handler(req, res) {
  const { method, url } = req
  const pathname = url.split('?')[0]

  const matched = routeHandlers.find(item =>
    item.url === pathname && item.type.toLowerCase() === method.toLowerCase()
  )

  if (matched) {
    const query = {}
    const searchParams = new URL(url, `http://${req.headers.host}`).searchParams
    for (const [key, val] of searchParams.entries()) {
      query[key] = val
    }
    const mockReq = { query, body: req.body }
    const result = matched.response(mockReq)
    res.status(200).json(result)
  } else {
    res.status(404).json({ code: 404, message: 'Mock API not found' })
  }
}
