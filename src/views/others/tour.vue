<template>
  <div class="map-page">
    <bg-box />
    <!-- 内容窗口 -->
    <div class="content-wrapper" :class="{ 'sideBar-isOpen': sideBarState }">
      <div class="cw-position">
        <!-- cesium实例显示区域 -->
        <div v-once id="my-map" class="map-window" />
        <!-- 目录 -->
        <div class="list-box">
          <div class="list-title">巡演站点清单</div>
          <el-tree :data="treeData" :props="defaultProps" node-key="id" @node-click="treeNodeClick" />
        </div>
        <!-- 切换按钮 -->
        <button class="normal-btn_foggy button next" @click="handleStops('n')">
          <i class="el-icon-arrow-right" />
        </button>
        <button class="normal-btn_foggy button prev" @click="handleStops('p')">
          <i class="el-icon-arrow-left" />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import eventBus from '@/utils/bus'
// import { TCesium } from './TCesium'
import { initMap, flyToStop, initHandler } from './Cesium-google2D.js'
import bgBox from '../../components/bg-box.vue'
import { getTourList } from '../../api/tour.js'
export default {
  components: {
    bgBox
  },
  data() {
    return {
      // viewer: null, // viewer实例
      handler: null, // handler实例
      activeIndex: 0, // 当前播放的巡演站点索引
      defaultRoute: 'europe',
      sideBarState: false, // 是否显示侧边栏

      europeStops: [], // 欧洲巡演站点数据
      americanStops: [], // 美国巡演站点数据
      defaultProps: {
        label: `label`
      }
    }
  },
  europeRouteEntities: [], // 欧洲巡演路线实体列表
  americanRouteEntities: [], // 美国巡演路线实体实体列表
  computed: {
    // 当前播放的线路
    currentRoute() {
      return this.defaultRoute === 'europe'
        ? this.europeStops
        : this.americanStops
    },
    // 树形控件数据
    treeData() {
      return [
        {
          label: '欧洲',
          children: this.europeStops.map((stop) => {
            return {
              ...stop,
              label: `${stop.country} ${stop.city} ${stop.venue}`
            }
          })
        },
        {
          label: '美国',
          children: this.americanStops.map((stop) => {
            return {
              ...stop,
              label: `${stop.state} ${stop.city} ${stop.venue}`
            }
          })
        }
      ]
    }
  },
  created() {
    // 初始化时首先确定侧边栏状态
    const thebus = eventBus.getState('toggle-sidebar')
    this.sideBarState = thebus
    // console.log(thebus)
  },
  async mounted() {
    // 监听事件总线发送的侧边栏状态
    eventBus.$on('toggle-sidebar', (state) => {
      this.sideBarState = state
      console.log('侧边栏打开没', state)
    })
    try {
      // 请求数据
      await this.getTourData()
      // 初始化地图
      this.viewer = await initMap('my-map', {
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmMDkyMGJlMi0xMGIxLTQwMzktYjc2NS00NjFhYTc4OGM1YzgiLCJpZCI6NDA2NDUzLCJpYXQiOjE3NzQxODcxMjl9.P5hXeNfGqdm9b9x0Rj46_2CAqu8KvhQKINquNKHl5tM'
      })
      // this.Obeject.freeze(this.viewer)
      // 初始化handler
      this.handler = initHandler(this.viewer, (entity) => {
        this.handleEntityClick(entity)
      })
      // 绘制巡演路线
      this.europeRouteEntities = this.drawRoute(this.europeStops, {
        color: '#409EFF',
        id: '欧洲'
      }) // 欧洲路线
      this.americanRouteEntities = this.drawRoute(this.americanStops, {
        color: '#ff7d40',
        id: '美国'
      }) // 美国路线
      // 设置视角
      const firstStop = this.europeStops[0]
      const targetEntity = this.findCurrentStop(firstStop)
      flyToStop(this.viewer, firstStop, targetEntity.pointEntities)
    } catch (error) {
      console.error('地图初始化失败', error)
    }
  },
  beforeDestroy() {
    // 销毁handler实例
    if (this.handler) {
      this.handler.destroy()
      this.handler = null
    }
    // 销毁地图实例
    if (this.viewer) {
      this.viewer.entities.removeAll()
      this.viewer.destroy()
      this.viewer = null
    }
    this.europeRouteEntities = null
    this.americanRouteEntities = null
    // 取消事件总线监听
    eventBus.$off('toggle-sidebar')
  },
  methods: {
    // 绘制巡演路线
    drawRoute(data, style = {}) {
      const Cesium = window.Cesium
      if (!this.viewer) return []

      // 设置默认样式
      const defaultStyle = {
        color: '#409EFF',
        id: ''
      }
      const s = { ...defaultStyle, ...style }

      // 存储返回值
      const routeEntities = []

      // 1.绘制折线
      // 将途径站点坐标转换为一维数组
      const flatCoordinate = data.flatMap((stop) => [stop.lng, stop.lat])
      const line = this.viewer.entities.add({
        name: `On Tour (Finally) 巡回演出路线图`,
        // name: `The Tour (Finally) 巡演路线-${s.id || '未知'}站`,
        description: `
    <div>
      <p><strong>路线：</strong>${
  data === this.europeStops ? '欧洲' : '美国'
}站</p>
      <p><strong>场次：</strong>共${data.length}场</p>
      <p><strong>时长：</strong>${data === this.europeStops ? '39' : '31'}天</p>
    </div>
          `,
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArray(flatCoordinate),
          width: 10,
          material: new Cesium.ColorMaterialProperty(
            Cesium.Color.fromCssColorString(`${s.color}`)
          ),
          clampToGround: true
        }
      })
      routeEntities.push(line)

      // 2.绘制标点 + 标签
      // console.log(tourInfo.stops)
      data.forEach((stop) => {
        const pointEntities = this.viewer.entities.add({
          // name: `On Tour (Finally) 巡回演出路线图`,
          _stop_position: { lng: stop.lng, lat: stop.lat },
          _stop_route: `${stop.country ? 'europe' : 'american'}`,
          _stop_id: `${stop.id}`,
          // name: `Ava Max - The Tour (Finally) 欧美巡回演出路线图`,
          name: `${stop.country || stop.state}${stop.city}站`,
          position: Cesium.Cartesian3.fromDegrees(stop.lng, stop.lat),
          description: `
    <div>
      <p><strong>路线：</strong>${
  data === this.europeStops ? '欧洲' : '美国'
}站</p>
      <p><strong>地点：</strong>${stop.country || stop.state} ${stop.city}</p>
      <p><strong>场馆：</strong>${stop.venue}</p>
      <p><strong>场次：</strong>第${stop.id}场</p>
      <p><strong>日期：</strong>${stop.date}</p>
    </div>
          `,
          point: {
            pixelSize: 16,
            color: Cesium.Color.WHITE,
            outlineColor: Cesium.Color.fromCssColorString(`${s.color}`),
            outlineWidth: 5
          },
          label: {
            text: `${stop.country || stop.state}${stop.city}`,
            font: 'bold 15px sans-serif',
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            pixelOffset: new Cesium.Cartesian2(0, -35),
            fillColor: Cesium.Color.WHITE,
            outlineColor: Cesium.Color.fromCssColorString(`${s.color}`),
            outlineWidth: 3,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM
          }
        })
        routeEntities.push({ pointEntities, id: stop.id })
      })
      return routeEntities
    },
    // 获取巡演路线数据
    async getTourData() {
      try {
        const res = await getTourList()
        this.europeStops = res.data.tourList.europe
        this.americanStops = res.data.tourList.american
      } catch (error) {
        console.warn('获取巡演路线数据失败', error)
      }
    },
    // 找到并获取当前播放站点实体
    findCurrentStop(stop) {
      // 选择当前站点数据列表
      const currentEtities =
        stop.country
          ? this.europeRouteEntities
          : this.americanRouteEntities
      // 在数据列表中查找id相同的实体
      const targetEntity = currentEtities.find((item) => {
        return stop.id === item.id
      })

      // 返回实体
      return targetEntity
    },
    // 播放切换站点
    handleStops(mode) {
      let index = this.activeIndex
      const stop = this.currentRoute

      if (mode === 'n') {
        // 下一站
        if (index < stop.length - 1) {
          index++
        } else {
          this.defaultRoute =
            this.defaultRoute === 'europe' ? 'american' : 'europe'
          index = 0
        }
      } else if (mode === 'p') {
        // 上一站
        if (index > 0) {
          index--
        } else {
          this.defaultRoute =
            this.defaultRoute === 'europe' ? 'american' : 'europe'
          index = this.currentRoute.length - 1
        }
      }

      // 查找当前站点
      this.activeIndex = index
      const targetStop = this.currentRoute[index]
      const targetEntity = this.findCurrentStop(targetStop)
      // 设置到当前站点视角
      flyToStop(this.viewer, targetStop, targetEntity.pointEntities)
    },
    // 点击实体同步路线与索引
    handleEntityClick(entity) {
      if (!entity) return
      // 同步路线
      this.defaultRoute = entity._stop_route
      // 同步索引
      this.activeIndex = this.currentRoute.findIndex(item => {
        return item.id === entity._stop_id
      })
    },
    // 树形控件子节点数据
    treeNodeClick(data) {
      if (!data.id) return
      // 从树形节点返回的数据找到对应实体
      const entity = this.findCurrentStop(data)
      // 同步路线与索引
      this.handleEntityClick(entity.pointEntities)
      // 设置到当前站点视角
      flyToStop(this.viewer, data, entity.pointEntities)
    }
  }
}
</script>

<style lang="scss" scoped>
.map-page {
  margin-top: 80px;
  width: 100%;
  height: calc(100vh - 80px);
  background-color: #000;
  // display: flex;
  // align-items: center;
  // justify-content: center;
  position: relative;
}

.content-wrapper {
  width: 75vw;
  height: 75vh;
  box-shadow: 0 0 0 rgba(64, 158, 255, 0);
  // border: 1px solid #ff7d40;
  border: 1px solid rgba(64, 158, 255, 1);
  border-radius: 20px;
  overflow: hidden;
  display: flex;

  transition: all 0.2s ease-in-out !important;
  position: absolute;

  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  &:hover {
    box-shadow: 0 6px 20px rgba(64, 158, 255, 0.7);
    border: 1px solid rgba(64, 158, 255, 0.7);
    .map-controls {
      border-top: 1px solid rgba(64, 158, 255, 0.7);
    }
  }

  .cw-position {
    width: 100%;
    height: auto;
    background-color: aqua;
    position: relative;
    // 地图容器
    .map-window {
      width: 100%;
      height: 75vh;
      will-change: transform;
      transform: translateZ(0);
      position: relative;
    }
    // 站点列表
    .list-box {
      width: 16%;
      height: 75vh;
      background: rgba(38, 38, 38, 0.95);

      overflow-y: auto;
      justify-content: center;

      position: absolute;
      left: 0;
      top: 0;
      z-index: 1;
      .list-title {
        height: 5%;
        background: rgba(84, 84, 84, 1);
        color: #edffff;
        overflow: hidden;

        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    // 按钮
    .button {
      width: 50px;
      height: 50px;
      padding: 0;
      border-radius: 50%;
      box-shadow: 0 0px 15px rgba(0, 0, 0, 0.6);
      font-size: 23px;
      position: absolute;
      top: 50%;
      z-index: 1;
      &.next {
        right: 5%;
      }
      &.prev {
        left: 21%;
      }
    }
  }
}
.sideBar-isOpen {
  width: 82vw;
  height: 75vh;

  top: 50%;
  left: 57%;
  transform: translate(-50%, -50%);
}
</style>

<style scoped>
* {
  font-family: sans-serif;
}

.el-tree {
  background: #ffffff00;
  color: #edffff;
}

::v-deep .el-tree-node__label {
  width: 80%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

::v-deep .el-tree-node:focus > .el-tree-node__content {
  background-color: #0f4493 !important;
}
::v-deep .el-tree-node__content:hover {
  background-color: #0f4493 !important;
}
::v-deep .el-tree-node__content:active {
  background-color: #0f4493 !important;
}
</style>
