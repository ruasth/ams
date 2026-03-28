export default function generaterSeries(nameMap, dataContainer, extraConfig = () => ({})) {
  // 生成series (歌曲名 数据 配置项)
  return Object.keys(nameMap).map(key => {
    const baseConfig = {
      name: nameMap[key],
      data: dataContainer[key] || []
    }
    // 最终格式 { name, data, stack, type, smooth }
    return {
      ...baseConfig,
      ...extraConfig(key)
    }
  })
}
