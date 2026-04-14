// Cesium-google2D.js
// import * as Cesium from 'cesium'
const CesiumLib = window.Cesium

// 默认token
const DEFAULT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmMDkyMGJlMi0xMGIxLTQwMzktYjc2NS00NjFhYTc4OGM1YzgiLCJpZCI6NDA2NDUzLCJpYXQiOjE3NzQxODcxMjl9.P5hXeNfGqdm9b9x0Rj46_2CAqu8KvhQKINquNKHl5tM'

/**
 * 初始化Cesium Google地图
 * @param {string} containerId - DOM 元素 ID
 * @param {object} options - 可选配置
 * @param {string} options.token - Cesium Ion 访问令牌
 * @param {object} options.viewerOptions - Viewer 其他配置
 * @returns {Promise<Cesium.Viewer>} viewer 实例
 */
export async function initMap(containerId, options = {}) {
  const token = options.token || DEFAULT_TOKEN

  // 确保 Cesium 全局对象可用（如果使用模块化引入则无需此步）
  // CesiumLib = window.Cesium
  if (!CesiumLib) {
    throw new Error('Cesium未加载')
  }

  // ion令牌
  CesiumLib.Ion.defaultAccessToken = token

  // 创建Viewer 禁用默认基础图层
  const viewer = new CesiumLib.Viewer(containerId, {
    animation: false,
    baseLayer: false, // 不显示默认基础图层
    baseLayerPicker: false,
    geocoder: CesiumLib.IonGeocodeProviderType.GOOGLE,
    timeline: false,
    sceneModePicker: false,
    // sceneMode: CesiumLib.SceneMode.SCENE2D,
    navigationHelpButton: false,
    homeButton: false,
    ...options.viewerOptions // 允许外部覆盖配置
  })

  // 隐藏版权信息
  if (viewer._cesiumWidget && viewer._cesiumWidget._creditContainer) {
    viewer._cesiumWidget._creditContainer.style.visibility = 'hidden'
  }

  try {
    // 添加Google影像图层 资产ID
    const imageryProvider = await CesiumLib.IonImageryProvider.fromAssetId(3830184)
    const googleLayer = new CesiumLib.ImageryLayer(imageryProvider)
    viewer.imageryLayers.add(googleLayer)

    // 添加地形提供者 资产ID
    const terrainProvider = await CesiumLib.CesiumTerrainProvider.fromIonAssetId(1)
    viewer.terrainProvider = terrainProvider

    console.log('地图初始化成功')
    return viewer
  } catch (error) {
    console.error('地图资源加载失败：', error)
    throw error
  }
}

// 飞行到指定位置
export function flyToStop(viewer, stop, entity) {
  // console.log(viewer, stop)

  if (!viewer || !stop) return
  viewer.camera.flyTo({
    // destination: stop,
    destination: CesiumLib.Cartesian3.fromDegrees(stop.lng, stop.lat, 20000),
    duration: 1.5
  })
  // 设置当前站点为选择项
  viewer.selectedEntity = entity
}

// 点击获取实体
export function initHandler(viewer, onEntityClick) {
  const handler = new CesiumLib.ScreenSpaceEventHandler(viewer.scene.canvas)

  handler.setInputAction((e) => {
    // 获取屏幕点击位置
    const pick = viewer.scene.pick(e.position)
    // 匹配点击位置的实体
    if (CesiumLib.defined(pick)) {
      const entity = pick.id
      flyToStop(viewer, entity._stop_position, entity)
      // 将实体传入回调传回组件
      if (typeof onEntityClick === 'function') {
        onEntityClick(entity)
      }
    }
    // console.log(handler, pe)
  }, CesiumLib.ScreenSpaceEventType.LEFT_CLICK)

  return handler
}
