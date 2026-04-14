<template>
  <div class="news-all">
    <haedRow :head-info="headInfo" />
    <mainContent
      :news-list="newsList"
      :head-info="headInfo"
      @open="onClickNews"
    />
    <!-- 新闻弹窗 -->
    <el-dialog
      :title="newsInfo.title"
      :visible.sync="dialogVisible"
      :modal="true"
      :modal-append-to-body="false"
      :before-close="onCloseNews"
      width="30%"
    >
      <div class="el-dialog__news-wrapper">
        <span v-if="newsInfo.content" class="__news-content">{{ newsInfo.content }}</span>
        <div class="__news-photo-wrapper">
          <!-- 轮播图 -->
          <template>
            <div class="block">
              <!-- <span class="demonstration">Click 指示器触发</span> -->
              <el-carousel trigger="click">
                <el-carousel-item
                  v-for="(item) in newsInfo.assets"
                  :key="item.id"
                >
                  <!-- <h3 class="small">{{ item.id }}</h3> -->
                  <img :src="imagePath(item)" alt="">
                  <!-- <img :src="imagePath(item.path)" alt=""> -->
                </el-carousel-item>
              </el-carousel>
            </div>
          </template>
          <!-- <div v-for="item in newsInfo.assets" :key="item.id" class="__news-photo">1</div> -->
        </div>
      </div>
      <!-- <span>{{ newsInfo.content }}</span> -->
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="dialogVisible = false"
        >确 定</el-button>
      </span> -->
    </el-dialog>
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

<style lang="scss" scoped>
::v-deep .el-dialog {
  width: 60% !important;
  height: 70%;
  border-radius: 20px;
  margin-top: 0 !important;
  top: 53%;
  transform: translateY(-50%);

  background: linear-gradient(#ffffff00, transparent);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 25px 25px rgba(0, 0, 0, 0.25);

  display: flex;
  flex-direction: column;

  .el-dialog__body {
    flex-grow: 1;
  }

  .el-button {
    border: 1px solid transparent;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 12px 25px rgba(64, 158, 255, 0.3);
      transform: scale(1.05);
    }
    &:active {
      background: #409eff !important;
      border-color: #409eff !important;
      color: #fff;
      transform: translateY(-5px);
      transform: scale(0.95) !important;
      transition: all 0.1s;
    }
    &--default {
      background: #fff;
      color: #000;
    }
    &--primary {
      background: linear-gradient(#fff1, transparent);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 25px 25px rgba(0, 0, 0, 0.25);
      color: #fff;
      border-color: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
    }
  }

  .el-dialog__title,
  .el-dialog__close {
    color: #fff;

    text-shadow: 1px 2px 2px #000;
  }
}

::v-deep .el-dialog__news-wrapper {
  width: 100%;
  height: 100%;
  // background-color: beige;
  display: flex;
  flex-direction: row;
  gap: 5%;
  overflow: hidden;
  .__news-content {
    width: 40%;
    display: inline-block;
    color: #fff;
    text-shadow: 1px 2px 2px #000;
    font-size: 14px;
    word-break: break-all;
    white-space: pre-line;
    overflow: hidden;
    overflow-y: auto;
  }
  .__news-photo-wrapper {
    // width: 40%;
    // max-height: 50%;
    flex-grow: 1;
    color: #fff;
    // background-color: #409eff;
    display: grid;
  }
}

// ::v-deep .el-carousel__item h3 {
//   color: #475669;
//   font-size: 14px;
//   opacity: 0.75;
//   line-height: 150px;
//   margin: 0;
// }

// .el-carousel__item:nth-child(2n) {
//   background-color: #99a9bf;
// }

// .el-carousel__item:nth-child(2n + 1) {
//   background-color: #d3dce6;
// }

::v-deep .el-carousel {
  height: 100%;
}
::v-deep .el-carousel__container {
  height: 100%;
  .el-carousel__item {
    display: flex;
    justify-content: center;
    img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      // width: auto;
      // height: auto;
    }
  }
}
</style>
