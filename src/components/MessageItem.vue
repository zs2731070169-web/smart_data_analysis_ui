<template>
  <!-- 单条消息容器：根据 role 渲染不同组件 -->
  <div class="message-item">
    <!-- 用户消息 -->
    <UserBubble v-if="message.role === 'user'" :message="message" />
    <!-- 助手消息 -->
    <AssistantCard v-else-if="message.role === 'assistant'" :message="message" />
  </div>
</template>

<script setup>
import UserBubble from './UserBubble.vue'
import AssistantCard from './AssistantCard.vue'

defineProps({
  /** 消息对象，包含 role 字段 */
  message: {
    type: Object,
    required: true,
  },
})
</script>

<style lang="scss" scoped>
.message-item {
  width: 100%;
}
</style>
