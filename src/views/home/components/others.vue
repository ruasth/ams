<template>
  <div class="othersContainer">
    <!-- 背景 -->
    <bg-box class="bg-box" style="z-index: -1" />
    <!-- 占位 -->
    <div class="head-blank" />
    <!-- 标题 -->
    <div class="header-info">
      <h2 class="others-title">More · 更多内容</h2>
    </div>
    <!-- 内容区 -->
    <!-- 网格区域 -->
    <div class="others-contents">
      <router-link to="/tour" class="grid-item the-tour glassy-background">
        <h
          class="box-title glassy-background jumpy-transition"
        >巡演路线<span>穿梭于狂欢的巡回演唱之旅</span></h>
      </router-link>
      <router-link
        to="/playlist"
        class="grid-item the-playlist glassy-background"
      >
        <h
          class="box-title glassy-background jumpy-transition mid"
        >巡演歌单<span>身临其境，跟进巡演的表演歌单</span></h>
      </router-link>
      <router-link to="/feed" class="grid-item the-link1 glassy-background">
        <h
          class="box-title glassy-background jumpy-transition"
        >意见反馈<span>对本网页有任何改进建议？前往反馈</span></h>
      </router-link>
    </div>
    <!-- 底部 -->
    <!-- <div class="footer glassy-background jumpy-transition">1</div> -->
  </div>
</template>

<script>
import bgBox from '@/components/bg-box.vue'
export default {
  components: {
    bgBox
  },
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped>
.othersContainer {
  height: calc(100vh - 80px);
  background-color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: relative;
  // 动画
  // .header-info,
  // .others-contents,
  // .footer {
  //   opacity: 0;
  //   transform: translateY(60px);
  //   transition: all 1s cubic-bezier(0.16, 1, 0.3, 1);
  // }
  // &.animate-start {
  //   .header-info{
  //     opacity: 1;
  //     transform: translateY(0);
  //   }
  //   .others-contents {
  //     opacity: 1;
  //     transform: translateY(0);
  //     transition-delay: 0.2s;
  //   }
  //   .footer {
  //     opacity: 1;
  //     transform: translateY(0);
  //     transition-delay: 0.4s;
  //   }
  // }
}

// 顶部占位
.head-blank {
  // background-color: #12229a;
  width: 100%;
  height: 5vh;
}
// 标题
.header-info {
  width: 100%;
  height: 10vh;

  .others-title {
    color: #fff;
    font-size: 38px;
    font-weight: 800;
    line-height: 15vh;
    text-align: center;
  }
}
// 内容区域
.others-contents {
  width: 100%;
  height: 60vh;
  padding: 3%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 3%;
  z-index: 1;
  position: relative;

  .grid-item {
    width: 20%;
    height: 100%;
    border-radius: 15px;
    overflow: hidden;
    position: relative;
    text-decoration: none;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    &:hover {
      transform: scale(1.05);
      .box-title {
        transform: translateY(0);
        &.mid {
          transform: translateY(0);
        }
      }
    }
    &:active {
      transform: scale(0.95) !important;
    }
    .box-title {
      width: 100%;
      height: 20%;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      gap: 10px;
      color: #fff;
      font-size: 25px;
      font-weight: 600;
      transform: translateY(-101%);
      // transition: all 0.5s ease-in-out;
      span {
        font-size: 20px;
        font-weight: 400;
      }
      &.mid {
        position: absolute;
        bottom: 0;
        transform: translateY(101%);
      }
    }
  }

  .the-tour {
    background: url(../../../assets/AvaMax/otherpage/o1.jpg) center / cover;
  }

  .the-playlist {
    background: url(../../../assets/AvaMax/otherpage/o2.jpg) center / cover;
  }

  .the-link1 {
    background: url(../../../assets/AvaMax/otherpage/o3.jpg) center / cover;
  }
}
// 底部
.footer {
  width: 100%;
  height: 15vh;
  // background-color: #fff;
  // position: absolute;
  // bottom: 0;
}
</style>
