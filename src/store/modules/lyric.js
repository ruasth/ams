import { getLyricsList } from '@/api/lyrics'

const state = {
  lyricState: false,
  originalLyric: '',
  translateLyric: ''
}

const mutations = {
  SET_LYRIC_STATE(state, isLyricing) {
    state.lyricState = isLyricing
  },
  SET_LYRICS(state, { OL, TL }) {
    state.originalLyric = OL
    state.translateLyric = TL
  }
}

const actions = {
  // 歌词面板状态
  setLyricState({ commit }, isLyricing) {
    commit('SET_LYRIC_STATE', isLyricing)
  },
  // 获取歌词
  async getLyrics({ commit }, id) {
    try {
      const res = (await getLyricsList(id)).data
      const OL = (require(`@/assets/${res.originalUrl}`)).default
      const TL = (require(`@/assets/${res.translateUrl}`)).default
      // console.log(OL)
      commit('SET_LYRICS', { OL, TL })
    } catch (err) {
      commit('SET_LYRICS', { originalLyric: '', translateLyric: '' })
    }
  }
}

const getters = {
  getLyricState: state => state.lyricState,
  // 获取歌词
  getLyrics: state => {
    return {
      OL: state.originalLyric,
      TL: state.translateLyric
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
