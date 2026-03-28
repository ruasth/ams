<template>
  <div class="app-main">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'AppMain'
}
</script>

<style scoped>
.app-main {
  min-height: 100vh;
  width: 100%;
  position: relative;

  background-color: #fff;
}
</style>
