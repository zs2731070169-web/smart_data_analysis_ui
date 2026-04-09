<template>
  <!-- 欢迎页：无历史消息时显示 -->
  <div class="welcome-screen">
    <div class="welcome-content">
      <!-- 顶部图标 -->
      <div class="welcome-icon">
        <el-icon :size="56"><DataAnalysis /></el-icon>
      </div>

      <h2 class="welcome-title">智能数据分析助手</h2>
      <p class="welcome-desc">
        提问后等待 AI 自动生成查询结果
      </p>

      <!-- 示例问题列表 -->
      <div class="example-section">
        <p class="example-label">试试这些问题：</p>
        <div class="example-list">
          <button
            v-for="(example, index) in examples"
            :key="index"
            class="example-item"
            @click="emit('select', example)"
          >
            <el-icon class="example-icon"><ChatLineRound /></el-icon>
            <span>{{ example }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { DataAnalysis, ChatLineRound } from '@element-plus/icons-vue'

/** 点击示例问题时，向父组件传递选中文本 */
const emit = defineEmits(['select'])

/** 示例问题列表 */
const examples = [
  '查询今年年初至今的总销售额和购买客户数',
  '对比不同会员等级的购买频次和日均订单数',
  '统计男女客户在各品类的销售额分布',
  '统计近6个月华东地区各月的销售额和订单数',
]
</script>

<style lang="scss" scoped>
.welcome-screen {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $spacing-xl;
  overflow-y: auto;
}

.welcome-content {
  text-align: center;
  max-width: 480px;
  width: 100%;
}

.welcome-icon {
  color: $primary-light;
  margin-bottom: $spacing-md;
  opacity: 0.85;
}

.welcome-title {
  font-size: 22px;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: $spacing-sm;
}

.welcome-desc {
  font-size: 14px;
  color: $text-secondary;
  margin-bottom: $spacing-xl;
}

.example-section {
  text-align: left;
}

.example-label {
  font-size: 12px;
  color: $text-secondary;
  margin-bottom: $spacing-sm;
  text-align: center;
}

.example-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
}

.example-item {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  padding: 12px $spacing-md;
  background-color: #fff;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: $radius-card;
  cursor: pointer;
  text-align: left;
  font-size: 14px;
  color: $text-primary;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba($primary-light, 0.06);
    border-color: rgba($primary-light, 0.3);
    transform: translateY(-1px);
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
  }
}

.example-icon {
  color: $primary-light;
  flex-shrink: 0;
}

/* 响应式：移动端减小内边距 */
@media (max-width: #{$breakpoint-mobile}) {
  .welcome-screen {
    padding: $spacing-md;
  }

  .welcome-title {
    font-size: 18px;
  }
}
</style>
