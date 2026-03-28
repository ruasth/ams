<template>
  <div class="charts-page">
    <!-- 网格背景 -->
    <bg-box />

    <!-- 网格布局 -->
    <div class="charts-grid">
      <div class="charts-grid-row first-row">
        <div class="grid-item first-title the-tilte glassy-background">
          数据<br>简报
        </div>
        <div class="grid-item first-block glassy-background">
          <span v-for="(item, index) in firstRow" :key="index">{{ item.title }}<br>{{ item.data }}</span>
        </div>
      </div>
      <div class="charts-grid-row second-row">
        <div class="grid-item second-title the-tilte glassy-background">
          专辑<br>数据
        </div>
        <router-link
          v-for="(item, index) in secondRow"
          :key="index"
          :to="item.to"
          :class="item.class"
          class="grid-item second-block glassy-background"
        >{{ item.content }}</router-link>
      </div>
      <div class="charts-grid-row third-row">
        <div class="grid-item third-title the-tilte glassy-background">
          账号<br>&<br>单曲
        </div>
        <router-link
          v-for="(item, index) in thirdRow"
          :key="index"
          :to="item.to"
          :class="item.class"
          class="grid-item third-block glassy-background"
        >{{ item.content }}</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import bgBox from '@/components/bg-box.vue'
export default {
  components: {
    bgBox
  },
  data() {
    return {
      firstRow: [
        { title: '日流媒', data: '+3,511,662	' },
        { title: '粉丝', data: '+165,854' },
        { title: '月度听众', data: '28,827,380' }
      ],
      secondRow: [
        {
          to: '/charts/albums?type=hnh',
          class: 'second-hnh',
          content: 'Heaven & Hell'
        },
        {
          to: '/charts/albums?type=dnd',
          class: 'second-dnd',
          content: 'Diamonds & Dancefloors'
        },
        {
          to: '/charts/albums?type=dcp',
          class: 'second-dcp',
          content: `Don't Click Play`
        }
      ],
      thirdRow: [
        {
          to: '/charts/accounts',
          class: 'third-account',
          content: 'TikTok / Spotify / Instagram'
        },
        {
          to: '/charts/singles',
          class: 'third-singles',
          content: 'Singles / 单曲'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
/* 调整这个变量可以控制整体缩放 */
// 每个格子的单元大小
$unit-size: 9vh;
// gap大小
$gap-size: 2vh;

* {
  font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto,
    Ubuntu;
}

.charts-page {
  // display: flex;
  width: 100%;
  height: calc(100vh - 80px);
  margin-top: 80px;
  // padding-top: 80px;
  background: black;
  overflow: auto;
  position: relative;

  .charts-grid {
    padding: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $gap-size;

    position: absolute;
    top: 90px;
    left: 50%;
    transform: translateX(-50%);

    .charts-grid-row {
      display: grid;
      // 14列 每列宽度为 $unit-size 单元大小
      grid-template-columns: repeat(14, $unit-size);
      // 2行 每行高度为 $unit-size 单元大小
      grid-template-rows: repeat(2, $unit-size);
      gap: $gap-size;
      /* 让容器根据内部格子和 gap 自动撑开 */
      width: max-content;

      .grid-item {
        // 每个格子的高都为2倍 $unit-size 单元大小
        grid-row: span 2;
        width: 100%;
        height: 100%;
        border-radius: 7px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        cursor: pointer;
        text-decoration: none;
        font-size: 25px;
        font-weight: 600;
        transition: all 0.2s ease-in-out;
        &:hover {
          color: #409eff;
          font-weight: 700;
          text-shadow: 0 0 10px rgba(0, 243, 255, 0.3);
        }
      }

      .the-tilte {
        grid-column: span 2;
        font-size: 2rem;
        font-weight: 700;
        letter-spacing: 4px;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: auto;
        &:hover {
          color: white;
          font-weight: 700;
          text-shadow: none;
        }
      }
    }

    /* 各行具体的列跨度设置 */
    .first-row {
      .first-title {
        background: url("../../assets/PhotoGradient/pg3.png") 0% 0% / cover no-repeat;
      }

      .first-block {
        grid-column: span 12;
        background: url("../../assets/PhotoGradient/pg3.png") 0% 0% / cover no-repeat;
        gap: 5%;
        cursor: auto;

        span {
          width: 30%;
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
          line-height: 1.5;
        }
      }
    }

    .second-row {
      .second-title {
        background: url("../../assets/PhotoGradient/pg5.png") 0% 0% / cover no-repeat;
      }

      .second-block {
        grid-column: span 4;
        background: url("../../assets/PhotoGradient/pg5.png") 0% 0% / cover no-repeat;
      }
    }

    .third-row {
      .third-title {
        background: url("../../assets/PhotoGradient/pg4.png") 0% 0% / cover no-repeat;
      }

      .third-block {
        grid-column: span 6;
        background: url("../../assets/PhotoGradient/pg4.png") 0% 0% / cover no-repeat;
      }
    }
  }
}
</style>
