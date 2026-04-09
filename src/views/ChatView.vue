<template>
  <!-- 主视图：整体布局（header + messages + input） -->
  <div class="chat-view">
    <!-- 顶部导航栏 -->
    <ChatHeader />

    <!-- 聊天内容区（含欢迎页和消息列表） -->
    <ChatMessages @select-example="handleSelectExample" />

    <!-- 底部输入栏 -->
    <ChatInput />
  </div>
</template>

<script setup>
import ChatHeader from '@/components/ChatHeader.vue'
import ChatMessages from '@/components/ChatMessages.vue'
import ChatInput from '@/components/ChatInput.vue'
import { useChatStore } from '@/stores/index.js'

const chatStore = useChatStore()

/**
 * 处理欢迎页示例问题点击
 * 直接调用 store 发送消息
 * @param {string} text - 示例问题文本
 */
function handleSelectExample(text) {
  chatStore.sendMessage(text)
}
</script>

<style lang="scss" scoped>
/* 整体布局：垂直 flex，撑满视口高度 */
.chat-view {
  display: flex;
  flex-direction: column;
  height: 100vh;
  height: 100dvh; /* 移动端动态视口高度，避免地址栏遮挡 */
  max-width: 900px;
  margin: 0 auto;
  background-color: #fff;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);

  /* 移动端全屏，无阴影 */
  @media (max-width: #{$breakpoint-mobile}) {
    max-width: 100%;
    box-shadow: none;
  }
}
</style>
