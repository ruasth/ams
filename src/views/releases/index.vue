<template>
  <div class="releases-page">
    <!-- 背景 -->
    <bgBox />
    <!-- <div class="bg-box">
      <div class="bg-animation" />
    </div> -->

    <!-- 控制栏 -->
    <div class="control-panel">
      <div class="title-box">
        <h1>RELEASES<span> // TO.2026 </span></h1>
      </div>
      <div class="search-box">
        <input
          id="searchInput"
          v-model="searchKeyword"
          type="text"
          placeholder="搜索关键字 (曲名, 专辑名)..."
        >
      </div>
    </div>

    <!-- 图例 -->
    <div id="legend" class="legend">
      <div
        v-for="item in legendList"
        :key="item.id"
        class="legend-item"
        :class="{ 'is-active': legendState === item.id }"
        @click="toggleLegend(item.id)"
      >
        <div class="legend-color" :style="{ backgroundColor: item.color }" />
        {{ item.title }}
      </div>
    </div>

    <!-- 歌曲表格 -->
    <div id="song-box" class="songs-box">
      <div
        v-for="item in songsList"
        :key="item.id"
        class="songs-element"
        :class="{ dimmed: isDimmed(item) }"
        @click="showDialog(item)"
      >
        <img
          class="element-cover"
          :src="imagePath(item.cover)"
          :style="`border-color: var(--border-${item.type})`"
        >
        <span
          class="element-title symbol"
          :style="`color: var(--border-${item.type})`"
        >
          <div class="title-inner">{{ item.title }}</div>
        </span>
      </div>
    </div>

    <!-- 弹窗 -->
    <el-dialog
      :visible.sync="dialogVisible"
      width="30%"
      class="releases-dialog"
    >
      <div class="hologram-content">
        <div
          class="songs-visualizer"
          :style="{
            backgroundImage: `url(${imagePath(dialogItem.cover)})`
          }"
        >
          <div class="songpage-button-box">
            <!-- <button class="songpage-button link">歌曲主页</button> -->
            <button class="songpage-button play" @click="playSong(songsInfo.id)">
              <svg-icon icon-class="play" class="icon-play" />
            </button>
          </div>
        </div>
        <div class="songs-info">
          <div class="info-header">
            <div class="song-name">{{ songsInfo.title }}</div>
            <div class="song-artists">{{ songsInfo.artists }}</div>
            <div class="song-style">{{ songsInfo.style }}</div>
          </div>
          <div class="data-grid">
            <div class="data-item">
              <label>发行年份</label><span id="m-num">{{ songsInfo.year }}</span>
            </div>
            <div class="data-item">
              <label>发行日期</label><span id="m-mass">{{ songsInfo.date }}</span>
            </div>
            <div class="data-item">
              <label>流媒总量</label><span id="m-melt">{{ songsInfo.streams }}</span>
            </div>
            <div class="data-item">
              <label>收录/类型</label><span id="m-boil">{{ songsInfo.type }}</span>
            </div>
          </div>
          <div id="m-desc" class="song-desc">
            {{ songsInfo.describe }}
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import bgBox from '@/components/bg-box.vue'
import { mapActions, mapGetters } from 'vuex'
import { getImagesUrl } from '@/utils/getImageUrl'
export default {
  name: 'ReleasesPage',
  components: {
    bgBox
  },
  data() {
    return {
      // 图例配置
      legendList: [
        { id: 1, title: 'Solo', color: '#33d9b2' },
        { id: 2, title: 'Collab', color: '#706fd3' },
        { id: 3, title: 'HNH', color: '#ff5252' },
        { id: 4, title: 'DND', color: '#34ace0' },
        { id: 5, title: 'DCP', color: '#ffb142' }
      ],
      // 数据存储
      songsList: [],
      legendState: null, // 当前选中的图例ID
      searchKeyword: '', // 搜索关键字状态
      dialogVisible: false, // 歌曲弹窗状态
      dialogItem: {} // 弹窗id
    }
  },
  computed: {
    ...mapGetters('releases', ['getReleasesList', 'getSongInfo']),
    songsInfo() {
      return this.getSongInfo || {}
    }
  },
  watch: {
    currentSongId(newId) {
      if (newId) {
        this.dialogVisible = true
        this.getSongInfo(newId)
      }
    }
  },
  created() {
    this.songsList = this.getReleasesList
  },
  methods: {
    // 开启弹窗
    async showDialog(item) {
      this.dialogVisible = true
      this.dialogItem = item
      await this.$store.dispatch('releases/fetchSongInfo', item.id)
    },
    // 关闭弹窗
    handleClose() {
      this.dialogVisible = false
      this.$store.commit('releases/SET_SONGINFO', {})
    },
    // 切换图例激活状态
    toggleLegend(id) {
      this.legendState = this.legendState === id ? null : id
    },
    // 逻辑判断是否暗淡
    isDimmed(item) {
      // type类型 title歌名
      const { type, title, album } = item

      // 逻辑 A: 搜索过滤判断 (不匹配搜索词则暗淡)
      // 如果有搜索词，且 [歌名] 和 [专辑名] 都不包含关键词，则属于被过滤掉的
      let isSearchMatch = true
      if (this.searchKeyword.trim() !== '') {
        const keyword = this.searchKeyword.toLowerCase()
        const matchTitle = title
          ? title.toLowerCase().includes(keyword)
          : false
        const matchAlbum = album
          ? album.toLowerCase().includes(keyword)
          : false
        isSearchMatch = matchTitle || matchAlbum
      }

      // 逻辑 B: 图例过滤判断 (不符合选中类型则暗淡)
      let isTypeMatch = true
      if (this.legendState) {
        const activeItem = this.legendList.find(
          (l) => l.id === this.legendState
        )
        isTypeMatch = activeItem && type === activeItem.title
      }

      return !isSearchMatch || !isTypeMatch
    },
    // 拼接图片路径
    imagePath(imgPath) {
      return getImagesUrl(imgPath)
    },
    // 引入vuex播放歌曲方法
    ...mapActions('player', ['playSong'])
  }
}
</script>

<style lang="scss">
:root {
  --bg-dark: #050505;
  --card-bg: rgba(255, 255, 255, 0.03);
  --card-border: rgba(255, 255, 255, 0.1);
  --text-main: #e0e0e0;
  --accent-cyan: #409eff;

  --shadow-blue: 0 0 10px rgba(0, 243, 255, 0.3);

  --border-Solo: #33d9b2;
  --border-Collab: #706fd3;
  --border-HNH: #ff5252;
  --border-DND: #34ace0;
  --border-DCP: #ffb142;
}
</style>

<style lang="scss" scoped>
.releases-page {
  width: 100%;
  height: 100vh;
  position: relative;
  background: black;
  overflow: hidden;
  color: var(--text-main);
}

// 背景
.bg-animation {
  position: fixed;
  inset: 0;
  z-index: 0;
  background: radial-gradient(
      circle at 50% 50%,
      rgba(20, 30, 50, 0.5) 0%,
      transparent 50%
    ),
    linear-gradient(0deg, rgba(0, 243, 255, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 243, 255, 0.05) 1px, transparent 1px);
  background-size: 100% 100%, 40px 40px, 40px 40px;
  animation: moveGrid 20s linear infinite;
}

@keyframes moveGrid {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(40px);
  }
}

// 控制栏
.control-panel {
  position: fixed;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  width: 85%;
  max-width: 850px;
  z-index: 3;
  background: rgba(20, 20, 25, 0.8);
  backdrop-filter: blur(10px);
  padding: 23px 30px;
  border-radius: 0 0 20px 20px;
  border: 1px solid var(--card-border);
  display: flex;
  justify-content: space-between;
  align-items: center;

  .title-box h1 {
    font-size: 20px;
    letter-spacing: 3px;
    span {
      font-size: 11px;
      color: #00f3ff;
    }
  }

  .search-box input {
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid #a4a4a4;
    color: #fff;
    padding: 8px 15px;
    border-radius: 5px;
    outline: none;
    transition: 0.3s;
    &:focus {
      border-color: var(--accent-cyan);
      box-shadow: var(--shadow-blue);
    }
  }
}

// 图例
.legend {
  position: absolute;
  top: 185px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 15px;
  width: 900px;

  &-item {
    font-size: 12px;
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 5px 12px;
    border-radius: 15px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid transparent;
    transition: 0.3s;

    &:hover,
    &.is-active {
      background: rgba(255, 255, 255, 0.15);
      border-color: #fff;
      box-shadow: 0 0 10px currentColor;
    }
  }

  &-color {
    width: 10px;
    height: 10px;
    border-radius: 2px;
    margin-right: 8px;
  }
}

// 歌曲表格
.songs-box {
  position: fixed;
  top: 240px;
  left: 50%;
  transform: translateX(-50%);
  width: 78vw;
  height: 68vh;
  z-index: 1;
  background: rgba(20, 20, 25, 0.2);
  backdrop-filter: blur(4px);
  border-radius: 20px;
  border: 1px solid var(--card-border);
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(144px, 1fr));
  gap: 40px 20px;
  overflow-y: auto;
  justify-content: center;
}

// 歌曲格子
.songs-element {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  transition: all 0.4s ease;
  will-change: opacity, filter, transform;

  .element-cover {
    width: 72px;
    height: 72px;
    background: var(--card-bg);
    background-size: cover;
    border: 1px solid var(--card-border);
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);

    &:hover {
      transform: scale(1.2) translateZ(20px);
      box-shadow: var(--shadow-blue);
    }
  }

  .element-title {
    width: 130px;
    overflow: hidden;
    white-space: nowrap;
    text-align: center;
    font-size: 15px;
    font-weight: 700;
    mask-image: linear-gradient(
      to right,
      transparent,
      black 15%,
      black 85%,
      transparent 100%
    );

    .title-inner {
      display: inline-block;
      min-width: 100%;
    }
  }

  &.dimmed {
    opacity: 0.15;
    filter: grayscale(1) blur(2px);
    transform: scale(0.95);
    pointer-events: none;
  }
}

// 内容布局容器
.hologram-content {
  display: flex;
  width: 100%;
  min-height: 400px;
  overflow: hidden;
  border-radius: 12px;
}

// visualizer 区域
.songs-visualizer {
  width: 40%;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;

  .songpage-button-box {
    width: 100%;
    height: 40px;
    display: flex;
    justify-content: center;
    gap: 10px;

    position: absolute;
    left: 50%;
    bottom: 20px;
    transform: translateX(-50%);

    .songpage-button {
      text-align: center;
      line-height: 40px;
      color: #888;
      background: rgba(20, 20, 25, 0.8);
      backdrop-filter: blur(10px);
      // 边框发光效果
      border: 1px solid rgba(0, 243, 255, 0.25);
      box-shadow: 0 0 5px rgba(0, 243, 255, 0.15),
        inset 0 0 20px rgba(0, 243, 255, 0.05);
      cursor: pointer;
      transition: all ease-in-out 0.1s;
      display: flex;
      justify-content: center;
      align-items: center;

      .icon-play {
        font-size: 24px;
      }

      &:hover {
        box-shadow: 0 0 40px rgba(0, 243, 255, 0.15),
          inset 0 0 20px rgba(0, 243, 255, 0.05);
        border: 1px solid rgba(0, 243, 255, 0.4);
        color: var(--text-main);
        transition: all ease-in-out 0.1s;
      }
    }
    .link {
      width: 40%;
      height: 40px;
      border-radius: 19px;
    }
    .play {
      width: 40px;
      height: 40px;
      border-radius: 20px;
    }
  }
}

// info 区域
.songs-info {
  width: 60%;
  padding: 30px;

  .info-header {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding-bottom: 15px;
    margin-bottom: 20px;
  }

  .song-name {
    font-size: 35px;
    font-weight: 700;
    color: var(--accent-cyan);
    text-shadow: var(--shadow-blue);

    // 按词换行
    word-wrap: break-word;
    overflow-wrap: break-word;
    word-break: normal;
  }

  .song-artists {
    font-size: 24px;
    color: var(--text-main);
    margin-bottom: 6px;
    // 按词换行
    word-wrap: break-word;
    overflow-wrap: break-word;
    word-break: normal;
  }
  .song-style {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: #888;
  }

  .data-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    margin-bottom: 20px;
  }
  .data-item label {
    font-size: 10px;
    color: #666;
    display: block;
    font-size: 15px;
  }
  .data-item span {
    font-size: 17px;
    color: #eee;
    font-family: monospace;
  }

  .song-desc {
    font-size: 13px;
    line-height: 1.6;
    color: #aaa;
    max-height: 100px;
    overflow-y: auto;
  }
}

@media (max-width: 768px) {
  .songs-box {
    top: 200px;
    max-height: 500px;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
}
</style>
<!-- dialog -->
<style lang="scss" scoped>
::v-deep .releases-dialog.el-dialog__wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 1200px;
  overflow: hidden;

  .el-dialog {
    width: 700px !important;
    max-width: 95% !important;
    margin: 0 !important;
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;

    transition: transform 0.5s cubic-bezier(0.18, 0.89, 0.32, 1.28);
    transform-style: preserve-3d;

    .el-dialog__body {
      padding: 0 !important;
      position: relative;
      z-index: 2;
    }

    &::before {
      content: "";
      position: absolute;
      inset: 0;
      z-index: 1;

      // 全息背景
      background: linear-gradient(
        135deg,
        rgba(30, 30, 35, 0.9) 0%,
        rgba(10, 10, 15, 0.95) 100%
      );
    }

    &::after {
      content: "";
      position: absolute;
      inset: 0;
      z-index: 2;
      pointer-events: none;

      border: 1px solid rgba(0, 243, 255, 0.4);
      box-shadow: 0 0 40px rgba(0, 243, 255, 0.15),
        inset 0 0 20px rgba(0, 243, 255, 0.05);
      border-radius: 12px;
    }
  }

  &.dialog-fade-enter-active {
    .el-dialog {
      animation: hologramIn 0.5s ease-out;
    }
  }
}

@keyframes hologramIn {
  from {
    opacity: 0;
    transform: translateZ(-200px) rotateX(15deg) scale(0.8);
    filter: brightness(2) blur(10px);
  }
  to {
    opacity: 1;
    transform: translateZ(0) rotateX(0) scale(1);
    filter: brightness(1) blur(0);
  }
}

::v-deep .v-modal {
  background: #000 !important;
  opacity: 0.85 !important;

  backdrop-filter: blur(12px) !important;
  -webkit-backdrop-filter: blur(12px) !important;

  transition: all 0.4s ease !important;
}

// 关闭按钮
::v-deep .el-dialog__header {
  position: absolute;
  top: 0;
  z-index: 3;
  right: 0;
}
</style>
