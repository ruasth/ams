<template>
  <div class="sidebar-wrapper" :class="{ show: isShowSideBar ,'w-lyricOpen': isOpenLyric }">
    <div
      class="half-circle-wrapper glassy-background"
      :class="{ 'w-lyricOpen-hc': isOpenLyric }"
    >
      <!-- 侧边栏内容 -->
      <div class="sidebar-content">
        <h3>播放列表</h3>
        <div class="songList-box">
          <div
            v-for="item in songQueue"
            :key="item.QID"
            class="songList"
            :class="item.id === currentSong ? 'is-current' : 'not-current'"
            @dblclick="playSong(item.id)"
            @click="imagePath(item.id)"
          >
            <div class="cover-box">
              <i
                class="icon-play"
                :class="
                  item.id === currentSong && isPlay
                    ? 'el-icon-video-pause'
                    : 'el-icon-video-play'
                "
                @click="handleGlobalPlay(item.id)"
              />
              <img :src="imagePath(item.id)">
            </div>
            {{ item.title }}
          </div>
        </div>
      </div>
    </div>
    <div
      class="closer glassy-background jumpy-transition_wt-bgcl"
      :class="{
        'w-sidebarOpen-closer': isShowSideBar,
        'w-lyricOpen-closer': isOpenLyric,
      }"
      @click="toggleSideBar"
    >
      <svg-icon icon-class="side-bar" class="icon-side-bar" />
    </div>
  </div>
</template>

<script>
import eventBus from '@/utils/bus' // 引入事件总线
import { mapGetters, mapActions } from 'vuex'
import { handleGlobalPlay } from '@/utils/globalPlay.js'
import { getImagesUrl } from '@/utils/getImageUrl'
export default {
  name: 'Sidebar',
  data() {
    return {
      isShowSideBar: false
    }
  },
  computed: {
    ...mapGetters('player', [
      'getSongQueue',
      'getSongList',
      'getCurrentSong',
      'isPlaying'
    ]),
    ...mapGetters('lyric', ['getLyricState']),
    ...mapGetters('releases', ['getReleaseById']),
    songQueue() {
      if (!this.getSongQueue) return []
      return this.getSongQueue.map(item => {
        const releases = this.getReleaseById(item.id) || {}
        return {
          ...item,
          title: releases.title || '未知歌曲',
          cover: releases.cover || ''
        }
      })
    },
    // 判断当前播放歌曲
    currentSong() {
      return this.getCurrentSong?.id || ''
    },
    // 判断当前播放状态
    isPlay() {
      return this.isPlaying
    },
    // 判断歌词页面状态
    isOpenLyric() {
      return this.getLyricState
    }
  },
  created() {
    // console.log(this.currentSong)
    this.emitSideBarState()
  },
  mounted() {
    // 监听侧边栏切换事件
    eventBus.$on('toggle-sidebar', (status) => {
      this.isShowSideBar = status
    })
  },
  beforeDestroy() {
    eventBus.$off('toggle-sidebar')
  },
  methods: {
    // 引入vuex播放歌曲方法
    ...mapActions('player', ['playSong']),
    // 播放控制
    handleGlobalPlay(id) {
      console.log(id)
      handleGlobalPlay({ store: this.$store, message: this.$message }, id)
    },
    // 初始化发射事件存入状态
    emitSideBarState() {
      eventBus.emitState('toggle-sidebar', this.isShowSideBar)
    },
    // 侧边栏打开关闭
    toggleSideBar() {
      this.isShowSideBar = !this.isShowSideBar
      // this.emitSideBarState()
      eventBus.emitState('toggle-sidebar', this.isShowSideBar)
    },
    // 获取封面并拼接
    imagePath(id) {
      const song = this.$store.getters['releases/getReleaseById'](id)
      return getImagesUrl(song.cover)
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebar-wrapper {
  position: fixed;
  top: 50%;
  left: 0;
  width: 250px;
  height: calc(60vh);
  color: #fff;
  // background-color: #409eff;
  z-index: 108;
  transition: all 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
  // transform: translateX(-101%);
  transform: translate(-101%, -50%);

  &.show {
    // transform: translateX(0);
    transform: translate(0, -50%);
  }

  .half-circle-wrapper {
    width: 100%;
    height: 100%;
    border-radius: 0 35px 35px 0;
    transition: all 0.2s ease;

    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    z-index: 108;
  }
  .closer {
    width: 23px;
    height: 8vh;
    color: #fff;
    border-radius: 20px 20px 20px 20px;
    transition: all 0.2s ease;
    text-align: center;
    line-height: 8vh;

    position: absolute;
    left: 104%;
    top: 50%;
    transform: translateY(-50%);
    z-index: 108;

    .icon-side-bar {
      transition: all 0.2s ease;
    }

    &:hover {
      transform: translateY(-50%) scale(1.2);
    }
    &:active {
      transform: translateY(-50%) scale(0.95) !important;
    }
  }

  .sidebar-content {
    padding: 10px;

    h3 {
      margin: 10px 0 10px 10px;
      letter-spacing: 2px;
    }

    .songList-box {
      width: 100%;
      display: flex;
      flex-direction: column;
      overflow: hidden;

      .songList {
        width: 100%;
        height: 60px;
        line-height: 60px;
        font-size: 15px;
        letter-spacing: 1px;
        text-align: left;
        text-shadow: 0 0 5px rgba(0, 0, 0);
        overflow: hidden;
        // border-radius: 14px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.6);
        display: flex;
        align-items: center;
        transition: all 0.1s cubic-bezier(0.18, 0.89, 0.32, 1.28);
        cursor: pointer;
        position: relative;

        &.is-current {
          color: #409eff;
        }
        &.not-current {
          color: #fff;
        }

        &:hover {
          background: rgba(255, 255, 255, 0.2);
        }
        .cover-box {
          width: 40px;
          height: 40px;
          margin: 0 10px 0 10px;
          position: relative;

          .icon-play {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 20px;
            color: #fff;
            opacity: 0;
            transition: all 0.2s ease;
            &:hover {
              opacity: 1;
              color: #409eff;
            }
          }

          img {
            width: 40px;
            height: 40px;
            border-radius: 10%;
          }
        }

        &:hover .icon-play {
          opacity: 1;
        }
      }
    }
  }
}

.w-lyricOpen {
  height: 100vh !important;
}
.w-lyricOpen-hc {
    border-radius: 0 !important;
    // top: 0 !important;
    // transform: translateY(0) !important;
    z-index: 108 !important;
}

.w-sidebarOpen-closer {
  opacity: 0;
  .icon-side-bar {
    transform: rotate(180deg);
  }
  &:hover {
    opacity: 1;
  }
}

.w-lyricOpen-closer {
  display: none;
}
</style>

