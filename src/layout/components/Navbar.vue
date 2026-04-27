<template>
  <div class="navbar">
    <div class="navbar-item">
      <el-menu class="el-menu-demo" :router="true" :default-active="$route.path">
        <!-- 左侧菜单组 -->
        <div class="menu-left">
          <el-menu-item index="/annals">纪年馆</el-menu-item>
          <el-menu-item index="/releases">作品馆</el-menu-item>
        </div>
        <!-- Logo -->
        <div class="navbar-logo">
          <img src="@/assets/Ava Max/logo-avamax.png" alt="logo" @click="$router.push('/home')">
        </div>
        <!-- 右侧菜单组 -->
        <div class="menu-right">
          <el-menu-item index="/news">咨询馆</el-menu-item>
          <el-menu-item index="/charts">数据馆</el-menu-item>
        </div>
      </el-menu>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NavbarView'
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
    box-shadow: 0 6px 20px rgba(64, 158, 255, 0.7);
    border-bottom: 1px solid rgba(64, 158, 255, 0.7);
  }
}

.navbar-item {
  width: 100%;
  height: 80px;
  line-height: 80px;
}

.el-menu-demo {
  width: 100%;
  height: 80px;
  line-height: 80px;
  background-color: #000;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  gap: 5%;
}

.el-menu-demo .el-menu-item {
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

.el-menu-demo .is-active {
  color: #fff;
}

.menu-left,
.menu-right {
  display: flex;
  height: 100%;
  gap: 5%;
}

.navbar-logo {
  display: flex;
  align-items: center;
  justify-content: center;
}

.navbar-logo img {
  height: 46px;
  width: auto;

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

/* 响应式 */
@media (max-width: 700px) {

  .menu-left .el-menu-item,
  .menu-right .el-menu-item {
    padding: 0 12px;
    font-size: 14px;
  }

  .navbar-logo img {
    height: 36px;
  }
}

@media (max-width: 550px) {

  .menu-left .el-menu-item,
  .menu-right .el-menu-item {
    padding: 0 8px;
    font-size: 12px;
  }
}
</style>
