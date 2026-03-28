<template>
  <div class="home">
    <!-- 空白区域: 当元素离开文档流时补偿塌陷的高度 -->
    <div class="sticky-blank" :style="{height: blankHeight}" />
    <!-- 固定的背景 -->
    <background />
    <!-- 参与固定显示的组件 -->
    <annals sticky-name="annals" />
    <news sticky-name="news" />
    <charts sticky-name="charts" />
    <!-- 结尾组件显示 -->
    <others class="end-content">5</others>
  </div>
</template>

<script>
import background from './components/background.vue'
import annals from './components/annals.vue'
import charts from './components/charts.vue'
import news from './components/news.vue'
import others from './components/others.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'HomeView',
  components: {
    background,
    annals,
    charts,
    news,
    others
  },
  data() {
    return {
      annalsFixed: false
    }
  },
  computed: {
    ...mapGetters('sticky', ['totalFixedHeight']),

    blankHeight() {
      return `calc(100vh + ${this.totalFixedHeight}vh + 80px)`
    }
  },
  mounted() {
    // 子组件挂载完成后，初始化滚动监听
    this.$nextTick(() => {
      this.$store.dispatch('sticky/initScrollListener')
    })
  }
}
</script>

<style lang="scss" scoped>
.home {
  height: 500vh;
  // min-height: calc(100vh + 400px);
  width: 100%;
  position: relative;

  .end-content {
    position: relative;
    z-index: 6;
  }
}
</style>
