<template>
  <div class="main-content">
    <div v-if="newsList.length > 0" class="insta-grid">
      <div
        v-for="item in sortedNews"
        :key="item.id"
        class="grid-item glassy-background jumpy-transition"
        :class="item.layoutClass"
      >
        <div class="card-inner">
          <div class="cover-wrapper">
            <img :src="imagePath(item.cover)" class="main-img">
            <div v-if="item.type === 'video'" class="video-tag">
              <i class="el-icon-caret-right" />
            </div>
            <div
              class="hover-overlay"
              @click="onClickNews({id: item.id, title: item.title})"
            >
              <div class="stats">
                <span><i class="el-icon-view" /> {{ item.views }}</span>
                <span><i class="el-icon-chat-dot-round" /> {{ item.comments }}</span>
              </div>
            </div>
          </div>

          <div class="content-box glassy-background" :class="{ 'cb-today': headInfo.status === 'TODAY' } ">
            <h3>{{ item.title }}</h3>
            <span class="date">{{ item.date }}</span>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="no-news">暂无内容</div>
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
              <el-carousel trigger="click">
                <el-carousel-item
                  v-for="(item) in newsInfo.assets"
                  :key="item.id"
                >
                  <img :src="imagePath(item)" alt="">
                </el-carousel-item>
              </el-carousel>
            </div>
          </template>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getImagesUrl } from '@/utils/getImageUrl'
import { getNewsInfo } from '@/api/news'
export default {
  name: 'MainContent',
  props: {
    newsList: {
      type: Array,
      default: () => []
    },
    headInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      dialogVisible: false, // 弹窗状态
      newsInfo: []
    }
  },
  computed: {
    sortedNews() {
      // 保持时间排序，同时动态计算随机布局类名
      return [...this.newsList]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .map((item) => {
          const rand = Math.random()
          let layoutClass = 'item-1x1' // 默认 1*1
          if (rand > 0.8) layoutClass = 'item-2x1' // 横向 2*1
          else if (rand > 0.6) layoutClass = 'item-1x2' // 纵向 1*2

          return { ...item, layoutClass }
        })
    }
  },
  methods: {
    // 切换则边栏布局
    toggleSidebar() {
      this.sidebarExpanded = !this.sidebarExpanded
    },
    // 计算图片路径
    imagePath(path) {
      return getImagesUrl(path)
    },
    // 获取新闻详情
    async newsInfoRequest(id, title) {
      const res = (await getNewsInfo(id)).data
      res.title = title
      this.newsInfo = res
      // console.log(this.newsInfo)
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
.main-content {
  // width: 100%;
  overflow-y: auto;
  height: 100%;
  // padding: 20px;
  position: relative;
}

.insta-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  grid-auto-rows: 140px;
  grid-auto-flow: dense;
  gap: 20px;
}

.grid-item {
  overflow: hidden;
  position: relative;

  &:hover {
    transform: scale(1.05) !important;
  }
  &:active {
    transform: scale(0.98) !important;
    // transition: all 0.2s;
  }

  /* 修改：支持随机尺寸类名 */
  &.item-1x1 {
    grid-row: span 2;
    grid-column: span 1;
  } /* 基础大小 */
  &.item-1x2 {
    grid-row: span 3;
    grid-column: span 1;
  } /* 纵向拉伸 */
  &.item-2x1 {
    grid-row: span 2;
    grid-column: span 2;
  } /* 横向拉伸 */

  .card-inner {
    position: relative;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }

  .cover-wrapper {
    position: absolute;
    inset: 0;
    z-index: 0;
    background: #121212;

    .main-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }

    .video-tag {
      position: absolute;
      top: 12px;
      right: 12px;
      background: rgba(0, 0, 0, 0.5);
      width: 30px;
      height: 30px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      backdrop-filter: blur(4px);
    }

    .hover-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s;
      color: #fff;
      .stats {
        display: flex;
        gap: 15px;
        font-weight: bold;
      }
    }
  }

  .content-box {
    position: relative; // 确保在背景图之上显示
    z-index: 1;
    padding: 15px;
    border: none;
    border-top: #409eff solid 2px;
    h3 {
      font-size: 14px;
      font-weight: 700;
      color: #fff;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
      background-color: #409eff;
    }
    .date {
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 2px;
      color: #000;
      background-color: #fff;
    }
  }

  .cb-today {
    border-top: #ff4d4f solid 2px !important;
    h3 {
      background-color: #ff4d4f !important;
    }
  }
}

.no-news {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 42px;
  font-weight: bold;
  letter-spacing: 20px;
  color: #fff;
  text-shadow: 0 0 10px #fff;
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
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
