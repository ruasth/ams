<template>
  <div class="playList-page">
    <bg-box />

    <h1>On Tour (Finaly) 巡演歌单</h1>
    <div class="table-wrapper glassy-background">
      <el-table :data="playList" height="100%" class="custom-table">
        <el-table-column prop="id" label="序号" width="70" align="center" />

        <el-table-column prop="title" label="曲目" width="250" align="center" />

        <el-table-column prop="id" label="能否播放" width="120" align="center" />

        <el-table-column label="音乐平台链接" width="200" align="center">
          <template slot-scope="scope">
            <div class="link-group">
              <div class="link-button am" />
              <div class="link-button sp" />
              <div class="link-button qq" />
              <div class="link-button kg" />
              <div class="link-button en" />
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import bgBox from '../../components/bg-box.vue'
import { getPlayList } from '../../api/playList'

export default {
  components: { bgBox },
  data() {
    return {
      playList: []
    }
  },
  created() {
    this.getPlayList()
  },
  methods: {
    async getPlayList() {
      try {
        const res = await getPlayList()
        // 假设返回结构为 res.data.playList
        this.playList = res?.data?.playList || []
      } catch (error) {
        console.error('获取歌单失败', error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.playList-page {
  margin-top: 80px;
  width: 100%;
  height: calc(100vh - 80px);
  background-color: #000;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 20px;
  h1 {
    color: #fff;
    font-size: 36px;
    font-weight: 600;
  }
}

.table-wrapper {
  width: auto;
  height: 65vh;
  border-radius: 20px;
  padding: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  // backdrop-filter: blur(10px);
  // background: rgba(255, 255, 255, 0.1);
  // border: 1px solid rgba(255, 255, 255, 0.2);
  // box-sizing: border-box;
}

::v-deep .custom-table {
  flex: none !important;
  width: auto !important;
  max-width: 100%;
  background-color: transparent !important;

  &::before {
    display: none;
  }

  tr, th, td {
    background: transparent !important;
    color: #fff;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .el-table__row:hover > td {
    background: rgba(255, 255, 255, 0.05) !important;
  }

  .el-table__body-wrapper::-webkit-scrollbar {
    width: 6px;
  }
  .el-table__body-wrapper::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 10px;
  }
}

.link-group {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.link-button {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.2);
  }
}

.am { background-color: #ff4500; }
.sp { background-color: #1e90ff; }
.qq { background-color: #32cd32; }
.kg { background-color: #ffd700; }
.en { background-color: #ff69b4; }
</style>
