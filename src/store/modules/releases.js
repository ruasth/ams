import { getReleasesList, getSongInfo } from '@/api/releases'

const state = {
  list: [], // 存储所有releases数据
  loaded: false, // 标记是否已加载
  songInfo: {} // 存储单个release的songInfo
}

const mutations = {
  // 存储所有releases数据
  SET_RELEASES(state, list) {
    state.list = list
    state.loaded = true
  },
  // 存储单条songInfo
  SET_SONGINFO(state, songInfo) {
    state.songInfo = songInfo
  }
}

const actions = {
  // 请求所有releases数据
  async fetchReleases({ state, commit }) {
    // 检测是否已加载
    if (state.loaded) return
    // 获取releases数据
    const res = (await getReleasesList()).data.items

    commit('SET_RELEASES', res)
  },
  // 请求songInfo数据
  async fetchSongInfo({ state, commit }, id) {
    // 检测是否已加载
    // if (state.songInfo.id === id) return
    if (state.songInfo && state.songInfo.id === id) return
    // 获取songInfo数据
    const res = (await getSongInfo(id)).data
    console.log(res)

    commit('SET_SONGINFO', res)
  }
}

const getters = {
  // 获取歌曲列表
  getReleasesList: (state) => { return state.list },
  // 根据id获取单个release信息 包含音频信息
  getReleaseById: (state) => (id) => { return state.list.find(item => item.id === id) },
  // 获取List加载状态
  getListState: (state) => { return state.loaded },
  // 获取songInfo
  getSongInfo: (state) => { return state.songInfo }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
