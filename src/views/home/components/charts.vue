<template>
  <div
    ref="stickyElement"
    class="charts"
    :class="{ 'is-fixed': isStickyFixed, 'animate-start': isStickyFixed }"
  >
    <!-- 背景 -->
    <bg-box class="bg-box" style="z-index: -1" />
    <!-- echarts容器 -->
    <div class="charts-wrapper">
      <!-- 图表实例 -->
      <div ref="piano" class="charts-item" />
    </div>
    <!-- 标题 -->
    <div class="title-wrapper">
      <div class="title-item">
        <span class="the-tag"> CHARTS · 数据图表</span>
        <h2 class="the-title">及时洞悉数据走向</h2>
      </div>
    </div>
    <!-- 底部文字 -->
    <div class="footer-wrapper">
      <div class="footer-item">
        <el-button
          class="more-btn normal-btn_white"
          round
          @click="$router.push('/charts')"
        >
          进入数据馆
          <i class="el-icon-right" />
        </el-button>
        <p class="footer-hint">滑动探索更多动态</p>
      </div>
    </div>
  </div>
</template>

<script>
import bgBox from '@/components/bg-box.vue'
import stickyMixin from '@/mixin/sticky.js'
// 导入echarts
import * as echarts from 'echarts/core'
import {
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent
} from 'echarts/components'
import { BarChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
// 注册echarts
echarts.use([
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BarChart,
  CanvasRenderer
])

export default {
  components: {
    bgBox
  },
  mixins: [stickyMixin],
  data() {
    return {
      fixedTag: false,
      piano: null,
      data1: [],
      data2: [],
      xAxisData: []
    }
  },
  computed: {},
  watch: {
    fixedTag(newVal, oldVal) {
      if (newVal) {
        this.initECharts()
      }
    }
  },
  beforeDestroy() {
    // 销毁echarts实例
    if (this.piano) {
      this.piano.dispose()
    }
  },
  methods: {
    initECharts() {
      if (!this.isStickyFixed) return
      // 存储echarts实例
      this.piano = echarts.init(this.$refs.piano)

      // 生成数据
      for (let i = 0; i < 100; i++) {
        this.xAxisData.push('A' + i)
        this.data1.push((Math.sin(i / 5) * (i / 5 - 10) + i / 6) * 6)
        this.data2.push((Math.cos(i / 5) * (i / 5 - 10) + i / 6) * 6)
      }

      // 配置项
      const option = {
        // title: {
        //   text: 'Bar Animation Delay'
        // },
        legend: {
          show: false
        },
        xAxis: {
          data: this.xAxisData,
          show: false
        },
        yAxis: {
          show: false
        },
        grid: {
          left: '1%',
          right: '1%',
          top: '10%',
          bottom: '15%',
          containLabel: true
        },
        series: [
          {
            name: 'bar',
            type: 'bar',
            data: this.data1,
            barWidth: 8,
            emphasis: {
              focus: 'series'
            },
            animationDelay: function(idx) {
              return idx * 10
            }
          },
          {
            name: 'bar2',
            type: 'bar',
            data: this.data2,
            barWidth: 8,
            emphasis: {
              focus: 'series'
            },
            animationDelay: function(idx) {
              return idx * 10 + 100
            }
          }
        ],
        animationEasing: 'elasticOut',
        animationDelayUpdate: function(idx) {
          return idx * 5
        }
      }

      // 将配置项渲染到实例
      this.piano.setOption(option)
    }
  }
}
</script>

<style lang="scss" scoped>
.charts {
  width: 100%;
  height: 100vh;
  background-color: #000;
  position: relative;
  top: 80px;
  left: 0;
  z-index: 3;
  display: flex;
  justify-content: center;
  align-items: center;

  &.is-fixed {
    position: fixed;
    top: 80px;
    left: 0;
    z-index: 4;
  }

  // 动画
  .charts-item,
  .title-item,
  .footer-item {
    opacity: 0;
    transform: translateY(60px);
    transition: all 1s cubic-bezier(0.16, 1, 0.3, 1);
  }

  &.animate-start {
    .charts-item {
      opacity: 1;
      transform: translateY(0);
      transition-delay: 0.2s;
    }
    .title-item {
      opacity: 1;
      transform: translateY(0);
    }
    .footer-item {
      opacity: 1;
      transform: translateY(0);
      transition-delay: 0.4s;
    }
  }
}

// 图表容器
.charts-item {
  width: 90vw;
  height: 90vh;
  transform: translate(-50%, -50%);
}
// 底部文字
.title-item {
  span {
    font-size: 35px;
    color: #fff;
    font-weight: 500;
    letter-spacing: 1px;
  }
  h2 {
    font-size: 58px;
    color: #fff;
    font-weight: 700;
    letter-spacing: 4px;
  }
}
// 底部文字
.footer-item {
  .more-btn {
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: #fff;
    padding: 15px 45px;
    font-size: 22px;
    letter-spacing: 2px;
    backdrop-filter: blur(10px);
  }
  .footer-hint {
    color: rgba(255, 255, 255, 0.3);
    font-size: 16px;
    margin-top: 20px;
    letter-spacing: 1px;
        text-align: center;
  }
}

// 容器定位
.charts-wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.title-wrapper {
  position: absolute;
  top: 15%;
  left: 10%;
}
.footer-wrapper {
  position: absolute;
  bottom: 22%;
  left: 50%;
  transform: translateX(-50%);
}
</style>
