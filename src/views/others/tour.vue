<template>
  <div class="map-page">
    <bg-box />
    <!-- 内容窗口 -->
    <div class="content-wrapper">
      <!-- cesium实例显示区域 -->
      <div id="my-map" class="map-window" />
      <!-- 切换按钮 -->
      <button class="normal-btn_foggy button next" @click="handleStops('n')">
        <i class="el-icon-arrow-right" />
      </button>
      <button class="normal-btn_foggy button prev" @click="handleStops('p')">
        <i class="el-icon-arrow-left" />
      </button>
    </div>
  </div>
</template>

<script>
// import { TCesium } from './TCesium'
import { initMap, flyToStop } from './Cesium-google2D.js'
import bgBox from '../../components/bg-box.vue'
import { getTourList } from '../../api/tour.js'
export default {
  components: {
    bgBox
  },
  data() {
    return {
      viewer: null, // viewer实例
      activeIndex: 0, // 当前播放的巡演站点索引
      defaultRoute: 'europe',
      europeStops: [], // 欧洲巡演站点数据
      americanStops: [], // 美国巡演站点数据
      europeRouteEntities: [], // 欧洲巡演路线实体列表
      americanRouteEntities: [] // 美国巡演路线实体实体列表
    }
  },
  computed: {
    // 当前播放的线路
    currentRoute() {
      return this.defaultRoute === 'europe'
        ? this.europeStops
        : this.americanStops
    }
  },
  created() { },
  async mounted() {
    try {
      // 请求数据
      await this.getTourData()
      // 初始化地图
      this.viewer = await initMap('my-map', {
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmMDkyMGJlMi0xMGIxLTQwMzktYjc2NS00NjFhYTc4OGM1YzgiLCJpZCI6NDA2NDUzLCJpYXQiOjE3NzQxODcxMjl9.P5hXeNfGqdm9b9x0Rj46_2CAqu8KvhQKINquNKHl5tM'
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
      flyToStop(this.viewer, firstStop, targetEntity)
    } catch (error) {
      console.error('地图初始化失败', error)
    }
  },
  beforeDestroy() {
    if (this.viewer) {
      this.viewer.destroy()
    }
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
      <p><strong>路线：</strong>${data === this.europeStops ? '欧洲' : '美国'}站</p>
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
          name: `On Tour (Finally) 巡回演出路线图`,
          // name: `Ava Max - The Tour (Finally) 欧美巡回演出路线图`,
          // name: `${stop.country || stop.state}${stop.city}\n${stop.venue}\n${stop.date
          // }`,
          position: Cesium.Cartesian3.fromDegrees(stop.lng, stop.lat),
          description: `
    <div>
      <p><strong>路线：</strong>${data === this.europeStops ? '欧洲' : '美国'}站</p>
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

      console.log(routeEntities)
      return routeEntities
    },
    // 获取巡演路线数据
    async getTourData() {
      try {
        const res = await getTourList()
        console.log(res)
        this.europeStops = res.data.tourList.europe
        this.americanStops = res.data.tourList.american
        // console.log(this.europeStops)
        // console.log(this.americanStops)
      } catch (error) {
        console.warn('获取巡演路线数据失败', error)
      }
    },
    // 找到并获取当前播放站点实体
    findCurrentStop(stop) {
      // 选择当前站点数据列表
      const currentEtities =
        this.defaultRoute === 'europe'
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
          index = this.currentRoute.lrngth - 1
        }
      }

      // 查找当前站点
      this.activeIndex = index
      const targetStop = this.currentRoute[index]
      const targetEntity = this.findCurrentStop(targetStop)
      // 设置到当前站点视角
      flyToStop(this.viewer, targetStop, targetEntity)
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
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.content-wrapper {
  width: 75vw;
  height: auto;
  box-shadow: 0 0 0 rgba(64, 158, 255, 0);
  // border: 1px solid #ff7d40;
  border: 1px solid rgba(64, 158, 255, 1);
  border-radius: 20px;
  overflow: hidden;

  transition: all 0.2s ease-in-out !important;
  position: relative;
  // top: 50%;
  // left: 50%;
  // transform: translate(-50%, -50%);

  &:hover {
    box-shadow: 0 6px 20px rgba(64, 158, 255, 0.7);
    border: 1px solid rgba(64, 158, 255, 0.7);

    .map-controls {
      border-top: 1px solid rgba(64, 158, 255, 0.7);
    }
  }

  .map-window {
    width: 100%;
    height: 75vh;
  }

  .button {
    width: 50px;
    height: 50px;
    padding: 0;
    border-radius: 50%;
    box-shadow: 0 0px 15px rgba(0, 0, 0, 0.6);
    font-size: 23px;
    position: absolute;
    top: 50%;

    // transform: translateY(-50%);
    &.next {
      right: 5%;
    }

    &.prev {
      left: 5%;
    }
  }
}
</style>
