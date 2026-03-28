<template>
  <div class="news-all">
    <haedRow :head-info="headInfo" />
    <mainContent :news-list="newsList" :head-info="headInfo" />
  </div>
</template>

<script>
import mainContent from '@/components/NewsLayout/mainContent.vue'
import haedRow from '@/components/NewsLayout/headRow.vue'
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
        title: '全部咨询',
        status: 'ALL'
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
    }
  }
}
</script>

<style lang="scss" scoped>
.news-all {
  width: 100%;
  height: 90%;
}
</style>
