import { getAudioList } from '@/api/audio'
import { Message } from 'element-ui'

const state = {
  songList: [], // 存储所有歌曲（id/title/audioUrl）
  songQueue: [], // 播放队列

  rafId: null, // 请求动画帧
  audioInstance: null, // 全局唯一Audio实例
  playState: false, // 播放状态：true=播放，false=暂停
  isDragging: false, // 推拽状态：true=推拽中，false=推拽结束

  currentSong: null, // 当前播放歌曲（{id,title,audioUrl}）
  currentTime: 0, // 当前歌曲播放时间
  totalTime: 0 // 歌曲总时长时长
}

const mutations = {
  // 同步修改状态
  // 存储所有歌曲
  SET_SONG_LIST(state, list) {
    state.songList = list
  },
  // 存储合并后的歌曲列表
  SET_SONG_QUEUE(state, songList) {
    state.songQueue = songList
  },
  // 存储当前播放歌曲
  SET_CURRENT_SONG(state, song) {
    state.currentSong = song
  },
  // 存储播放状态
  SET_PLAY_STATE(state, bool) {
    state.playState = bool
  },
  // 存储Audio实例
  SET_AUDIO_INSTANCE(state, instance) {
    state.audioInstance = instance
  },
  // 存储当前播放时间
  SET_CURRENT_TIME(state, time) {
    state.currentTime = time
  },
  // 存储歌曲总时长
  SET_TOTAL_TIME(state, time) {
    state.totalTime = time
  },
  // 存储RAF
  SET_RAF_ID(state, id) {
    if (state.rafId) cancelAnimationFrame(state.rafId)
    state.rafId = id
  },
  // 存储推拽状态
  SET_DRAGGING(state, bool) {
    state.isDragging = bool
  }
}

const actions = {
  // 获取歌曲列表注入audio相关数据
  async initAudioList({ dispatch, commit, rootGetters }) {
    // 检测是否已加载
    if (!rootGetters['releases/getListState']) {
      await dispatch('releases/fetchReleases', null, { root: true })
    }
    // 获取歌曲列表
    const list = rootGetters['releases/getReleasesList']
    // 获取音频数据
    let audioList = []
    try {
      const audioRes = (await getAudioList()).data.items
      audioList = audioRes
    } catch (err) {
      console.warn('获取音频失败')
    }
    // console.log(audioList)

    // 生成唯一标识符 + 合并releases&audios数据
    const songList = []
    list.forEach(item => {
      const audio = audioList.find(audio => item.id === audio.id)
      if (audio) {
        const QID = `q-${Date.now()}-${Math.random().toString(36).slice(2)}`
        songList.push({ ...item, ...audio, QID })
      }
    })
    // console.log(songList)

    // 存储歌曲列表
    commit('SET_SONG_QUEUE', songList)
  },
  // 播放歌曲
  async playSong({ commit, state, dispatch }, id) {
    let targetSong = state.songQueue[0]
    let title = null

    // 查找对应ID歌曲
    if (id) {
      const findSong = state.songQueue.find(item => item.id === id)
      if (findSong) {
        targetSong = findSong
      } else if (!findSong) {
        console.warn('未找到指定ID的歌曲，默认播放列表第一首')
        Message({
          message: '未找到指定ID的歌曲，已为您默认播放列表第一首',
          type: 'warning',
          duration: 4000,
          offset: 120
        })
        targetSong = state.songQueue[0]
        commit('SET_CURRENT_SONG', targetSong)
      }
    }
    title = targetSong.title
    console.log('title是', title)

    console.log(targetSong)
    // 检测是否有音频
    // if (!targetSong.audioUrl) {
    //   const res = await getAudio(songTitle)
    //   console.log(res)
    //   // targetSong.audioUrl = ncmaUrl
    // }
    // ---
    // if (!targetSong.Lyric) {
    //   const res = await getLyric(title)
    //   console.log('请求的歌词', res)
    //   // targetSong.audioUrl = ncmaUrl
    // }

    let audio = state.audioInstance
    // 无实例则创建，绑定播放事件
    if (!audio) {
      audio = new Audio()
      // 播放结束后更新状态
      audio.onended = () => {
        commit('SET_PLAY_STATE', false)
        dispatch('changeSong', 'prev')
      }
      // 获取歌曲总时长
      audio.onloadedmetadata = () => commit('SET_TOTAL_TIME', audio.duration)
      // 切换歌曲时重置
      audio.onloadstart = () => commit('SET_TOTAL_TIME', 0)
      // 更新当前播放时间
      audio.ontimeupdate = () => {
      }
      commit('SET_AUDIO_INSTANCE', audio)
    }

    // 切换音频路径并播放
    if (audio.src !== targetSong.audioUrl) {
      audio.src = require(`@/assets/${targetSong.audioUrl}`)
      audio.load()
    }
    // 处理播放权限（浏览器禁止自动播放）
    audio.play().then(() => {
      commit('SET_CURRENT_SONG', targetSong)
      commit('SET_PLAY_STATE', true)
      // 派发歌词请求
      // dispatch('lyric/lyricsByNcma', title, { root: true })
      dispatch('lyric/getLyrics', { id, title }, { root: true })
      // 启动 rAF 循环
      dispatch('_startRAF')
    }).catch(err => {
      console.log('播放失败（需用户主动点击）：', err)
      commit('SET_PLAY_STATE', false)
    })
  },
  // 暂停/播放切换
  togglePlay({ state, commit, dispatch }) {
    // if (!state.audioInstance || !state.currentSong) return
    const audio = state.audioInstance
    if (audio.paused) {
      audio.play().then(() => {
        commit('SET_PLAY_STATE', true)
        // 重新启动 rAF
        dispatch('_startRAF')
      })
    } else {
      audio.pause()
      commit('SET_PLAY_STATE', false)
      commit('SET_RAF_ID', null) // 停止 rAF
    }
  },
  // 跳转到指定时间
  seekToTime({ state, commit, dispatch }, time) {
    if (!state.audioInstance) return
    const audio = state.audioInstance

    audio.currentTime = time
    commit('SET_CURRENT_TIME', time)
    if (audio.paused) {
      audio.play().then(() => {
        commit('SET_PLAY_STATE', true)
        // 重新启动 rAF
        dispatch('_startRAF')
      }).catch(err => {
        console.error(err)
      })
    }
  },
  // 上/下 切歌
  changeSong({ state, commit, dispatch }, type) {
    // 检查播放队列
    if (!state.songQueue || state.songQueue.length === 0) {
      console.warn('播放队列为空，无法切歌')
      return
    }
    // 检查音频实例和当前歌曲
    if (!state.audioInstance || !state.currentSong) {
      dispatch('playSong', state.songQueue[0].id) // 播放第一首
      return
    }
    // 检查当前歌曲是否在播放队列中
    const currentSongIndex = state.songQueue.findIndex(item => item.id === state.currentSong.id)
    if (currentSongIndex === -1) {
      dispatch('playSong', state.songQueue[0].id) // 播放第一首
      return
    }
    // 跟据切歌类型计算Index
    let targetIndex
    if (type === 'prev') {
      targetIndex = currentSongIndex - 1
    } else if (type === 'next') {
      targetIndex = currentSongIndex + 1
    } else {
      console.warn('未知的切歌类型')
      return
    }
    // 检查Index是否越界
    if (targetIndex < 0) {
      targetIndex = state.songQueue.length - 1
    } else if (targetIndex > state.songQueue.length - 1) {
      targetIndex = 0
    }
    // 派发切歌事件
    const targetSong = state.songQueue[targetIndex]
    dispatch('playSong', targetSong.id)
  },
  // 插播歌曲
  insertSong() {

  },
  // raf循环
  _startRAF({ state, commit }) {
    if (!state.audioInstance) return
    const audio = state.audioInstance

    // 停止之前的 rAF
    if (state.rafId) cancelAnimationFrame(state.rafId)

    const updateLoop = () => {
      if (!audio.paused && !audio.ended) {
        if (!state.isDragging) {
          commit('SET_CURRENT_TIME', audio.currentTime)
        }
        const rafId = requestAnimationFrame(updateLoop)
        commit('SET_RAF_ID', rafId)
      }
    }
    const rafId = requestAnimationFrame(updateLoop)
    commit('SET_RAF_ID', rafId)
  }
}

const getters = {
  // 获取播放状态
  isPlaying: state => state.playState,
  // 获取当前播放歌曲信息
  getCurrentSong: state => state.currentSong,
  getCurrentTime: state => state.currentTime,
  // 获取歌曲列表
  getSongList: state => state.songList,
  getSongQueue: state => state.songQueue
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
