<template>
  <transition name="lyric-trans">
    <div v-if="isLyricing" class="lyric-page" @wheel="handleWheel">
      <div class="bg-layer" :style="{ backgroundImage: `url(${currentCover})` }" />
      <div class="bg-masker">1</div>

      <button class="btn-close normal-btn_foggy" @click="closeLyricPage">
        <i class="_el_icon el-icon-close btn-close-cl" />
      </button>

      <div class="content-layout">
        <!-- 左侧 -->
        <div class="left-content">
          <!-- 封面 -->
          <div class="cover-box">
            <img class="song-cover" :src="currentCover" alt="">
          </div>
          <!-- 标题 -->
          <div class="songinfo-box">
            <h3 class="song-title">{{ currentTitle }}</h3>
            <div class="normal-btn_foggy songList" @click="toggleSideBar">
              <svg-icon icon-class="all" class="icon-list" />
            </div>
          </div>
          <!-- 进度条 -->
          <div class="progress-bar">
            <span class="time">{{ formatCurrentTime }}</span>
            <input
              type="range"
              class="slider"
              :style="{ '--progress': progressPercent + '%' }"
              step="0.1"
              min="0"
              :max="duration"
              :value="displayTime"
              @input="onSliderInput"
              @change="onSliderChange"
            >
            <span class="time">{{ formatDuration }}</span>
          </div>
          <!-- 控制区 -->
          <div class="control-bar">
            <!-- 上下 暂停播放 -->
            <div class="main-control">
              <button class="main-btn -white pnn" @click="changeSong('prev')">
                <i class="el-icon-caret-left" />
              </button>
              <button class="normal-btn_foggy pnp" @click="handleGlobalPlay()">
                <!-- <svg-icon icon-class="all" class="icon-list" /> -->
                <svg-icon :icon-class="isPlaying ? 'pause' : 'play'" class="icon-play" />
              </button>
              <button class="main-btn -white pnn" @click="changeSong('next')">
                <i class="el-icon-caret-right" />
              </button>
            </div>
            <!-- 音量条 -->
            <!-- <div class="vol-control">
              <span class="jumpy-transition">
                <svg-icon
                  :icon-class="
                    isNotifi ? 'notification' : 'notification_forbid'
                  "
                  class="icon-notifi"
                  @click="handleNotifi"
                />
              </span>
              <input type="range" class="slider vol-progress">
              <span class="jumpy-transition">
                <svg-icon icon-class="plus" class="plus" @click="soundPlus" />
              </span>
            </div> -->
          </div>
        </div>

        <!-- 右侧 -->
        <div ref="scrollRef" class="right-content" :class="{ 'is-scrolling': isUserScroll }" @wheel="handleWheel">
          <!-- 上占位符 -->
          <div v-if="finalLines.length > 0" class="lyric-spacer-top" />
          <!-- 无歌词 -->
          <div v-if="finalLines.length === 0" class="no-lyrics">暂无歌词</div>
          <!-- 有歌词 -->
          <div
            v-for="(line, index) in finalLines"
            :key="index"
            class="lyric-line"
            :class="{
              active: index === activeIndex,
              nearby: Math.abs(activeIndex - index) === 1,
            }"
            :style="{
              '--scroll-y': `${containerOffset + manualOffset}px`,
              '--delay': isUserScroll ? '0s' : getDelay(index),
            }"
            @click="onLyricsClick(line)"
          >
            <div v-if="line.isInterlude" class="interlude-dots">
              <span v-for="n in 3" :key="n" :style="getInterludeDotStyle(line, n)" />
            </div>

            <template v-else>
              <div class="lyric-origin">{{ line.text }}</div>

              <div v-if="line.translation" class="lyric-trans">
                {{ line.translation }}
              </div>
            </template>
          </div>
          <!-- 下占位符 -->
          <div v-if="finalLines.length > 0" class="lyric-spacer-bottom" />
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import eventBus from '@/utils/bus'
import { mapGetters, mapActions, mapState } from 'vuex'
import { handleGlobalPlay } from '@/utils/globalPlay'
export default {
  data() {
    return {
      isNotifi: false, // 是否静音
      isUserScroll: false, // 是否手动滚动歌词
      isDragging: false, // 是否拖拽进度条

      scrollTimer: null, // 手动滚动定时器

      activeIndex: 0, // 当前激活歌词索引
      containerOffset: 0, // 歌词容器偏移量
      manualOffset: 0, // 手动偏移量
      dragTime: 0 // 拖拽进度条时间
    }
  },
  computed: {
    ...mapGetters('lyric', ['getLyricState']),
    ...mapGetters('player', ['getCurrentSong', 'getCurrentTime', 'isPlaying']),
    ...mapState('player', ['currentTime', 'totalTime', 'audioInstance']),
    ...mapState('lyric', ['lyricState', 'originalLyric', 'translateLyric']),
    ...mapState('player', ['currentSong']),
    // 获取当前歌曲的完整信息
    currentRelease() {
      if (!this.currentSong) return null
      return this.$store.getters['releases/getReleaseById'](this.currentSong.id)
    },
    // 当前歌曲标题
    currentTitle() {
      return this.currentRelease?.title || '未知歌曲'
    },
    // 当前歌曲封面
    currentCover() {
      return this.currentRelease?.cover
        ? require(`@/assets/${this.currentRelease.cover}`)
        : require(`@/assets/Cover/default.jpg`)
    },
    // 歌词面板是否打开
    isLyricing() {
      return this.getLyricState
    },
    // 获取总时长
    duration() {
      return this.totalTime || 0
    },
    // 格式化当前时间
    formatCurrentTime() {
      return this.formatTime(this.currentTime)
    },
    // 格式化总时长
    formatDuration() {
      return this.formatTime(this.duration)
    },
    // 解析歌词 + 合并翻译 + 间奏标记 + 返回最终歌词
    finalLines() {
      return this.lyricsLines(this.originalLyric, this.translateLyric)
    },
    // 判断进度条状态自动使用当前时间/拖拽时间
    displayTime() {
      return this.isDragging ? this.dragTime : this.currentTime
    },
    // 进度条百分比计算
    progressPercent() {
      if (!this.totalTime || this.totalTime === 0) return 0
      return (this.displayTime / this.totalTime) * 100
    }
  },
  watch: {
    // 监听当前歌曲 变化自动获取歌词
    // getCurrentSong: {
    //   handler(newSong) {
    //     if (newSong && newSong.id) {
    //       this.$store.dispatch('lyric/getLyrics', newSong.id) // 获取歌词
    //     } else {
    //       this.$store.commit('lyric/SET_LYRICS', { OL: '', TL: '' })
    //     }
    //   },
    //   immediate: true // 立即执行一次 确保面板打开时已有歌词
    // },
    // 监听当前播放时间 自动计算返回
    getCurrentTime: {
      handler(newTime) {
        this.updateActiveIndex(newTime)
      }
    },
    // 监听当前激活歌词
    activeIndex() {
      if (this.isUserScroll) return
      this.$nextTick(() => {
        this.calculateScrollPosition()
      })
    },
    // 监听歌曲变化时自动解析当前激活歌词
    finalLines: {
      handler() {
        this.$nextTick(() => {
          this.calculateScrollPosition()
        })
      },
      immediate: true
    },
    // 监听歌词面板状态判断主页滚动条是否禁用
    isLyricing(newVal) {
      this.$store.dispatch('sticky/listeningDisabled', newVal)
    }
  },
  beforeDestroy() {
    if (this.scrollTimer) clearTimeout(this.scrollTimer)
    this.$store.dispatch('sticky/listeningDisabled', false)
  },
  methods: {
    ...mapActions('lyric', ['setLyricState']),
    ...mapActions('player', ['changeSong']),
    // 歌词面板关闭按钮
    closeLyricPage() {
      this.setLyricState(false)
    },
    // 静音
    handleNotifi() {
      this.isNotifi = !this.isNotifi
    },
    // 音量+
    soundPlus() { },
    // 打开/关闭 侧边栏
    toggleSideBar() {
      const currentState = eventBus.getState('toggle-sidebar') || false
      const newState = !currentState
      eventBus.emitState('toggle-sidebar', newState)
      // console.log('最新侧边栏状态：', eventBus.getState('toggle-sidebar'))
    },
    // 解析歌词
    parseLyrics(lrc) {
      const lines = []
      const regex = /\[(\d{2}):(\d{2})(\.\d{2,3})?\]/

      if (!lrc) return lines

      const rawLines = lrc.split('\n')
      for (const rawLine of rawLines) {
        const match = rawLine.match(regex)
        if (match) {
          const min = parseInt(match[1])
          const sec = parseInt(match[2])
          const ms = match[3] ? parseFloat(match[3]) * 1000 : 0
          const time = min * 60 + sec + ms / 1000
          const text = rawLine.replace(regex, '').trim()
          if (text) lines.push({ time, text })
        }
      }
      return lines
    },
    // 合并歌词和翻译
    lyricsLines(OL, TL) {
      const mainLines = this.parseLyrics(OL)
      const transLines = this.parseLyrics(TL)
      const transMap = new Map()
      transLines.forEach((line) =>
        transMap.set(line.time.toFixed(1), line.text)
      )

      const combinedLines = mainLines.map((line) => {
        const key = line.time.toFixed(1)
        return { ...line, translation: transMap.get(key) }
      })

      if (combinedLines.length === 0) return []

      const finalLines = []
      // 1. 处理开头间奏
      // if (combinedLines[0].time > 5) {
      //   finalLines.push({
      //     time: 0,
      //     duration: combinedLines[0].time,
      //     text: '...',
      //     isInterlude: true
      //   })
      // }

      // 2. 遍历并计算行间距
      for (let i = 0; i < combinedLines.length; i++) {
        const current = combinedLines[i]
        const next = combinedLines[i + 1]
        current.duration = next ? next.time - current.time : 5

        if (current.text === '...') {
          // 标记为间奏行
          finalLines.push({
            ...current,
            isInterlude: true,
            translation: undefined // 间奏行不需要翻译
          })
        } else {
          finalLines.push(current)
        }
      }
      return finalLines
    },
    // 监听当前时间变化 更新激活的歌词行
    updateActiveIndex(currentTime) {
      const lyricsList = this.finalLines
      if (lyricsList.length === 0) return

      let left = 0
      let right = lyricsList.length - 1
      let targetIndex = 0

      while (left <= right) {
        const mid = Math.floor((left + right) / 2)
        const line = lyricsList[mid]
        const nextLine = lyricsList[mid + 1]
        // console.log('line', line)

        // 当前时间位于本行区间内
        if (
          currentTime >= line.time &&
          (!nextLine || currentTime < nextLine.time)
        ) {
          targetIndex = mid
          break
        } else if (currentTime < line.time) {
          right = mid - 1
        } else {
          left = mid + 1
        }
      }

      if (this.activeIndex !== targetIndex) {
        this.activeIndex = targetIndex
        // console.log('activeIndex', this.activeIndex)
      }
    },
    // 计算间奏时长返回样式
    getInterludeDotStyle(line, dotIndex) {
      const now = this.currentTime // 当前播放时间
      const start = line.time // 当前行开始时间

      const duration = line.duration || 1 // 当前行时长
      const progress = Math.max(0, Math.min(1, (now - start) / duration)) // 当前进度

      const segment = 1 / 3 // 每段时长
      const startThreshold = (dotIndex - 1) * segment // 当前段开始阈值

      let dotOpacity = 0.2

      if (progress > startThreshold) {
        // 计算当前段进度
        const localProgress = (progress - startThreshold) / segment
        // 根据进度计算不透明度
        const clampedProgress = Math.min(1, localProgress)
        // 根据进度计算缩放比例
        dotOpacity = 0.2 + 0.8 * clampedProgress
      }

      return {
        opacity: dotOpacity,
        transform: `scale(${0.8 + (0.4 * (dotOpacity - 0.2)) / 0.8})`
      }
    },
    // 时间格式化
    formatTime(seconds) {
      if (!seconds) return '00 : 00'
      const min = Math.floor(seconds / 60)
      const sec = Math.floor(seconds % 60)
      return `${min.toString().padStart(2, '0')} : ${sec
        .toString()
        .padStart(2, '0')}`
    },
    // 歌词自动定位滚动
    calculateScrollPosition() {
      const container = this.$refs.scrollRef
      if (!container) return

      const children = container.querySelectorAll('.lyric-line')
      if (!children || children.length === 0) return

      const activeLine = children[this.activeIndex]
      if (activeLine) {
        const containerHeight = container.clientHeight
        const activeTop = activeLine.offsetTop
        this.containerOffset = -(activeTop - containerHeight * 0.38)
      }
    },
    // 计算歌词延时滚动时长
    getDelay(index) {
      if (this.isUserScroll) return '0s'
      // const diff = Math.abs(index - this.activeIndex)
      const diff = index - this.activeIndex
      if (diff < 0) return '0s' // 已播放过的行立即过渡
      if (diff === 0) return '0.05s' // 当前行稍慢
      const delay = 0.1 + diff * 0.08
      // return `${0.2 + diff * 0.05}s`
      return `${Math.min(delay, 0.6)}s` // 最大0.6秒
    },
    // 计算手动滚动
    handleWheel(e) {
      // console.log('鼠标滚动中')
      e.preventDefault()
      e.stopPropagation()
      this.isUserScroll = true
      // this.activateManualScroll()
      this.manualOffset += e.deltaY
      if (this.scrollTimer) clearTimeout(this.scrollTimer)
      this.scrollTimer = setTimeout(() => {
        this.isUserScroll = false
        this.manualOffset = 0
        this.$nextTick(() => {
          this.calculateScrollPosition()
        })
      }, 2500)
    },
    // 手动拖拽时锁定进度条时间
    onSliderInput(e) {
      this.isDragging = true // 标记当前进度条为拖拽状态
      this.dragTime = parseFloat(e.target.value) // 更新拖拽时临时时间
    },
    // 进度条跳转拖拽时间
    onSliderChange(e) {
      const targetTime = parseFloat(e.target.value)
      this.dragTime = targetTime

      if (this.audioInstance) {
        // 监听一次性事件：跳转完成
        const onSeeked = () => {
          this.isDragging = false
          // this.$nextTick(() => {
          //   this.calculateScrollPosition()
          // })
          this.audioInstance.removeEventListener('seeked', onSeeked)
        }
        this.audioInstance.addEventListener('seeked', onSeeked)

        // 执行跳转
        this.audioInstance.currentTime = targetTime
      }
    },
    // 点击歌词跳转
    onLyricsClick(line) {
      this.isUserScroll = false
      this.manualOffset = 0

      this.$store.dispatch('player/seekToTime', line.time)

      this.$nextTick(() => {
        this.calculateScrollPosition()
      })
    },
    // 播放控制
    handleGlobalPlay() {
      handleGlobalPlay({ store: this.$store, message: this.$message })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/el-icon.scss";
@import "@/styles/main-button.scss";

* {
  font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto,
    Ubuntu;
}

.lyric-trans-enter {
  opacity: 0;
  transform: scale(0);
}

.lyric-trans-enter-active {
  transition: all 0.5s cubic-bezier(0.18, 0.89, 0.32, 1);
}

.lyric-trans-leave {
  opacity: 1;
  transform: scale(1);
}

.lyric-trans-leave-active {
  transition: all 0.5s cubic-bezier(0.18, 0.89, 0.32, 1);
  opacity: 0;
  transform: scale(0);
}

.lyric-page {
  width: 100vw;
  height: 100vh;
  background-color: #000;
  position: relative;
  // &::before {
  //   content: "";
  //   display: block;
  //   background-color: #000;
  //   width: 100%;
  //   height: 100%;
  // }
}

.bg-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  // background-color: rgba(0, 0, 0, 0.5);
  // backdrop-filter: blur(10px);
  z-index: 101;

  // position: absolute;
  inset: -80px;
  background-size: cover;
  background-position: center;
  filter: blur(100px) saturate(220%) brightness(0.4);
  z-index: 1;
  opacity: 1;
  transform: scale(1.1);
  transition: background-image 0.8s ease;
}

.bg-masker {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  // background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  z-index: 102;

  inset: 0;
  background: linear-gradient(to bottom,
      rgba(0, 0, 0, 0.1),
      rgba(0, 0, 0, 0.5));
}

.btn-close {
  position: absolute;
  top: 30px;
  right: 30px;
  z-index: 105;
  // background: rgba(255, 255, 255, 0.08);
  // border: none;
  border-radius: 12px;
  width: 44px;
  height: 44px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  cursor: pointer;
  transition: all 0.3s;

  .btn-close-cl {
    color: #fff !important;
  }
}

.content-layout {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 46% 54%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 104;
}

.left-content {
  max-width: 500px;
  width: 100%;
  height: 100vh;
  padding-right: 50px;
  // background-color: rgba(255, 255, 0, 0.4);
  display: flex;
  // gap: 40px;
  flex-direction: column;
  justify-content: center;
  justify-self: end;

  .cover-box {
    width: 100%;
    aspect-ratio: 1/1; // 比例
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5);
    margin-bottom: 40px;
    background: #222;
    position: relative;
    cursor: none;

    .song-cover {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .songinfo-box {
    color: #fff;
    font-size: 24px;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .songList {
      padding: 0;
      width: 36px;
      height: 36px;
      color: #fff;
      font-size: 20px;
      line-height: 32px;
      border-radius: 10px;
      display: flex;
      justify-content: center;
      align-items: center;

      .icon-list {
        transform: rotate(90deg);
      }
    }
  }

  .progress-bar {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 30px;

    .time {
      font-size: 12px;
      width: 40px;
      font-variant-numeric: tabular-nums;
      // font-family: 'Monaco', monospace;
      color: rgba(255, 255, 255, 0.6);
    }

    .slider {
      -webkit-appearance: none;
      height: 4px;
      border-radius: 2px;
      flex: 1;
      position: relative;
      cursor: pointer;

      background: linear-gradient(to right,
          #ffffff 0%,
          #ffffff var(--progress),
          rgba(255, 255, 255, 0.2) var(--progress),
          rgba(255, 255, 255, 0.2) 100%);

      &::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: #fff;
        transition: all 0.2s;
      }

      &:hover::-webkit-slider-thumb {
        width: 12px;
        height: 12px;
        opacity: 1;
        transform: scale(1);
      }

      &:active::-webkit-slider-thumb {
        width: 12px;
        height: 12px;
        opacity: 1;
        transform: scale(1.3);
      }
    }
  }

  .control-bar {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    .main-control {
      display: flex;
      align-items: center;
      gap: 48px;
      padding: 20px 0;

      .main-btn {
        padding: 0;
      }

      .pnn {
        width: 38px;
        height: 38px;
        border-radius: 50%;
        background-color: #ffffff00;
        color: #fff;

        &:hover {
          background-color: #ffffff;
          color: #409eff;
        }
      }

      .pnp {
        width: 68px;
        height: 68px;
        padding: 0;
        border-radius: 50%;
        color: #fff !important;

        // transition: none !important;
        .icon-play {
          font-size: 30px;
        }
      }
    }

    // .vol-control {
    //   width: 100%;
    //   display: flex;
    //   align-items: center;
    //   gap: 12px;
    //   margin-bottom: 30px;

    //   span {
    //     color: #fff;
    //     width: 40px;
    //     font-variant-numeric: tabular-nums;
    //     text-align: center;
    //   }

    //   .icon-notifi,
    //   .plus {
    //     width: 22px;
    //     height: 22px;
    //     color: #fff;

    //     &.plus {
    //       width: 20px;
    //       height: 20px;
    //     }
    //   }
    // }
  }
}

.right-content {
  height: 100vh;
  overflow: hidden;
  position: relative;
  align-items: flex-start;
  mask-image: linear-gradient(to bottom,
      transparent 0%,
      black 15%,
      black 85%,
      transparent 100%);
  -webkit-mask-image: linear-gradient(to bottom,
      transparent 0%,
      black 15%,
      black 85%,
      transparent 100%);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-left: 50px;
  padding-right: 60px;
  box-sizing: border-box;
  touch-action: none;

  // 上下占位符
  .lyric-spacer-top {
    height: 45vh;
    flex-shrink: 0;
  }

  .lyric-spacer-bottom {
    height: 55vh;
    flex-shrink: 0;
  }

  /* 暂无歌词 */
  .no-lyrics {
    width: 100%;
    height: 100%;
    padding: 30%;
    display: flex;
    align-items: center;
    font-size: 42px;
    color: rgba(255, 255, 255, 0.4);
  }

  // 歌词行
  .lyric-line {
    margin-bottom: 26px;
    cursor: pointer;
    will-change: transform, opacity, filter;
    transform: translateY(var(--scroll-y)) scale(1) translate3d(0, 0, 0);
    transition: transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1),
      filter 0.7s ease, opacity 0.7s ease, color 0.7s ease;
    transition-delay: var(--delay), 0s, 0s, 0s;
    display: flex;
    flex-direction: column;
    gap: 4px;
    color: rgba(255, 255, 255, 0.45);
    filter: blur(2px);
    opacity: 0.5;

    &:hover {
      filter: blur(0px) !important;
      opacity: 1 !important;
      color: rgba(255, 255, 255, 0.8);
    }

    &.active {
      filter: blur(0);
      opacity: 1;
      color: #fff;
      text-shadow: 0 0 30px rgba(255, 255, 255, 0.3);
      margin-bottom: 34px;

      .lyric-origin {
        font-size: 45px;
      }

      .lyric-trans {
        font-size: 30px;
      }
    }

    &.nearby {
      filter: blur(2px);
      opacity: 0.8;
      transform: translateY(var(--scroll-y)) scale(1) translate3d(0, 0, 0);
    }

    .lyric-origin {
      font-size: 40px;
      font-weight: 1000;
      line-height: 1.25;
      letter-spacing: -0.5px;
      margin-bottom: 4px;
    }

    .lyric-trans {
      font-size: 30px;
      font-weight: 800;
      opacity: 0.7;
      line-height: 1.4;
      margin-top: 4px;
    }

    /* 间奏圆点行 */
    .interlude-dots {
      display: flex;
      gap: 12px;
      height: 60px;
      align-items: center;
      justify-content: flex-start;
      padding-left: 10px;

      span {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: #fff;
        transition: all 0.3s ease;
      }
    }
  }
}
</style>
