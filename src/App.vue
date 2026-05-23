<template>
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<script setup>
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 全局样式 */
.page-container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

/* 自定义 Vant 主题色 */
:root {
  --van-primary-color: #07c160;
  --van-success-color: #07c160;
  --van-danger-color: #ee0a24;
  --van-warning-color: #ff976a;
}
</style>
