import { getSongId, getSongUrl, getSongLyric } from '@/api/ncma'

const getId = async(title) => {
  if (!title) return null
  const { data } = await getSongId(title)
  return data.result.songs[0].id || null
}

export async function getAudio(title) {
  const songId = await getId(title)
  const { data } = await getSongUrl(songId)
  return data.data[0].url || null
}

export async function getLyric(title) {
  const songId = await getId(title)
  const { data } = await getSongLyric(songId)
  return data || null
}
