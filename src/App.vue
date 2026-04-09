<template>
  <!-- 应用根组件，直接渲染主聊天视图 -->
  <ChatView />
</template>

<script setup>
import ChatView from './views/ChatView.vue'
</script>

<style lang="scss">
/* 全局基础样式：确保整个应用撑满视口 */
html,
body,
#app {
  height: 100%;
  width: 100%;
  overflow: hidden;
}
</style>
