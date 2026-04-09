<template>
  <!-- 消息列表滚动容器 -->
  <div ref="scrollContainer" class="chat-messages">
    <!-- 欢迎页：无消息时显示 -->
    <WelcomeScreen
      v-if="!chatStore.hasMessages"
      @select="emit('selectExample', $event)"
    />

    <!-- 消息列表 -->
    <div v-else class="messages-list">
      <MessageItem
        v-for="msg in chatStore.messages"
        :key="msg.id"
        :message="msg"
      />
      <!-- 滚动锚点：自动滚动到此处 -->
      <div ref="bottomAnchor" class="bottom-anchor" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { useChatStore } from '@/stores/index.js'
import MessageItem from './MessageItem.vue'
import WelcomeScreen from './WelcomeScreen.vue'

/** 向父组件传递欢迎页示例选中事件 */
const emit = defineEmits(['selectExample'])

const chatStore = useChatStore()

/** 滚动容器 ref */
const scrollContainer = ref(null)
/** 底部锚点 ref */
const bottomAnchor = ref(null)

/**
 * 滚动到底部
 * 使用 nextTick 确保 DOM 更新后再滚动
 */
async function scrollToBottom() {
  await nextTick()
  if (bottomAnchor.value) {
    bottomAnchor.value.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }
}

/**
 * 监听消息列表变化：新消息到达时自动滚动到底部
 * deep: true 监听数组内部对象属性变化（流式更新进度步骤等）
 */
watch(
  () => chatStore.messages,
  () => scrollToBottom(),
  { deep: true }
)
</script>

<style lang="scss" scoped>
/* 消息区域：撑满剩余高度，独立滚动 */
.chat-messages {
  flex: 1;
  overflow-y: auto;
  background-color: $chat-bg;
  display: flex;
  flex-direction: column;

  /* 背景纹理（模拟 WhatsApp 聊天背景） */
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c5b998' fill-opacity='0.12'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

/* 消息列表 */
.messages-list {
  display: flex;
  flex-direction: column;
  padding: $spacing-md 0;
  gap: $spacing-xs;
  min-height: 100%;
}

/* 底部滚动锚点（不可见） */
.bottom-anchor {
  height: 1px;
  flex-shrink: 0;
}
</style>
