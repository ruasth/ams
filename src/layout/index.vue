<template>
  <div class="position-for-lyric">
    <div class="app-wrapper" :style="{'overflow-y': lyricState ? 'hidden' : 'auto'}">
      <Navbar class="fixed-header navbar" />
      <AppMain />
      <SideBar class="sidebar" />
      <ControlBar class="cotrolbar" />
    </div>
    <LyricPage class="lyricpage" />
  </div>
</template>

<script>
import { Navbar, AppMain } from './components'
import ControlBar from './components/ControlBar.vue'
import SideBar from './components/SideBar.vue'
import LyricPage from './components/LyricPage.vue'
// import { mapActions } from 'vuex'
export default {
  name: 'LayoutView',
  components: {
    Navbar,
    AppMain,
    ControlBar,
    LyricPage,
    SideBar
  },
  computed: {
    lyricState() {
      return this.$store.getters.getLyricState
    }
  },
  created() {
    // this.initAudioList()
    // console.log('请求歌曲列表')
  },
  methods: {
    // ...mapActions('player', ['initAudioList'])
  }
}
</script>

<style lang="scss"  scoped>
.app-wrapper {
  position: relative;
  min-height: 100vh;
  width: 100%;
  overflow-y: hidden;
  display: flex;
  flex-direction: column;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
}

.cotrolbar {
  position: fixed;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 99;
}
</style>

<style lang="scss" scoped>
.position-for-lyric {
  position: relative;
  width: 100%;
  height: 100%;
}
.isOpen {
  overflow: hidden;
}

.lyricpage {
  position: fixed;
  top: 0;
  left: 0;
  // transform: translate(-50%, -50%);
  z-index: 100;
}
</style>
