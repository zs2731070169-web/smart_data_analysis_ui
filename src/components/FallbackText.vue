<template>
  <!-- 拒答/错误文本展示区域 -->
  <div class="fallback-wrap" v-if="text">
    <el-icon class="fallback-icon"><Warning /></el-icon>
    <div class="fallback-text">{{ text }}</div>
  </div>
</template>

<script setup>
import { Warning } from '@element-plus/icons-vue'

defineProps({
  /** 拒答或错误提示文本 */
  text: {
    type: String,
    default: '',
  },
})
</script>

<style lang="scss" scoped>
.fallback-wrap {
  display: flex;
  align-items: flex-start;
  gap: $spacing-sm;
  padding: $spacing-sm $spacing-md;
  background-color: $fallback-bg;
  border-radius: $radius-card;
  border-left: 3px solid #E6A23C;
  margin-top: $spacing-xs;
}

.fallback-icon {
  color: #E6A23C;
  font-size: 16px;
  flex-shrink: 0;
  margin-top: 1px;
}

.fallback-text {
  font-size: 13px;
  color: $fallback-text-color;
  line-height: 1.6;
  word-break: break-word;
  white-space: pre-wrap;
}
</style>
