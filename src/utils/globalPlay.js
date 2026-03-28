export function handleGlobalPlay({ store, message }, id) {
  // 从vuex中获取播放实例、播放状态、歌曲列表、当前播放歌曲
  const { audioInstance, songQueue, currentSong } = store.state.player

  if (songQueue.length === 0) {
    message.warning('当前播放列表为空')
    return
  }

  // 没有传入id 控制栏的播放按钮
  if (id === undefined || id === null) {
    // 如果有当前播放的歌曲，则切换播放状态
    if (audioInstance && currentSong) {
      store.dispatch('player/togglePlay')
    } else {
      // 否则播放第一首歌曲
      store.dispatch('player/playSong')
    }
    return
  }

  // 有传入id 侧边栏的播放按钮
  const isCurrentSong = currentSong?.id === id
  if (!audioInstance || !currentSong || !isCurrentSong) {
    // 无实例 / 无当前播放歌曲 / 点击的是其他歌曲 → 播放目标歌曲
    store.dispatch('player/playSong', id)
  } else {
    // 点击的是当前播放的歌曲 → 切换暂停/播放
    store.dispatch('player/togglePlay')
  }
}
