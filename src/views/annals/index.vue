<template>
  <div class="annals-page">
    <bgBox />
    <!-- <div class="dynamic-bg">
      <transition name="fade-bg">
        <img :key="activeIndex" :src="currentData.bgUrl" class="bg-image">
      </transition>
      <div class="bg-overlay" />
    </div> -->

    <div class="annals-content-wrapper">
      <main class="gallery-wrapper">
        <!-- 按钮 -->
        <button
          class="nav-btn prev"
          :disabled="activeIndex === 0"
          @click="prev"
        >
          <i class="el-icon-arrow-left" />
        </button>

        <!-- 内容区域 -->
        <div class="content-viewport">
          <transition :name="slideDirection" mode="out-in">
            <div :key="activeIndex" class="event-card">
              <div class="year-label">{{ currentData.year }}</div>
              <div class="event-body">
                <div class="image-box">
                  <img :src="currentData.cover" alt="event">
                </div>
                <div class="info-box">
                  <h2 class="title">{{ currentData.title }}</h2>
                  <p class="desc">{{ currentData.description }}</p>
                  <!-- <el-button
                    class="main-btn -white link-btn"
                    round
                    @click="$router.push('/annals')"
                  >歌曲主页</el-button> -->
                </div>
              </div>
            </div>
          </transition>
        </div>

        <!-- 按钮 -->
        <button
          class="nav-btn next"
          :disabled="activeIndex === flatTimeline.length - 1"
          @click="next"
        >
          <i class="el-icon-arrow-right" />
        </button>
      </main>

      <!-- 底部列表小球 -->
      <footer class="timeline-footer">
        <div class="timeline-track">
          <div
            v-for="(group, GIndex) in timeLineMap"
            :key="GIndex"
            class="year-group"
            :class="{ 'is-expanded': group.year === currentData.year }"
          >
            <div
              v-for="(event, EIndex) in group.events"
              :key="event.id"
              class="timeline-dot"
              :class="{
                active : event.flatIndex === activeIndex,
                'is-sub' : EIndex > 0
              }"
              @click="setActive(event.flatIndex)"
            >
              <span
                v-if="EIndex === 0"
                class="dot-year"
              >{{ group.year }}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
import bgBox from '@/components/bg-box.vue'
export default {
  name: 'AnnalsView',
  components: {
    bgBox
  },
  data() {
    return {
      activeIndex: 0,
      slideDirection: 'slide-left',
      rawTimeLine: [
        {
          year: '2018',
          events: [
            {
              id: 1,
              title: 'Sweet but Psycho',
              description: '一举成名之作...',
              cover: require('@/assets/Cover/sweetbutpsycho.jpg'),
              bgUrl: require('@/assets/Cover/sweetbutpsycho.jpg')
            },
            {
              id: 2,
              title: 'Event 2',
              description: '同年的第二个里程碑...',
              cover: require('@/assets/Cover/sweetbutpsycho.jpg'),
              bgUrl: require('@/assets/Cover/sweetbutpsycho.jpg')
            },
            {
              id: 3,
              title: 'Event 3',
              description: '同年的第三个里程碑...',
              cover: require('@/assets/Cover/sweetbutpsycho.jpg'),
              bgUrl: require('@/assets/Cover/sweetbutpsycho.jpg')
            }
          ]
        },
        {
          year: '2019',
          events: [
            {
              id: 4,
              title: 'Torn',
              description: '视觉系单曲...',
              cover: require('@/assets/Cover/sweetbutpsycho.jpg'),
              bgUrl: require('@/assets/Cover/sweetbutpsycho.jpg')
            }
          ]
        },
        {
          year: '2020',
          events: [
            {
              id: 5,
              title: 'Heaven & Hell',
              description: '首张个人专辑...',
              cover: require('@/assets/Cover/sweetbutpsycho.jpg'),
              bgUrl: require('@/assets/Cover/sweetbutpsycho.jpg')
            },
            {
              id: 6,
              title: 'Kings & Queens',
              description: '女性力量单曲...',
              cover: require('@/assets/Cover/sweetbutpsycho.jpg'),
              bgUrl: require('@/assets/Cover/sweetbutpsycho.jpg')
            }
          ]
        }
      ]
    }
  },
  computed: {
    // 将原数据结构转换为一份扁平化 和一份有标志的
    // flatTimeline 扁平数组
    flatTimeline() {
      const list = []
      // 原数组结构: group -> year / events -> event
      this.rawTimeLine.forEach((group) => {
        group.events.forEach((event) => {
          list.push({ ...event, year: group.year, flatIndex: list.length })
        })
      })
      return list
    },
    // 为原数组映射一份带有标识的
    timeLineMap() {
      let count = 0
      return this.rawTimeLine.map((group) => ({
        // gorup -> year / events -> event
        ...group,
        events: group.events.map((event) => ({
          ...event,
          flatIndex: count++
        }))
      }))
    },
    currentData() {
      // 在原数组里跟据激活标志返回当前展示的数据
      return this.flatTimeline[this.activeIndex]
    }
  },
  methods: {
    setActive(index) {
      // 点击事件时触发，跟据传入的当前事件标志，设置左右进场动画和激活标志
      if (index > this.activeIndex) {
        this.slideDirection = 'slide-left'
      } else {
        this.slideDirection = 'slide-right'
      }
      this.activeIndex = index
    },
    next() {
      if (this.activeIndex < this.flatTimeline.length - 1) {
        this.slideDirection = 'slide-left'
        this.activeIndex++
      }
    },
    prev() {
      if (this.activeIndex > 0) {
        this.slideDirection = 'slide-right'
        this.activeIndex--
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.annals-page {
  width: 100%;
  height: 100vh;
  position: relative;
  background: #000;
  overflow: hidden;
}

.annals-content-wrapper {
  position: relative;
  width: 100%;
  height: calc(100vh - 80px);
  margin-top: 80px;
  z-index: 2;
  display: flex;
  flex-direction: column;
}

.dynamic-bg {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;

  .bg-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: blur(40px) brightness(0.3);
    transform: scale(1.05);
  }

  .bg-overlay {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at center, transparent, #000 90%);
  }
}

.gallery-wrapper {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  // justify-content: space-between;
  padding: 0 5%;

  .nav-btn {
    z-index: 2;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #fff;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    cursor: pointer;
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
    position: fixed;
    top: 50%;
    transform: translateY(-50%);

    &:hover:not(:disabled) {
      background: rgba(64, 158, 255, 0.2);
      border-color: #409eff;
      box-shadow: 0 0 20px rgba(64, 158, 255, 0.4);
    }

    &:disabled {
      opacity: 0.1;
      cursor: not-allowed;
    }
  }
  .prev {
    left: 10%
  }
  .next {
    right: 10%
  }
}

.event-card {
  text-align: center;

  .year-label {
    font-size: 100px;
    font-weight: 900;
    background: linear-gradient(to bottom, #fff, transparent);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    opacity: 0.8;
    margin-bottom: -40px;
  }

  .event-body {
    display: flex;
    align-items: center;
    gap: 60px;

    .image-box img {
      width: 380px;
      height: 380px;
      border-radius: 20px;
      box-shadow: 0 30px 60px rgba(0, 0, 0, 0.8);
    }

    .info-box {
      text-align: left;
      max-width: 450px;

      .title {
        font-size: 48px;
        color: #fff;
        margin-bottom: 20px;
      }

      .desc {
        color: rgba(255, 255, 255, 0.7);
        line-height: 1.8;
      }

      .link-btn {
        margin-top: 30px;
      }
    }
  }
}

/* 时间轴 */
.timeline-footer {
  height: 140px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  .timeline-track {
    display: flex;
    gap: 30px;
    align-items: center;
    transition: all 0.5s ease;
  }

  .year-group {
    display: flex;
    align-items: center;
    gap: 10px;
    transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);

    &.is-expanded {
      gap: 20px;
      margin: 0 15px;

      .is-sub {
        width: 12px;
        opacity: 0.5;
        transform: scale(1);
      }
    }
  }

  .timeline-dot {
    cursor: pointer;
    position: relative;
    transition: 0.4s;
    display: flex;
    flex-direction: column;
    align-items: center;

    &::before {
      content: "";
      width: 8px;
      height: 8px;
      background: #fff;
      border-radius: 50%;
      transition: 0.4s;
    }

    &.is-sub {
      width: 0;
      opacity: 0;
      transform: scale(0);
      overflow: hidden;

      &::before {
        width: 6px;
        height: 6px;
      }
    }

    &.active {
      opacity: 1 !important;
      transform: scale(1.3) !important;

      &::before {
        background: #409eff;
        box-shadow: 0 0 15px #409eff;
      }

      .dot-year {
        color: #fff;
        opacity: 1;
      }
    }

    .dot-year {
      position: absolute;
      top: 20px;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.5);
      transition: 0.4s;
      white-space: nowrap;
    }
  }
}

/* 切换动画 */
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.5s ease;
}

.slide-left-enter {
  transform: translateX(30px);
  opacity: 0;
}

.slide-left-leave-to {
  transform: translateX(-30px);
  opacity: 0;
}

.slide-right-enter {
  transform: translateX(-30px);
  opacity: 0;
}

.slide-right-leave-to {
  transform: translateX(30px);
  opacity: 0;
}
</style>
