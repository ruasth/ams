import ncamAxios from '@/utils/ncma/ncma'

export function getSongId(title) {
  return ncamAxios({
    // url: `http://localhost:3000/song?id=${title}`,
    url: `http://localhost:3000/search?keywords=AvaMax${title}`,
    method: 'get'
  })
}

export function getSongUrl(id) {
  return ncamAxios({
    url: `http://localhost:3000/song/url/v1?id=${id}&unblock=true`,
    method: 'get'
  })
}

export function getSongLyric(id) {
  return ncamAxios({
    url: `http://localhost:3000/lyric?id=${id}`,
    method: 'get'
  })
}
