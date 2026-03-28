<template>
  <div ref="stickyElement" class="annals" :class="{ 'is-fixed': isStickyFixed }">
    <div class="video-bg-container">
      <video autoplay muted loop playsinline class="blur-bg">
        <source src="../../../assets/background/spotafake.mp4" type="video/mp4">
      </video>
      <!-- 中心发光 -->
      <div class="center-glow" />
    </div>

    <div class="annals-layout" :class="{ 'animate-start': isStickyFixed }">
      <div class="content-side">
        <div class="text-wrapper">
          <span class="top-tag">THE BIOGRAPHY · 纪年</span>
          <h1 class="main-title">想要了解她的<br>生平作品？</h1>

          <div class="button-group">
            <button class="normal-btn_white" round @click="$router.push('/annals')">前往纪年馆</button>
            <button class="normal-btn_foggy" round @click="$router.push('/releases')">前往作品馆</button>
          </div>

          <div class="divider-line" />

          <div class="newrelease-section">
            <h2 class="section-label">LATEST RELEASE · 最新发布</h2>
            <div class="album-info">
              <div class="cover-wrapper">
                <img class="cover-img" src="@/assets/Cover/dontclickplay.jpg" alt="最新发布">
              </div>
              <div class="album-detail">
                <h3 class="song-name">Don't Click Play</h3>
                <p class="artist-name">Ava Max</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="video-side">
        <div class="video-window">
          <video autoplay muted loop playsinline class="main-video">
            <source src="../../../assets/background/spotafake.mp4" type="video/mp4">
          </video>
          <div class="video-border" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import stickyMixin from '@/mixin/sticky.js'
// import { getNewsList } from '@/api/news'
export default {
  name: 'Annals',
  mixins: [stickyMixin],
  created() {
    // this.getNewsList() // 在组件创建时手动触发执行
  },
  methods: {
    // async getNewsList() {
    //   // console.log('正在发起请求...')
    //   try {
    //     const res = await getNewsList()
    //     console.log('请求成功，返回数据：', res)
    //   } catch (error) {
    //     console.error('请求失败：', error)
    //   }
    // }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/main-button';
</style>

<style lang="scss" scoped>
.annals {
  width: 100%;
  height: 100vh;
  background-color: #000;
  position: relative;
  top: 80px; // 与 header 偏移量对齐
  left: 0;
  overflow: hidden;
  /* 初始层级设定为 2，需低于 index.vue 中后续组件的 z-index (如 releases 是 3) */
  z-index: 2;

  &.is-fixed {
    position: fixed;
    top: 80px;
    left: 0;
    z-index: 2;
    /* 保持一致，防止浮在后续组件上方 */
  }
}

// 背景视频容器：确保随父级固定
.video-bg-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;

  .blur-bg {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: blur(80px) brightness(0.3);
    transform: scale(1.1);
  }

  .center-glow {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 600px;
    height: 600px;
    background: radial-gradient(circle,
        rgba(64, 158, 255, 0.1) 0%,
        transparent 70%);
    pointer-events: none;
  }
}

// 布局容器：控制左右平衡
.annals-layout {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 50px;
  gap: 180px;

  /* --- 动画初始状态：透明且向下偏移 --- */
  .text-wrapper,
  .video-window {
    opacity: 0;
    transform: translateY(60px);
    transition: all 1.2s cubic-bezier(0.16, 1, 0.3, 1);
    will-change: transform, opacity;
  }

  /* --- 当 isStickyFixed 激活时触发的动画 --- */
  &.animate-start {
    .text-wrapper {
      opacity: 1;
      transform: translateY(0);
    }

    .video-window {
      opacity: 1;
      transform: translateY(0);
      /* 入场动画完成后，再开始循环漂浮动画 */
      animation: float 6s ease-in-out infinite 1.2s;
    }
  }
}

.content-side {
  flex: 1;
  display: flex;
  justify-content: flex-end;

  .text-wrapper {
    max-width: 550px;

    .top-tag {
      font-size: 14px;
      letter-spacing: 5px;
      color: #409eff;
      font-weight: bold;
      margin-bottom: 15px;
      display: block;
    }

    .main-title {
      font-size: 56px;
      font-weight: 900;
      line-height: 1.1;
      color: #fff;
      margin-bottom: 40px;
    }

    .button-group {
      display: flex;
      gap: 20px;
      margin-bottom: 50px;

      // .annals-btn {
      //   height: 52px;
      //   padding: 0 35px;
      //   font-size: 17px;
      //   border: 2px solid transparent;
      //   transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

      //   &.primary-btn {
      //     background: #fff;
      //     color: #000;
      //   }

      //   &.secondary-btn {
      //     background: rgba(255, 255, 255, 0.1);
      //     color: #fff;
      //     border-color: rgba(255, 255, 255, 0.2);
      //     backdrop-filter: blur(10px);
      //   }

      //   &:hover {
      //     transform: translateY(-5px);
      //     box-shadow: 0 12px 25px rgba(64, 158, 255, 0.3);
      //   }

      //   /* 统一的点击反馈 */
      //   &:active {
      //     transform: scale(0.95) !important;
      //     background: #409eff !important;
      //     border-color: #409eff !important;
      //     color: #fff !important;
      //     transition: all 0.1s;
      //   }
      // }
    }

    .divider-line {
      width: 100%;
      height: 1px;
      background: linear-gradient(to right,
          rgba(255, 255, 255, 0.3),
          transparent);
      margin-bottom: 40px;
    }
  }
}

.newrelease-section {
  .section-label {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.4);
    letter-spacing: 2px;
    margin-bottom: 20px;
  }

  .album-info {
    display: flex;
    align-items: center;
    gap: 25px;

    .cover-wrapper {
      width: 120px;
      height: 120px;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
      border: 1px solid rgba(255, 255, 255, 0.1);

      .cover-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .song-name {
      font-size: 24px;
      color: #fff;
      margin: 0 0 5px 0;
    }

    .artist-name {
      color: #409eff;
      font-size: 16px;
      margin: 0;
    }
  }
}

.video-side {
  flex: 1;
  display: flex;
  justify-content: flex-start;

  .video-window {
    position: relative;
    width: 424px;
    height: 75vh;
    border-radius: 30px;
    overflow: hidden;
    box-shadow: 0 60px 100px rgba(0, 0, 0, 0.7);

    .main-video {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .video-border {
      position: absolute;
      inset: 0;
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 30px;
      pointer-events: none;
    }
  }
}

/* 循环漂浮动画 */
@keyframes float {

  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }

  50% {
    transform: translateY(-15px) rotate(1deg);
  }
}

@media (max-width: 1100px) {
  .annals-layout {
    gap: 40px;
    padding: 0 30px;
  }

  .main-title {
    font-size: 42px;
  }

  .video-window {
    width: 280px;
  }
}
</style>
