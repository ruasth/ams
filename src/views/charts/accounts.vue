<template>
  <div class="charts-accounts">
    <!-- 网格背景 -->
    <bgBox />

    <!-- 网格布局 -->
    <div class="accounts-grid">
      <!-- 标题盒子 -->
      <div class="accounts-grid-row first-row glassy-background">
        <!-- 标题与简介 -->
        <div class="title-box">
          <div class="the-title">ACCOUNTS · 账号数据统计</div>
          <div class="the-date">2026.01.29 | 3个主要平台</div>
          <span class="the-intro">统计账号为Ava Max的“Tik Tok”、“Spotify”、“Instagram”</span>
        </div>
        <!-- 数据简报 -->
        <div class="main-box">
          <div class="main-grid">
            <div class="data-item">
              <img src="@/assets/logo/TikTok_White.png" alt="tiktok" class="the-logo the-tiktok">
            </div>
            <div class="data-item">
              <img src="@/assets/logo/Spotify_Green.png" alt="spotify" class="the-logo the-spotify">
            </div>
            <div class="data-item">
              <img src="@/assets/logo/IG/Instagram_Glyph_Gradient.png" alt="instagram" class="the-logo the-instagram">
            </div>
            <div class="data-item">
              <label>粉丝</label><span>2,859,633</span>
            </div>
            <div class="data-item">
              <label>粉丝</label><span>7,903,410</span>
            </div>
            <div class="data-item">
              <label>粉丝</label><span>3,438,176</span>
            </div>
            <div class="data-item">
              <label>点赞</label><span>22,921,689</span>
            </div>
            <div class="data-item">
              <label>月度听众</label><span>28,827,380</span>
            </div>
          </div>
        </div>
      </div>
      <!-- 图表盒子 -->
      <div class="charts-wapper">
        <div class="accounts-grid-row second-row glassy-background">
          <div ref="chartContainer" class="chart-content" />
        </div>
        <!-- <div class="accounts-grid-row third-row glassy-background">1</div> -->
      </div>
    </div>
  </div>
</template>

<script>
import bgBox from '@/components/bg-box.vue'
import { getAccounts } from '@/api/charts'
import generaterSeries from '@/utils/generaterSeries'
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
      plat: {
      },
      accountsData: {
        // 图表数据

      }
    }
  },
  created() {
    this.getAccountsData()
  },
  beforeDestroy() {
    // 销毁图表实例
    if (this.chart) {
      this.chart.dispose()
      this.chart = null
    }
  },
  methods: {
    initChart() {
      // 通过 ref 获取 DOM 容器
      const chartDom = this.$refs.chartContainer
      if (!chartDom) return

      // 初始化图表实例
      this.chart = echarts.init(chartDom)

      const seriesData = generaterSeries(
        this.plat,
        this.accountsData,
        (key) => ({
          type: 'bar',
          smooth: true
        }))

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
          bottom: '6%',
          width: '80%',
          itemGap: 60
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
          data: this.accountsData.xAxisData
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
      this.chart.setOption(option)
    },
    // 获取图表数据
    async getAccountsData() {
      try {
        const res = (await getAccounts()).data.items

        this.plat = res.plat
        this.accountsData = res.data

        this.initChart()
      } catch (error) {
        console.error('获取数据失败', error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// 每个格子的单元大小
$unit-size: 9vh;
// gap大小
$gap-size: 2vh;

.charts-accounts {
  width: 100%;
  height: calc(100vh - 80px);
  margin: 80px 0 0 0;
  background-color: #000;
  overflow: auto;
  position: relative;

  .accounts-grid {
    // padding: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $gap-size;

    position: absolute;
    top: 80px;
    left: 50%;
    transform: translateX(-50%);

    .accounts-grid-row {
      width: ($unit-size) * 14;
    }

    .first-row {
      height: ($unit-size) * 2.5;
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
  // margin: 20px;
  // width: 40%;
  // height: 100%;

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

  .the-line {
    width: 90%;
    height: 1px;
    background-color: rgba(255, 255, 255, 0.3);
    margin-top: 8px;
  }

  .the-intro {
    font-size: 13px;
    line-height: 1.6;
    color: #aaa;
    max-height: 100px;
    overflow-y: auto;
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
    grid-template-rows: repeat(3, 0.7 * $unit-size);
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

  .data-item .the-logo {
    height: 100%;
    width: 100%;
    object-fit: contain;
    // transform: scale(1.2);

    &.the-tiktok {
      transform: scale(1.9);
      // background: #fff;
    }

    &.the-spotify {
      transform: scale(0.6);
    }

    &.the-instagram {
      transform: scale(0.7);
    }
  }

  .data-item label {
    font-size: 10px;
    color: #666;
    display: block;
    font-size: 18px;
    margin-bottom: 5px;
  }

  .data-item span {
    font-size: 23px;
    color: #eee;
    font-family: monospace;
  }
}
</style>
