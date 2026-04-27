import { getLyricsList } from '@/api/lyrics'
import { getLyric } from '@/utils/ncma/request'

const state = {
  lyricState: false,
  originalLyric: '',
  translateLyric: '',
  theType: 'v'
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
  async getLyrics({ state, commit, dispatch }, { id, title }) {
    console.log(id, title)

    if (state.theType === 'n') {
      dispatch('lyricsByNcma', title)
      return
    }

    try {
      const res = (await getLyricsList(id)).data
      const OL = (require(`@/assets/${res.originalUrl}`)).default
      const TL = (require(`@/assets/${res.translateUrl}`)).default
      // console.log(OL)
      commit('SET_LYRICS', { OL, TL })
    } catch (err) {
      commit('SET_LYRICS', { originalLyric: '', translateLyric: '' })
    }
  },
  async lyricsByNcma({ commit }, title) {
    try {
      const res = await getLyric(title)
      const OL = res.lrc.lyric
      const TL = res.tlyric.lyric
      console.log(OL, TL)
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
