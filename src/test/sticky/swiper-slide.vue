<template>
  <swiper
    $ref="mySwiper"
    :options="swiperOptions"
    class="mySwiper swiper-container"
  >
    <swiper-slide
      v-for="item in swiperSlideData"
      :key="item.id"
      class="swiper-container-slide"
      :style="{ backgroundImage: item.backgroundImage }"
    >
      <div class="slide-content">
        <span class="slide-content-title">{{ item.title }}</span>
        <span class="slide-content-title2">{{ item.title2 }}</span>
        <el-button class="slide-content-btn" round>点击播放</el-button>
      </div>
    </swiper-slide>
  </swiper>
</template>

<script>
export default {
  data() {
    return {
      swiperOptions: {
        loop: true,
        autoplay: {
          delay: 1000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true
        }
      },
      swiperSlideData: [
        {
          id: 1,
          title: '全新大碟',
          title2: "Don't Click Play",
          //   backgroundColor: 'rgba(156, 254, 65)'
          backgroundImage:
            'url(' + require('@/assets/Ava Max/bg-dcp.jpg') + ')'
        },
        {
          id: 2,
          title: '经典聆听',
          title2: 'Heaven & Hell',
          //   backgroundColor: 'rgba(56, 42, 282)'
          backgroundImage:
            'url(' + require('@/assets/Ava Max/bg-dcp.jpg') + ')'
        }
      ]
    }
  },
  computed: {
    // 通过计算属性获取 swiper 实例
    // mySwiper() {
    //   return this.$refs.mySwiper ? this.$refs.mySwiper.$swiper : null
    // }
  },
  mounted() {
    // 现在可以通过 this.mySwiper 访问 swiper 实例
    // if (this.mySwiper) {
    //   console.log('Swiper 实例加载成功:', this.mySwiper)
    // }
  }
}
</script>

<style lang="scss" scoped>
.swiper-container {
  color: #fff;

  &-slide {
    background-position: center -48px;
    background-size: cover;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.slide-content {
  margin-top: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  &-title {
    font-size: 80px;
    font-weight: bold;
  }
  &-title2 {
    font-size: 50px;
    font-weight: bold;
  }
  &-btn {
    margin: 10px 0;
    padding: 10px 20px;
    color: #fff;
    background-color: rgb(0, 0, 0, 000);
    font-size: 18px;
    font-weight: bold;
    &:hover {
      transform: translateY(-3px);
      /* 悬停偏移 */
      box-shadow: 0px 10px 20px rgb(0, 0, 0, 0.2);
    }
    &:active {
      transform: translateY(-1px);
      /* 点击偏移 */
      box-shadow: 0px 5px 10px rgb(0, 0, 0, 0.2);
    }
  }
}
</style>
