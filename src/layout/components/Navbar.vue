<template>
  <div class="navbar">
    <div class="navbar-item">
      <el-menu
        class="el-menu-demo"
        mode="horizontal"
        :router="true"
        :default-active="$route.path"
      >
        <el-menu-item index="/annals">纪年馆</el-menu-item>
        <el-menu-item index="/releases">作品馆</el-menu-item>
        <span class="el-menu-space" />
        <el-menu-item index="/news">咨询馆</el-menu-item>
        <el-menu-item index="/charts">数据馆</el-menu-item>
      </el-menu>
    </div>
    <div class="navbar-logo navbar-item">
      <img
        src="@/assets/Ava Max/logo-avamax.png"
        alt="logo"
        @click="$router.push('/home')"
      >
    </div>
  </div>
</template>

<script>
// import { Breadcrumb } from '@/components/Breadcrumb'
export default {
  name: 'NavbarView',
  components: {},
  data() {
    return {
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  width: 100%;
  height: 80px;
  background: #000;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  transition: all 0.3s ease-in-out !important;
  box-shadow: 0 0 0 rgba(64, 158, 255, 0);
  border-bottom: 1px solid rgba(64, 158, 255, 1);

  &:hover {
    /* 结束状态：阴影偏移和颜色深度增加 */
    box-shadow: 0 6px 20px rgba(64, 158, 255, 0.7);
    border-bottom: 1px solid rgba(64, 158, 255, 0.7);
  }

  &-item {
    width: 46%;
    height: 80px;
    line-height: 80px;
  }

  .el-menu {
    &-demo {
      width: 100%;
      height: 80px;
      line-height: 80px;
      background-color: #000;
      border: none;
      display: flex;
    }

    &-item {
      height: 80px;
      line-height: 80px;
      color: #fff;
      &:hover {
        border-bottom: none;
      }
      &:not(.is-disabled):hover {
        color: #000;
      }
    }
    .is-active {
      color: #fff;
    }

    &-space {
      flex-grow: 1;
    }
  }

  &-logo {
    width: auto;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      height: 46px;
      width: auto;
      // background-color: #000;
      &:hover {
        cursor: pointer;
        opacity: 0.8;
        transition: all 0.3s ease-in-out;
      }
      &:not(:hover) {
        cursor: pointer;
        opacity: 1;
        transition: all 0.3s ease-in-out;
      }
    }
  }

}
</style>
