<template>
  <div class="app-wrapper">
    <Navbar class="fixed-header navbar" />
    <AppMain />
    <SideBar class="sidebar" />
    <ControlBar class="cotrolbar" />
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
    SideBar,
    LyricPage
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
    /* height: 100%; */
    min-height: 100vh;
    width: 100%;
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

.lyricpage {
    position: absolute;
    top: 0;
    left: 0;
    // transform: translate(-50%, -50%);
    z-index: 100;
}
</style>
