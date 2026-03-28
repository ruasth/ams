<template>
  <!-- 网格背景 -->
  <div class="bg-animation" />
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
// 背景
.bg-animation {
  width: 100%;
  height: 100%;
  max-height: calc(100vh - 80px);
  position: absolute;
  top: 0%;
  left: 0%;
  // inset: 0;
  z-index: 0;
  background: radial-gradient(
      circle at 50% 50%,
      rgba(20, 30, 50, 0.5) 0%,
      transparent 50%
    ),
    linear-gradient(0deg, rgba(0, 243, 255, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 243, 255, 0.05) 1px, transparent 1px);
  background-size: 100% 100%, 40px 40px, 40px 40px;
}

</style>
