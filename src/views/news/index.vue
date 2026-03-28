<template>
  <div class="news-page">
    <!-- 背景 -->
    <bgBox />
    <!-- 侧边栏 -->
    <aside class="sidebar glassy-background" :class="{ expanded: sidebarExpanded }">
      <div class="sidebar-header">
        <el-button
          type="primary"
          icon="el-icon-menu"
          circle
          @click="toggleSidebar"
        />
        <span v-if="sidebarExpanded" class="sidebar-title">探索中心</span>
      </div>

      <!-- <transition name="slide">
        <div v-if="sidebarExpanded" class="sidebar-intro">
          <div class="intro-card">
            <h4>今日简报</h4>
            <p>当前共有  条新资讯，包含 5 个视频动态。</p>
          </div>
        </div>
      </transition> -->

      <div class="sidebar-nav">
        <!-- all -->
        <router-link
          class="nav-item"
          to="/news/all"
          active-class="active"
        >
          <i class="el-icon-s-home" />
          <span v-if="sidebarExpanded">全部资讯</span>
        </router-link>
        <!-- today -->
        <router-link
          class="nav-item"
          to="/news/today"
          active-class="active"
        >
          <i class="el-icon-s-home" />
          <span v-if="sidebarExpanded">今日新闻</span>
        </router-link>
        <!-- video -->
        <router-link
          class="nav-item"
          to="/news/videos"
          active-class="active"
        >
          <i class="el-icon-video-camera-solid" />
          <span v-if="sidebarExpanded">视频专区</span>
        </router-link>
      </div>
    </aside>

    <!-- 内容 -->
    <main class="grid-wrapper">
      <router-view />
    </main>
  </div>
</template>

<script>
import bgBox from '@/components/bg-box.vue'
export default {
  components: { bgBox },
  data() {
    return {
      sidebarExpanded: false
    }
  },
  methods: {
    // 切换则边栏布局
    toggleSidebar() {
      this.sidebarExpanded = !this.sidebarExpanded
    }
  }
}
</script>

<style lang="scss">
</style>

<style lang="scss" scoped>
.news-page {
  display: flex;
  height: calc(100vh - 80px) ;
  margin-top: 80px;
  // max-height: calc(100vh - 80px) ;
  // margin-top: 80px;
  background: black;
  position: relative;
}

/* --- 侧边栏样式 --- */
.sidebar {
  position: fixed;
  left: 0;
  top: 80px;
  height: calc(100% - 80px);
  // height: calc(100vh - 80px);
  width: 80px;
  transition: all 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
  z-index: 7;
  overflow: hidden;

  &.expanded {
    width: 250px;
  }

  .sidebar-header {
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 15px;
    .sidebar-title {
      font-weight: bold;
      color: #fff;
      white-space: nowrap;
    }
  }

  .sidebar-intro {
    padding: 0 20px 20px;
    .intro-card {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 12px;
      h4 {
        font-size: 14px;
        margin-bottom: 8px;
      }
      p {
        font-size: 12px;
        color: #666;
        line-height: 1.6;
      }
    }
  }

  .sidebar-nav {
    margin-top: 10px;
    .nav-item {
      padding: 15px 30px;
      display: flex;
      align-items: center;
      gap: 20px;
      cursor: pointer;
      color: #fff;
      transition: 0.3s;
      border-right: 3px solid transparent;
      text-decoration: none;
      &:hover,
      &.active {
      background-color: #409eff;
      border-color: #fff;
      }
      i {
        font-size: 20px;
      }
      span {
        white-space: nowrap;
      }
    }
  }
}

/* 网格布局 */
.grid-wrapper {
  // top: 80px;
  height: calc(100% - 80px);
  flex: 1;
  overflow: hidden;
  margin-left: 80px;
  padding: 40px;
  transition: margin-left 0.3s ease;
  position: relative;
  z-index: 1; // 保证内容在背景之上
}
.sidebar.expanded ~ .grid-wrapper {
  margin-left: 280px;
}
</style>
