<template>
  <div class="charts-singles">
    <!-- 网格背景 -->
    <bgBox />

    <!-- 网格布局 -->
    <div class="singles-grid">
      <!-- 标题盒子 -->
      <div class="singles-grid-row first-row glassy-background">
        <!-- 标题与简介 -->
        <div class="title-box">
          <div class="the-title">SINGLES · 单曲流媒统计</div>
          <div class="the-date">2026.02.26 | 共28首单曲</div>
          <span
            class="the-intro"
          >统计歌曲仅限Ava
            Max的首次发行与正式改版，不包括“Remix”、“Live”、“Acoustic”等版本</span>
        </div>
        <!-- 数据简报 -->
        <div class="main-box">
          <div class="main-grid">
            <div class="data-item">
              <label>总流媒</label><span>5,062,210,501</span>
            </div>
            <div class="data-item">
              <label>昨日总流媒</label><span>5,062,634,853</span>
            </div>
            <div class="data-item">
              <label>日增</label><span>+1,570,587</span>
            </div>
            <div class="data-item">
              <label>昨日日增</label><span>+1,575,648</span>
            </div>
            <div class="data-item">
              <label>百分比</label><span>-0.32%</span>
            </div>
            <div class="data-item"><label>均增</label><span>56,092</span></div>
          </div>
        </div>
      </div>
      <!-- 图表盒子 -->
      <div class="singles-grid-row second-row glassy-background">
        <div ref="chartContainer" class="chart-content" />
      </div>
    </div>
  </div>
</template>

<script>
import bgBox from '@/components/bg-box.vue'
import { getSingles } from '@/api/charts'
import generaterSeries from '@/utils/generaterSeries.js'
// echart引入
import * as echarts from 'echarts/core'
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  ToolboxComponent
} from 'echarts/components'
import { LineChart } from 'echarts/charts'
import { UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
// 注册必要的组件
echarts.use([
  GridComponent,
  TooltipComponent,
  LegendComponent,
  ToolboxComponent,
  LineChart,
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
      singlesName: {
        // 单曲名称
        // TheMotto: 'The Motto',
        // AlonePtII: 'Alone Pt.II',
        // Whatever: 'Whatever',
        // IntoYourArms: 'Into Your Arms',
        // SlowDance: 'Slow Dance',
        // NotYourBarbieGirl: 'Not Your Barbie Girl',
        // ChristmasWithoutYou: 'Christmas Without You',
        // CarKeysAyla: 'CarKeys (Ayla)',
        // ForeverYoung: 'Forever Young',
        // LetItBeMe: 'Let It Be Me',
        // OnMe: 'On Me',
        // EverytimeICry: 'Everytime I Cry',
        // FreakingMeOut: 'Freaking Me Out',
        // ChooseYourFighter: 'Choose Your Fighter',
        // Tabu: 'Tabu',
        // SoAmIFeatNCT127: 'So Am I (Feat.NCT127)',
        // MyOhMy: 'My Oh My',
        // MyWay: 'My Way',
        // SadBoy: 'Sad Boy',
        // KingsAndQueensPt2: 'Kings & Queens Pt.2',
        // MakeUp: 'Make Up',
        // ClapYourHands: 'Clap Your Hands',
        // OnSomebody: 'On Somebody',
        // BloodSweatAndTears: 'Blood, Sweat, & Tears',
        // OneWish: '1 Wish',
        // BabyItsBoth: `Baby It's Both`,
        // TearMeDown: 'Tear Me Down'
      },
      singlesData: {
        // 图表数据
        // TheMotto: ['', '', 240915, 206676, 244661, 246127, 253283],
        // AlonePtII: ['', '', 297798, 265153, 288061, 306877, 324061],
        // Whatever: ['', '', 248296, 207154, 273305, 254642, 254442],
        // IntoYourArms: ['', '', 146459, 207154, 157424, 156238, 146174],
        // SlowDance: ['', '', 13529, 13061, 14971, 15199, 15056],
        // NotYourBarbieGirl: ['', '', 50396, 46515, 49310, 48358, 46778],
        // ChristmasWithoutYou: ['', '', 4011, 4017, 4326, 3974, 3910],
        // CarKeysAyla: ['', '', 43963, 34386, 46590, 47972, 50634],
        // ForeverYoung: ['', '', 177125, 143859, 159178, 167976, 159379],
        // LetItBeMe: ['', '', 16634, 13813, 17324, 16779, 19433],
        // OnMe: ['', '', 7609, 7093, 1975, 8004, 8512],
        // EverytimeICry: ['', '', 19414, 15276, 18059, 20172, 20794],
        // FreakingMeOut: ['', '', 11932, 10973, 13030, 13682, 13047],
        // ChooseYourFighter: ['', '', 148463, 135214, 136019, 135803, 121162],
        // Tabu: ['', '', 9016, 7898, 9580, 10019, 10878],
        // SoAmIFeatNCT127: ['', '', 10085, 9944, 11097, 10334, 10044],
        // MyOhMy: ['', '', 36009, 31370, 36835, 35858, 34714],
        // MyWay: ['', '', 7682, 7310, 8196, 8149, 8586],
        // SadBoy: ['', '', 4394, 3829, 4631, 4555, 4768],
        // KingsAndQueensPt2: ['', '', 12368, 10516, 10905, 10972, 10991],
        // MakeUp: ['', '', 1658, 1483, 1811, 1826, 1968],
        // SpotAFake: ['', '', 15759, 13523, 16157, 15881, 15742],
        // ClapYourHands: ['', '', 1546, 1419, 1695, 1923, 1774],
        // OnSomebody: ['', '', 1328, 1276, 1431, 1537, 1404],
        // BloodSweatAndTears: ['', '', 1944, 1782, 1989, 1950, 2061],
        // OneWish: ['', '', 1237, 1331, 1194, 1240, 1225],
        // BabyItsBoth: ['', '', 11838, 11837, 11696, 11464, 12207],
        // TearMeDown: ['', '', 16136, 13449, 16141, 18137, 17560],
        // xAxisData: [
        //   '02-20',
        //   '02-21',
        //   '02-22',
        //   '02-23',
        //   '02-24',
        //   '02-25',
        //   '02-26'
        // ]
      },
      isStack: {}
    }
  },
  created() {
    this.getSinglesData()
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
        this.singlesName,
        this.singlesData,
        (key) => ({
          type: 'line',
          smooth: true
        })
      )

      // 配置项
      const option = {
        grid: {
          top: '10%',
          bottom: '18%',
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
          itemGap: 60,
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
          data: this.singlesData.xAxisData
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
    async getSinglesData() {
      try {
        const res = (await getSingles()).data.items
        console.log(res.songName)

        this.singlesName = res.songName
        this.singlesData = res.data
        this.isStack = res.isStack || {}

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

.charts-singles {
  width: 100%;
  height: calc(100vh - 80px);
  margin: 80px 0 0 0;
  background-color: #000;
  overflow: auto;
  position: relative;

  .singles-grid {
    // padding: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $gap-size;

    position: absolute;
    top: 90px;
    left: 50%;
    transform: translateX(-50%);

    .singles-grid-row {
      width: ($unit-size) * 14;
    }

    .first-row {
      height: ($unit-size) * 2;
      display: flex;
    }

    .second-row {
      height: ($unit-size) * 6;

      .chart-content {
        width: 100%;
        height: 100%;
      }
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
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  .main-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    column-gap: 38px;
    row-gap: 25px;
    // margin-bottom: 20px;
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
