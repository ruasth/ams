<template>
  <div ref="stickyElement" class="news" :class="{ 'is-fixed': isStickyFixed }">
    <div class="news-bg-canvas" />

    <div class="news-container" :class="{ 'animate-start': isStickyFixed }">

      <div class="header-info">
        <span class="news-tag">LATEST FEED · 探索新鲜事</span>
        <h2 class="news-title">获取Ava Max的最新动态</h2>
      </div>

      <div class="grid-displayer">
        <div v-for="colIndex in 5" :key="'col-' + colIndex" class="grid-column">
          <div
            v-for="rowIndex in 3"
            :key="'row-' + rowIndex"
            :class="[
              'grid-item', 'post-box'
              // (colIndex + rowIndex) % 2 === 0 ? 'post-box' : 'video-box'
            ]"
          >
            <div class="media-placeholder">
              <span class="icon">{{ (colIndex + rowIndex) % 2 === 0 ? 'POST' : 'VIDEO' }}</span>
              <div class="glass-reflection" />
            </div>

            <div class="item-overlay">
              <span class="view-text">VIEW MORE</span>
            </div>
          </div>
        </div>
      </div>

      <div class="action-footer">
        <el-button class="more-news-btn" round @click="$router.push('/news')">
          进入咨询馆
          <i class="el-icon-right" />
        </el-button>
        <p class="footer-hint">滑动探索更多动态</p>
      </div>

    </div>
  </div>
</template>

<script>
import stickyMixin from '@/mixin/sticky.js'

export default {
  name: 'News',
  mixins: [stickyMixin]
}
</script>

<style lang="scss" scoped>
.news {
  width: 100%;
  height: 100vh;
  position: relative;
  top: 80px;
  left: 0;
  overflow: hidden;
  z-index: 3;

  &.is-fixed {
    position: fixed;
    top: 80px;
    left: 0;
    z-index: 3;
  }
}

.news-bg-canvas {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: linear-gradient(125deg,  #964749, #997c45, #9b8f5c, #578a6c, #577a96, #6c5796, #865796);
  background-size: 400% 400%;
  animation: rainbowSlide 12s ease infinite;
}

@keyframes rainbowSlide {
  0% {
    background-position: 100% 0;
  }
  50% {
    background-position: 0% 0;
  }
  100% {
    background-position: 100% 0;
  }
}

@keyframes gradientBG {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}

.news-container {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 5vh;

  .header-info,
  .grid-displayer,
  .action-footer {
    opacity: 0;
    transform: translateY(60px);
    transition: all 1s cubic-bezier(0.16, 1, 0.3, 1);
  }

  &.animate-start {
    .header-info {
      opacity: 1;
      transform: translateY(0);
    }

    .grid-displayer {
      opacity: 1;
      transform: translateY(0);
      transition-delay: 0.2s;
    }

    .action-footer {
      opacity: 1;
      transform: translateY(0);
      transition-delay: 0.4s;
    }
  }
}

.header-info {
  text-align: center;
  margin: 30px 0 0 0;

  .news-tag {
    color: #fff;
    font-weight: bold;
    letter-spacing: 4px;
    font-size: 13px;
    opacity: 1;
  }

  .news-title {
    color: #fff;
    font-size: 38px;
    margin-top: 8px;
    font-weight: 800;
  }
}

.grid-displayer {
  display: flex;
  gap: 20px;
  width: 95%;
  max-width: 1400px;
  height: 60vh;
  overflow: visible;

  $mask-linear: linear-gradient(
    to bottom,
    transparent 0%,
    black 15%,
    black 85%,
    transparent 100%
  ),
  linear-gradient(
    to right,
    transparent 0%,
    black 5%,
    black 95%,
    transparent 100%
  );

  mask-image: $mask-linear;
  -webkit-mask-image: $mask-linear;
  mask-composite: intersect;
  -webkit-mask-composite: source-in;

  @media (max-width: 768px) {
    mask-image: linear-gradient(to bottom, transparent, black 10%, black 90%, transparent);
    -webkit-mask-image: linear-gradient(to bottom, transparent, black 10%, black 90%, transparent);
  }
}

.grid-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;

  &:nth-child(even) {
    padding-top: 50px;
  }
}

.grid-item {
  position: relative;
  width: 100%;
  border-radius: 20px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.17);
  border: 1px solid rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(5px);
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    transform: translateY(-10px) scale(1.02);
    border-color: rgba(64, 158, 255, 0.5);
    background: rgba(255, 255, 255, 0.08);
    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5);

    .item-overlay {
      opacity: 1;
    }

    .glass-reflection {
      // transform: translateX(100%);
      left: 150% !important;
      transition: left 0.6s ease-in-out;
    }
  }

  &.post-box {
    flex-grow: 1;
    min-height: 200px;
  }

  .media-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;

    .icon {
      color: rgba(255, 255, 255, 0.5);
      font-weight: bold;
      font-size: 12px;
    }

    .glass-reflection {
      position: absolute;
      top: 0;
      left: -100%;
      width: 50%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.25),
        transparent
      );
      transform: skewX(-30deg);
      z-index: 2;
    }
  }

  .item-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s;

    .view-text {
      color: #fff;
      font-size: 12px;
      padding: 8px 16px;
      border: 1px solid #fff;
      border-radius: 20px;
    }
  }
}

.action-footer {
  margin-top: 5px;
  text-align: center;

  .more-news-btn {
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: #fff;
    padding: 15px 45px;
    font-size: 20px;
    letter-spacing: 2px;
    backdrop-filter: blur(10px);
    transition: all 0.3s;

    &:hover {
      background: #fff;
      color: #000;
      transform: scale(1.05);
    }
  }

  .footer-hint {
    color: rgba(255, 255, 255, 0.3);
    font-size: 12px;
    margin-top: 20px;
    letter-spacing: 1px;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
