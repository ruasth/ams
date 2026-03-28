<template>
  <div class="head-row">
    <div class="section-header">
      <h1>{{ headInfo.title }}</h1>
      <div class="status-dot" :class="{ 'sd-today': headInfo.status === 'TODAY' }">{{ headInfo.status }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HeadRow',
  props: {
    headInfo: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style lang="scss" scoped>
.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 30px;
  h1 {
    font-size: 35px;
    font-weight: 700;
    color: var(--text-main);
    text-shadow: var(--shadow-blue);
  }
  .status-dot {
    background: #409eff;
    color: #fff;
    font-size: 10px;
    padding: 2px 8px;
    border-radius: 10px;
    text-transform: uppercase;
  }
}

.sd-today {
    background: #ff4d4f !important;
    animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}
</style>
