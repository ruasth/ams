<template>
  <div class="news-today">
    <haedRow :head-info="headInfo" />
    <mainContent :news-list="newsList" :head-info="headInfo" @open="onClickNews" />
  </div>
</template>

<script>
import mainContent from './NewsLayout/mainContent.vue'
import haedRow from './NewsLayout/headRow.vue'
import { getNewsList } from '@/api/news'
import { getImagesUrl } from '@/utils/getImageUrl'
export default {
  components: {
    mainContent,
    haedRow
  },
  data() {
    return {
      headInfo: {
        title: '今日新闻',
        status: 'TODAY'
      },
      newsList: []
    }
  },
  created() {
    this.newsListRequest()
  },
  methods: {
    // 获取新闻列表
    async newsListRequest() {
      const res = await (await getNewsList()).data.items
      const postList = []
      res.forEach((item) => {
        if (item.type === 'POST') {
          postList.push(item)
        }
      })
      this.newsList = postList
    },
    // 计算图片路径
    imagePath(path) {
      return getImagesUrl(path)
    },
    // 打开新闻
    onClickNews(id) {
      console.log(id)
    }
  }
}
</script>

<style lang="scss" scoped>
.news-today {
  width: 100%;
  height: 90%;
}
</style>
