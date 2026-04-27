<template>
  <div class="news-all">
    <haedRow :head-info="headInfo" />
    <mainContent
      :news-list="newsList"
      :head-info="headInfo"
    />
  </div>
</template>

<script>
import mainContent from './NewsLayout/mainContent.vue'
import haedRow from './NewsLayout/headRow.vue'
import { getNewsList, getNewsInfo } from '@/api/news'
import { getImagesUrl } from '@/utils/getImageUrl'
export default {
  components: {
    mainContent,
    haedRow
  },
  data() {
    return {
      dialogVisible: false, // 弹窗状态
      headInfo: {
        title: '全部咨询',
        status: 'ALL'
      },
      newsList: [],
      newsInfo: []
    }
  },
  created() {
    this.newsListRequest()
  },
  methods: {
    // 获取新闻列表
    async newsListRequest() {
      const res = (await getNewsList()).data.items
      const postList = []
      res.forEach((item) => {
        if (item.type === 'POST') {
          postList.push(item)
        }
      })
      this.newsList = postList
      // console.log(this.newsList)
    },
    // 获取新闻详情
    async newsInfoRequest(id, title) {
      const res = (await getNewsInfo(id)).data
      res.title = title
      this.newsInfo = res
      // console.log(res)
      console.log(this.newsInfo)
    },
    // 计算图片路径
    imagePath(path) {
      console.log(path)

      return getImagesUrl(path)
    },
    // 打开新闻
    onClickNews({ id, title }) {
      this.newsInfoRequest(id, title)
      this.dialogVisible = true
    },
    onCloseNews() {
      this.dialogVisible = false
      this.newsInfo = []
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
