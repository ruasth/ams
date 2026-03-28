export class TCesium {
  viewer = null;
  scene = null;
  Cesium = window.Cesium

  /**
   * 构造器函数：实例化cesium
   * @param {*} dom 节点id
   */
  constructor(dom) {
    this.Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmMDkyMGJlMi0xMGIxLTQwMzktYjc2NS00NjFhYTc4OGM1YzgiLCJpZCI6NDA2NDUzLCJpYXQiOjE3NzQxODcxMjl9.P5hXeNfGqdm9b9x0Rj46_2CAqu8KvhQKINquNKHl5tM'
    this.viewer = new this.Cesium.Viewer(dom, {
      homeButton: false, // 是否显示home按钮
      sceneModePicker: false, // 维度切换
      baseLayerPicker: false, // 影像切换
      animation: false, // 是否显示动画控件
      timeline: false, // 是否显示时间线控件
      infoBox: false, // 是否显示点击要素之后显示的信息
      selectionIndicator: false, // 要素选中框
      geocoder: false, // 是否显示地名查找控件
      fullscreenButton: false, // 全屏显示
      shouldAnimate: false,
      navigationHelpButton: false // 是否显示帮助信息控件
    })
    // this.viewer._cesiumWidget._creditContainer.style.display = 'none'
    this.viewer._cesiumWidget._creditContainer.style.visibility = 'hidden'
    this.scene = this.viewer.scene
  }

  // 地图放大
  zoomIn() {
    // viewer 为 Viewer 对象
    const position = this.viewer.camera.position
    const cameraHeight = this.viewer.scene.globe.ellipsoid.cartesianToCartographic(position).height
    // 每次缩小 20 倍，参数可改
    const moveRate = cameraHeight / 20.0
    this.viewer.camera.moveForward(moveRate)
  }

  // 地图缩小
  zoomOut() {
    // viewer 为 Viewer 对象
    const position = this.viewer.camera.position
    const cameraHeight = this.viewer.scene.globe.ellipsoid.cartesianToCartographic(position).height
    // 每次缩小 20 倍，参数可改
    const moveRate = cameraHeight / 20.0
    this.viewer.camera.moveBackward(moveRate)
  }

  /**
   * 相机视角移动函数
   * @param lon 目标经度
   * @param lat 目标纬度
   * @param height  相机高度
   * @param heading  航向角
   * @param pitch  俯仰角
   * @param roll   距中心的距离，以米为单位
   * @param duration  飞行时间
   */
  flyToTarget(lon, lat, height, heading, pitch, roll, duration) {
    this.viewer.camera.flyTo({
      destination: this.Cesium.Cartesian3.fromDegrees(lon, lat, height), // 经纬度以及相机离地高度
      orientation: {
        heading: this.Cesium.Math.toRadians(heading), // 航向角
        pitch: this.Cesium.Math.toRadians(pitch), // 俯仰角
        roll: roll // 距中心的距离，以米为单位
      },
      duration: duration // 飞行时间
    })
  }

  // 销毁场景
  clearScene() {
    this.viewer.destroy()
  }
}
