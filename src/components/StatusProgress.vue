<template>
  <!-- 状态进度区：以时间线形式展示流式处理步骤 -->
  <div v-if="visible" class="status-progress">

    <!-- 流式进行中：直接展示所有步骤 -->
    <template v-if="!isDone">
      <div class="step-list">
        <div
          v-for="(step, index) in steps"
          :key="index"
          class="step-item"
          :class="{ 'step-done': step.done, 'step-active': !step.done }"
        >
          <!-- 左侧图标区 -->
          <div class="step-icon">
            <!-- 已完成：对勾图标 -->
            <el-icon v-if="step.done" class="icon-done"><CircleCheck /></el-icon>
            <!-- 进行中：旋转加载图标 -->
            <el-icon v-else class="icon-loading spin"><Loading /></el-icon>
          </div>
          <!-- 步骤文本 -->
          <div class="step-content">
            <span class="step-text">{{ step.text }}</span>
            <span class="step-time">{{ step.time }}</span>
          </div>
        </div>

        <!-- 无步骤时显示等待光标 -->
        <div v-if="steps.length === 0 && typing" class="waiting">
          <span class="typing-cursor">正在处理</span>
        </div>
      </div>
    </template>

    <!-- 结果已出：可折叠的推理步骤摘要 -->
    <template v-else>
      <div class="collapse-header" @click="collapsed = !collapsed">
        <el-icon class="icon-done summary-icon"><CircleCheck /></el-icon>
        <span class="summary-text">已完成 {{ steps.length }} 个推理步骤</span>
        <el-icon class="toggle-icon" :class="{ rotated: !collapsed }">
          <ArrowRight />
        </el-icon>
      </div>
      <!-- 展开后的步骤列表 -->
      <div v-show="!collapsed" class="step-list step-list--collapsed">
        <div
          v-for="(step, index) in steps"
          :key="index"
          class="step-item step-done"
        >
          <div class="step-icon">
            <el-icon class="icon-done"><CircleCheck /></el-icon>
          </div>
          <div class="step-content">
            <span class="step-text">{{ step.text }}</span>
            <span class="step-time">{{ step.time }}</span>
          </div>
        </div>
      </div>
    </template>

  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { CircleCheck, Loading, ArrowRight } from '@element-plus/icons-vue'

const props = defineProps({
  /** 进度步骤列表 */
  steps: {
    type: Array,
    default: () => [],
  },
  /** 是否正在打字（等待状态） */
  typing: {
    type: Boolean,
    default: false,
  },
  /** 是否有表格数据 */
  hasTable: {
    type: Boolean,
    default: false,
  },
  /** 是否有拒答文本 */
  hasFallback: {
    type: Boolean,
    default: false,
  },
})

/** 折叠状态：结果出来后默认收起 */
const collapsed = ref(true)

/**
 * 是否已完成（有最终结果且步骤不为空）
 */
const isDone = computed(() => {
  return (props.hasTable || props.hasFallback) && props.steps.length > 0
})

/**
 * 是否显示进度区域
 * 规则：有步骤或正在打字时显示
 */
const visible = computed(() => {
  return props.steps.length > 0 || props.typing
})
</script>

<style lang="scss" scoped>
.status-progress {
  padding: $spacing-xs 0;
  margin-bottom: $spacing-xs;
}

.step-list {
  display: flex;
  flex-direction: column;
  gap: 6px;

  /* 折叠展开时的缩进区 */
  &--collapsed {
    margin-top: 6px;
    padding-left: 4px;
    border-left: 2px solid rgba($progress-step-done, 0.25);
  }
}

/* 单个步骤行 */
.step-item {
  display: flex;
  align-items: flex-start;
  gap: $spacing-sm;
  padding: 4px 0;
  font-size: 12px;
  transition: opacity 0.3s;

  /* 已完成步骤变灰 */
  &.step-done {
    opacity: 0.65;
  }

  /* 进行中步骤高亮 */
  &.step-active {
    opacity: 1;

    .step-text {
      color: $progress-step-active;
      font-weight: 500;
    }
  }
}

.step-icon {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  margin-top: 1px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 已完成图标：绿色 */
.icon-done {
  color: $progress-step-done;
  font-size: 14px;
}

/* 加载图标：主题绿色 + 旋转动画 */
.icon-loading {
  color: $progress-step-active;
  font-size: 13px;
}

.step-content {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  flex: 1;
}

.step-text {
  color: $text-secondary;
  flex: 1;
}

.step-time {
  color: $text-timestamp;
  font-size: 10px;
  flex-shrink: 0;
}

/* 等待中的打字光标提示 */
.waiting {
  padding: 4px 0;
  font-size: 13px;
  color: $text-secondary;
}

/* 折叠摘要行 */
.collapse-header {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  cursor: pointer;
  padding: 4px 2px;
  border-radius: 4px;
  font-size: 12px;
  color: $text-secondary;
  user-select: none;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba($progress-step-done, 0.08);
  }
}

.summary-icon {
  font-size: 14px;
  flex-shrink: 0;
}

.summary-text {
  flex: 1;
}

/* 展开/收起箭头图标 */
.toggle-icon {
  font-size: 12px;
  color: $text-timestamp;
  transition: transform 0.25s ease;

  &.rotated {
    transform: rotate(90deg);
  }
}
</style>
