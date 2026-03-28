export function getImagesUrl(imgPath) {
  if (!imgPath) return ''
  try {
    const img = require(`@/assets/${imgPath}`)
    return img
  } catch (e) {
    // console.error('图片加载失败:', imgPath)
    return ''
  }
}
