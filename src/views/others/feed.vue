<template>
  <div class="feed-page">
    <bg-box />
  </div>
</template>

<script>
import bgBox from '../../components/bg-box.vue'
export default {
  components: {
    bgBox
  }
}
</script>

<style lang="scss" scoped>
.feed-page {
    margin-top: 80px;
  width: 100%;
  height: calc(100vh - 80px) ;
  background-color: #000;
}
</style>
