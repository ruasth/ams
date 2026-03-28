<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>

export default {
  created() {
    this.$store.dispatch('releases/fetchReleases')
  }
}
</script>

<style lang="sass" scoped>
</style>
