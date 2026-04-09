<template>
  <!-- 助手回复卡片（左对齐，白色卡片 + 阴影） -->
  <div class="assistant-card-wrap fade-in-up">
    <!-- 卡片主体 -->
    <div class="card">
      <!-- 状态进度区（流式进度步骤） -->
      <StatusProgress
        :steps="message.progressSteps"
        :typing="message.typing"
        :has-table="!!message.tableData"
        :has-fallback="!!message.fallbackText"
      />

      <!-- 查询结果表格 -->
      <DataTable
        v-if="message.tableData"
        :data="message.tableData"
        :columns="message.tableColumns"
      />

      <!-- 拒答文本 -->
      <FallbackText
        v-if="message.fallbackText"
        :text="message.fallbackText"
      />

      <!-- 连接中断错误提示 -->
      <div v-if="message.errorText" class="error-tip">
        <el-icon><WarnTriangleFilled /></el-icon>
        <span>{{ message.errorText }}</span>
      </div>

      <!-- 消息完成时间戳 -->
      <div v-if="message.timestamp" class="card-footer">
        <span class="timestamp">{{ message.timestamp }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Cpu, WarnTriangleFilled } from '@element-plus/icons-vue'
import StatusProgress from './StatusProgress.vue'
import DataTable from './DataTable.vue'
import FallbackText from './FallbackText.vue'

defineProps({
  /** 助手消息对象 */
  message: {
    type: Object,
    required: true,
  },
})
</script>

<style lang="scss" scoped>
/* 左对齐行容器 */
.assistant-card-wrap {
  display: flex;
  align-items: flex-start;
  gap: $spacing-sm;
  padding: $spacing-xs $spacing-md;
}

/* AI 头像圆形图标 */
.avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background-color: $primary-color;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* 卡片主体 */
.card {
  flex: 1;
  max-width: calc(100% - 42px);
  background-color: $assistant-card-bg;
  border-radius: 2px $radius-card $radius-card $radius-card;
  padding: $spacing-sm $spacing-md;
  box-shadow: $assistant-card-shadow;
  min-width: 0;
}

/* 错误提示行 */
.error-tip {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  font-size: 12px;
  color: #F56C6C;
  margin-top: $spacing-xs;

  .el-icon {
    font-size: 14px;
  }
}

/* 底部时间戳 */
.card-footer {
  margin-top: $spacing-xs;
  text-align: right;
}

.timestamp {
  font-size: 11px;
  color: $text-timestamp;
}

/* 响应式 */
@media (max-width: #{$breakpoint-mobile}) {
  .card {
    padding: $spacing-sm;
  }
}
</style>
