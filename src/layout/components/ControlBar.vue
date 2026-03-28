<template>
  <div class="controlbar-container" :class="{ 'is-active': isActive }">
    <div class="control-section play-area glassy-background jumpy-transition_wt-bgcl">
      <div class="content-wrapper">
        <i class="el-icon-caret-left icon-play" @click="changeSong('prev')" />
        <i
          class="icon-play"
          :class="isPlay ? 'el-icon-video-pause' : 'el-icon-video-play'"
          @click="handleGlobalPlay"
        />
        <i class="el-icon-caret-right icon-play" @click="changeSong('prev')" />
      </div>
    </div>

    <div class="control-section functional-area glassy-background jumpy-transition_wt-bgcl">
      <div class="content-wrapper" @click="toggleActive">
        <i
          class="icon-lock"
          :class="isActive ? 'el-icon-lock' : 'el-icon-unlock'"
        />
      </div>
    </div>

    <div class="control-section functional-area glassy-background jumpy-transition_wt-bgcl">
      <div class="content-wrapper" @click="openLyricPage">
        <i class="el-icon-monitor icon-lyric" />
      </div>
    </div>
  </div>
</template>

<script>
// import audio from 'mock/audio'
import { mapGetters, mapActions } from 'vuex'
import { handleGlobalPlay } from '@/utils/globalPlay'
export default {
  data() {
    return {
      isActive: false
      // isPlay: false
    }
  },
  computed: {
    ...mapGetters('player', ['isPlaying']),
    // 跟据getter返回播放状态
    isPlay() {
      return this.isPlaying
    }
  },
  methods: {
    ...mapActions('lyric', ['setLyricState']),
    ...mapActions('player', ['changeSong']),
    // 锁定状态触发
    toggleActive() {
      this.isActive = !this.isActive
    },
    // 播放控制
    handleGlobalPlay() {
      handleGlobalPlay({ store: this.$store, message: this.$message })
    },
    // 下一首
    next() {
      this.$store.dispatch('player/next')
    },
    // 上一首
    prev() {
      this.$store.dispatch('player/prev')
    },
    // 打开歌词页面
    openLyricPage() {
      this.setLyricState(true)
    }
  }
}
</script>

<style lang="scss" scoped>
.controlbar-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: -30px;
  transition: gap 0.5s cubic-bezier(0.34, 1.5, 0.64, 1);
  height: 80px;
  width: fit-content;

  &:hover,
  &.is-active {
    gap: 15px;
  }
}

.control-section {
  position: relative;
  // background: rgba(255, 255, 255, 0.1);
  // backdrop-filter: blur(12px);
  // -webkit-backdrop-filter: blur(12px);
  // border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 40px;
  transition: all 0.5s cubic-bezier(0.34, 1.5, 0.64, 1);
  overflow: hidden;
  cursor: pointer;

  height: 4px;
  width: 60px;
  opacity: 0.6;

  .content-wrapper {
    opacity: 0;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    width: 100%;
    height: 100%;
    transition: opacity 0.3s, transform 0.3s;
    transform: scale(0.8);
    /* 初始内容稍微缩小 */
    color: white;
  }

  /* 展开态 */
  .controlbar-container:hover &,
  .controlbar-container.is-active & {
    /* 这里高度增加时，由于父级 align-items: center，它会向上下同时扩张 */
    height: 54px;
    opacity: 1;
    // background: rgba(10, 10, 10, 0.4);
    // border-color: rgba(255, 255, 255, 0.2);
    // box-shadow: 0 0 10px 3px rgba(64, 158, 255, 0.4);

    .content-wrapper {
      opacity: 1;
      transform: scale(1);
    }
  }
}

.controlbar-container:hover .play-area,
.controlbar-container.is-active .play-area {
  width: 190px;
  transform: scale(1.03); // 手动调低一点 不然点击的时候幅度太大会失灵
}

.controlbar-container:hover .functional-area,
.controlbar-container.is-active .functional-area {
  width: 54px;
}

/* 按钮点击反馈 */
.icon-lock,
.icon-lyric {
    color: #fff;
}
.icon-play {
  font-size: 17px;
  transition: all 0.2s;

  &:hover {
    color: #409eff;
    transform: scale(1.15);
  }
  &:active {
    color: #fff;
    transform: scale(1.15);
  }
}
</style>
