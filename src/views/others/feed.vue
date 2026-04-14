<template>
  <div class="feed-page">
    <bg-box />
    <button class="feed_button normal-btn_foggy" @click="dialogVisible = true">
      1
    </button>
    <el-dialog title="意见反馈表" :visible.sync="dialogVisible" :modal="false" width="30%">
      <!-- 内容容器 -->
      <div class="dialog-content-container">
        <!-- 按钮区域 -->
        <div class="add-button-wrapper">
          <el-button @click="addNewFeed()">添 加</el-button>
        </div>
        <!-- 表格容器 -->
        <div class="table-wrapper">
          <el-table :data="feedList" height="100%">
            <!-- 序号 -->
            <el-table-column label="序号" min-width="5%">
              <template slot-scope="{ $index }">
                <span>{{ $index + 1 }}</span>
              </template>
            </el-table-column>
            <!-- 访客名 -->
            <el-table-column label="访客名" min-width="40%">
              <template slot-scope="{ row }">
                <el-input v-model="row.name" placeholder="请输入内容" />
              </template>
            </el-table-column>
            <!-- 反馈内容 -->
            <el-table-column label="反馈内容" min-width="40%">
              <template slot-scope="{ row }">
                <el-input v-model="row.content" placeholder="请输入内容" />
              </template>
            </el-table-column>
            <!-- 操作按钮 -->
            <el-table-column min-width="10%" label="操作">
              <template slot-scope="{ $index, row }">
                <el-button
                  type="text"
                  size="small"
                  :disabled="feedList.length === 1 && (!row.name && !row.content)"
                  @click="remobveRow($index)"
                >{{ feedList.length === 1 ? '清除' : '移除' }}</el-button>
                <el-button
                  type="text"
                  size="small"
                  :disabled="row.sub || !row.name || !row.content"
                  @click="subRow($index)"
                >{{ row.sub ? '已提交' : '提交' }}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import bgBox from '../../components/bg-box.vue'
export default {
  components: { bgBox },
  data() {
    return {
      dialogVisible: false,
      feedList: [{ name: '', content: '', sub: false }]
    }
  },
  computed: {
  },
  methods: {
    addNewFeed() {
      this.feedList.push({ name: '', content: '', sub: false })
    },
    subRow(index) {
      const currentRow = this.feedList[index]
      if (!currentRow.name || !currentRow.content) {
        this.$message.error({ message: '请填写完整信息', duration: 3000 })
        return
      }
      this.feedList[index].sub = true
      this.$message.success({ message: '反馈提交成功', duration: 3000 })
    },
    remobveRow(index) {
      if (this.feedList.length === 1) {
        this.$nextTick(() => {
          this.feedList[index].name = ''
          this.feedList[index].content = ''
          this.feedList[index].sub = false
        })
      } else {
        this.feedList.splice(index, 1)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.feed-page {
  margin-top: 80px;
  width: 100%;
  height: calc(100vh - 80px);
  background-color: #000;
  position: relative;

  .feed_button {
    width: 100px;
    height: 100px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(1);
    &:active {
      transform: translate(-50%, -50%) scale(0.95) !important;
    }
  }
}

.search-box input {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid #a4a4a4;
  color: #fff;
  padding: 8px 15px;
  border-radius: 5px;
  outline: none;
  transition: 0.3s;
  &:focus {
    border-color: var(--accent-cyan);
    box-shadow: var(--shadow-blue);
  }
}
</style>

<style lang="scss" scoped>
::v-deep .el-dialog__body {
  padding: 0;
  overflow: hidden;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.dialog-content-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 20px 20px 0 20px;
  box-sizing: border-box;
}

.add-button-wrapper {
  flex-shrink: 0;
  text-align: right;
  margin-bottom: 16px;
}

.table-wrapper {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}
.el-table {
  background-color: #ffffff00 !important;
}
::v-deep .el-table th,
::v-deep .el-table tr {
  background-color: transparent !important;
}
::v-deep .el-table thead {
    color: #fff !important;
}
::v-deep .el-table__row {
  background-color: transparent !important;
}
::v-deep .el-table--enable-row-hover .el-table__body tr:hover>td {
    background-color: #40a0ff !important;
}
::v-deep .el-table--enable-row-hover .el-table__body tr:hover .el-button {
    color: #fff !important;
}
::v-deep .el-table--enable-row-hover .el-table__body tr:hover input::placeholder {
    color: #fff !important;
}

::v-deep .el-table__header-wrapper {
  display: flex;
  justify-content: center;
}

::v-deep .el-table__body-wrapper {
  overflow-y: auto !important;
  display: flex;
    height: 449px;
    align-items: flex-start;
    justify-content: center;
}

::v-deep .el-table__body-wrapper::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::v-deep .el-table__body-wrapper::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.3);
  border-radius: 3px;
}
::v-deep .el-table__body-wrapper::-webkit-scrollbar-track {
  background: rgba(0,0,0,0.2);
}

::v-deep .el-input__inner {
  background-color: #ffffff00;
  color: #fff;
}
::v-deep .el-input__inner:focus {
    border-color: #fff !important;
    outline: 0;
}

::v-deep .el-dialog {
  width: 60% !important;
  height: 70%;
  margin-top: 0 !important;
  border-radius: 20px;
  top: 53%;
  transform: translateY(-50%);
  background: linear-gradient(#fff1, transparent);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 25px 25px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;

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
    }
  }

  .el-dialog__title,
  .el-dialog__close {
    color: #fff;
  }
}

::v-deep .el-dialog__news-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 10%;
  .__news-content {
    max-height: 40%;
    display: inline-block;
    color: #000;
    font-size: 14px;
    word-break: break-all;
    overflow: hidden;
  }
  .__news-photo-wrapper {
    min-height: 50%;
    flex-grow: 1;
    color: #fff;
    background-color: #409eff;
    display: grid;
  }
}

::v-deep .addButtonLine {
  display: flex;
  justify-content: flex-end;
}
</style>
