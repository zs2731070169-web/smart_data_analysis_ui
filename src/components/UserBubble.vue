<template>
  <!-- 用户消息气泡（右对齐，绿色背景） -->
  <div class="user-bubble-wrap">
    <div class="bubble" :class="{ 'fade-in-up': true }">
      <!-- 消息正文 -->
      <p class="content">{{ message.content }}</p>
      <!-- 时间戳 -->
      <span class="timestamp">{{ message.timestamp }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  /** 用户消息对象 */
  message: {
    type: Object,
    required: true,
  },
})
</script>

<style lang="scss" scoped>
/* 右对齐容器 */
.user-bubble-wrap {
  display: flex;
  justify-content: flex-end;
  padding: $spacing-xs $spacing-md;
}

/* 气泡主体 */
.bubble {
  max-width: 70%;
  background-color: $user-bubble-bg;
  color: $user-bubble-text;
  padding: 8px 12px;
  border-radius: $radius-bubble $radius-bubble 2px $radius-bubble;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.13);
  position: relative;
  word-break: break-word;
}

.content {
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-wrap; /* 保留换行 */
  margin-bottom: 4px;
}

.timestamp {
  font-size: 11px;
  color: $text-timestamp;
  display: block;
  text-align: right;
  margin-top: 2px;
}

/* 响应式：移动端气泡宽度放大 */
@media (max-width: #{$breakpoint-mobile}) {
  .bubble {
    max-width: 85%;
  }
}
</style>
