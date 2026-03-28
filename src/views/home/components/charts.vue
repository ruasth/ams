<template>
  <div ref="stickyElement" class="charts" :class="{ 'is-fixed': isStickyFixed }">5</div>
</template>

<script>
import stickyMixin from '@/mixin/sticky.js'
export default {
  mixins: [
    stickyMixin
  ]
}
</script>

<style lang="scss" scoped>
.charts {
    width: 100%;
    height: 100vh;
    // margin: calc(100vh) 0 0 0;
    background-color: skyblue;

    position: relative;
    top: 80px;
    left: 0;
    z-index: 3;

    &.is-fixed {
      position: fixed;
      top: 80px; /* 固定停在距离视口顶部80px的位置 */
      left: 0;
      z-index: 4;
      /* 变为fixed后 元素会脱离文档流，原位置会坍塌
         需要添加一个等高的padding-bottom占位 防止页面布局跳动*/

    }
  }
</style>
