<template>
  <div class="charts-albums">
    <!-- 网格背景 -->
    <bgBox />

    <!-- 网格布局 -->
    <div class="albums-grid">
      <!-- 标题盒子 -->
      <div class="albums-grid-row first-row glassy-background">
        <!-- 标题与简介 -->
        <div class="title-box">
          <div class="the-title">ALBUMS · 专辑流媒统计</div>
          <div class="the-date">2026.02.28</div>
          <span
            class="the-intro"
          >统计了Ava Max的三张录音室专辑：<br><br>· Heaven & Hell<br>·
            Diamonds & Dancefloor<br>· Don't Click Play
          </span>
        </div>
        <!-- 数据简报 -->
        <div class="main-box">
          <div class="main-grid">
            <div class="data-item">
              <img
                src="@/assets/Cover/heavenandhell.jpg"
                alt="tiktok"
                class="the-cover jumpy-transition"
                @click="changeAlbumData('hnh')"
              >
              <label class="album-name">Heaven & Hell</label>
            </div>
            <div class="data-item">
              <img
                src="@/assets/Cover/diamondsanddancefloors.jpg"
                alt="spotify"
                class="the-cover jumpy-transition"
                @click="changeAlbumData('dnd')"
              >
              <label class="album-name">Diamonds & Dancefloors</label>
            </div>
            <div class="data-item">
              <img
                src="@/assets/Cover/dontclickplay.jpg"
                alt="instagram"
                class="the-cover jumpy-transition"
                @click="changeAlbumData('dcp')"
              >
              <label class="album-name">Don't Click Play</label>
            </div>
            <div class="data-item">
              <label>总流媒</label><span>5,677,687,559</span>
            </div>
            <div class="data-item">
              <label>总流媒</label><span>647,070,253</span>
            </div>
            <div class="data-item">
              <label>总流媒</label><span>3,438,176</span>
            </div>
            <div class="data-item">
              <label>日增</label><span>59,182,628</span>
            </div>
            <div class="data-item"><label>日增</label><span>204,311</span></div>
            <div class="data-item"><label>日增</label><span>87,609</span></div>
          </div>
        </div>
      </div>
      <!-- 图表盒子 -->
      <div class="charts-wapper">
        <div class="albums-grid-row second-row glassy-background">
          <div ref="chartContainer" class="chart-content" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import bgBox from '@/components/bg-box.vue'
import { gethnh, getdnd, getdcp } from '@/api/charts'
import generaterSeries from '@/utils/generaterSeries.js'
// echart引入
import * as echarts from 'echarts/core'
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  ToolboxComponent
} from 'echarts/components'
import { BarChart } from 'echarts/charts'
import { UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
// 注册必要的组件
echarts.use([
  GridComponent,
  TooltipComponent,
  LegendComponent,
  ToolboxComponent,
  BarChart,
  CanvasRenderer,
  UniversalTransition
])
export default {
  components: {
    bgBox
  },
  data() {
    return {
      chart: null, // 图表实例
      songName: {
      },
      isStack: {
      },
      albumData: {
      }
    }
  },
  computed: {
    // 计算返回请求类型
    currentType() {
      const type = this.$route.query.type || 'hnh'
      // console.log('currentType', type)
      return type
    }
  },
  watch: {
    '$route.query.type': {
      handler(newType) {
        // console.log('监听到的新type', newType)

        // this.chart.dispose()
        // this.chart = null
        this.getAlbumsData()
      },
      immediate: true
    }
  },
  created() {
    // 获取专辑图表数据
    this.getAlbumsData()
  },
  mounted() {
  },
  beforeDestroy() {
    // 销毁图表实例
    if (this.chart) {
      this.chart.dispose()
      this.chart = null
    }
  },
  methods: {
    // 初始化图表
    initChart() {
      // 通过 ref 获取 DOM 容器
      const chartDom = this.$refs.chartContainer
      if (!chartDom) return

      // 初始化图表实例
      this.chart = echarts.init(chartDom)

      const seriesData = generaterSeries(
        this.songName,
        this.albumData,
        (key) => ({
          stack: this.isStack[key] || null,
          type: 'bar',
          smooth: true
        })
        // 最终格式 { name, data, stack, type, smooth }
      )

      // 配置项
      const option = {
        grid: {
          top: '8%',
          bottom: '19%',
          left: '10%',
          right: '5%'
          // containLabel: true // 防止坐标轴标签溢出
        },
        legend: {
          textStyle: { color: '#fff' },
          type: 'scroll',
          orient: 'horizontal', // 横向排列
          bottom: '5%',
          width: '80%',
          itemGap: 70,
          pageButtonGap: 20,
          pageTextStyle: { color: '#fff' },
          pageIconColor: '#409eff'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross' // 同时显示垂直和水平指示线
          },
          backgroundColor: 'rgba(0,0,0,0.7)',
          borderColor: '#1890ff',
          textStyle: {
            color: '#fff',
            fontSize: 12
          },
          confine: true, // 将 tooltip 限制在图表区域内
          enterable: true, // 允许鼠标进入 tooltip
          extraCssText: 'max-height: 350px; overflow: auto;', // 限制高度
          order: 'valueDesc' // 按数值降序排列
        },
        xAxis: {
          type: 'category',
          axisLabel: {
            color: '#fff'
          },
          data: this.albumData.xAxisData
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            color: '#fff'
          }
        },
        series: seriesData
      }

      // 渲染图表
      this.chart.setOption(option, { replaceMerge: ['series', 'xAxis'] })
    },
    // 请求图表数据
    async getAlbumsData() {
      let request = null
      if (this.currentType === 'hnh') {
        request = gethnh()
      } else if (this.currentType === 'dnd') {
        request = getdnd()
      } else if (this.currentType === 'dcp') {
        request = getdcp()
      } else {
        this.currentType = 'hnh'
        request = gethnh()
      }

      try {
        const res = (await request).data.items
        console.log(res)

        this.songName = res.songName
        this.albumData = res.data
        this.isStack = res.isStack || {}

        this.initChart()
      } catch (error) {
        console.error('获取数据失败', error)
      }
    },
    // 切换专辑 修改type
    changeAlbumData(type) {
      this.$router.push({ query: { type }})
    }
  }
}
</script>

<style lang="scss" scoped>
// 每个格子的单元大小
$unit-size: 9vh;
// gap大小
$gap-size: 2vh;

.charts-albums {
  width: 100%;
  height: calc(100vh - 80px);
  margin: 80px 0 0 0;
  background-color: #000;
  overflow: auto;
  position: relative;

  .albums-grid {
    // padding: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $gap-size * 0.5;

    position: absolute;
    top: 80px;
    left: 50%;
    transform: translateX(-50%);

    .albums-grid-row {
      width: ($unit-size) * 14;
    }

    .first-row {
      height: ($unit-size) * 3;
      display: flex;
    }

    .second-row {
      height: ($unit-size) * 6;

      .chart-content {
        width: 100%;
        height: 100%;
      }
    }

    .third-row {
      height: ($unit-size) * 0.5;
      border-top: none;
    }
  }
}

.title-box {
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  padding: 15px 30px 15px 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;

  .the-title {
    font-size: 35px;
    font-weight: 700;
    letter-spacing: 4px;
    color: #409eff;
    text-shadow: 0 0 10px rgba(0, 243, 255, 0.3);
  }

  .the-date {
    font-size: 24px;
    color: #e0e0e0;
    margin-bottom: 6px;
    font-family: monospace;
  }

  .the-intro {
    font-size: 13px;
    line-height: 1.6;
    color: #aaa;
    max-height: 100px;
    overflow-y: auto;
  }

  .album-select {
    width: 100%;
    height: auto;
    background-color: #409eff;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 30%;

    .select-item {
      width: auto;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;

      .select-cover {
        width: auto;
        height: 40%;
      }
    }
  }
}

.main-box {
  padding: 10px;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;

  .main-grid {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 0.9 * $unit-size);
    align-items: center;
    justify-items: center;
    align-content: center;
  }

  .data-item {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }

  .the-cover {
    height: 55%;
    width: auto;
    border-radius: 15%;
    margin-bottom: 5px;
  }

  .data-item label {
    font-size: 10px;
    color: #666;
    display: block;
    font-size: 18px;
    margin-bottom: 5px;

    &.album-name {
      font-size: 18px;
    }
  }

  .data-item span {
    font-size: 23px;
    color: #eee;
    font-family: monospace;
  }
}
</style>
