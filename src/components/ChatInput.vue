<template>
  <!-- 底部输入栏 -->
  <div class="chat-input-bar">
    <div class="input-inner">
      <!-- 左侧：清空按钮 -->
      <el-tooltip content="清空对话" placement="top" :disabled="chatStore.isStreaming">
        <el-button
          :icon="Delete"
          circle
          size="small"
          class="action-btn clear-btn"
          :disabled="!chatStore.hasMessages || chatStore.isStreaming"
          @click="handleClear"
        />
      </el-tooltip>

      <!-- 中间：多行文本输入框 -->
      <div ref="inputWrapRef" class="input-wrap">
        <el-input
          ref="inputRef"
          v-model="inputText"
          type="textarea"
          :autosize="{ minRows: 1, maxRows: 4 }"
          :placeholder="chatStore.isStreaming ? 'AI 正在回复中...' : '输入问题，Enter 发送，Shift+Enter 换行'"
          :disabled="chatStore.isStreaming"
          resize="none"
          class="chat-textarea"
          @keydown.enter.exact.prevent="handleSend"
          @keydown.shift.enter.exact="handleNewline"
        />
      </div>

      <!-- 右侧：发送/停止按钮 -->
      <el-tooltip :content="chatStore.isStreaming ? '停止响应' : '发送'" placement="top">
        <el-button
          :icon="chatStore.isStreaming ? VideoPause : Promotion"
          circle
          class="action-btn send-btn"
          :class="{ 'btn-stop': chatStore.isStreaming, 'btn-send': !chatStore.isStreaming }"
          @click="handleSendOrStop"
        />
      </el-tooltip>
    </div>

    <!-- 底部提示文字 -->
    <p class="input-hint">由 AI 生成，仅供参考</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Delete, Promotion, VideoPause } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'
import { useChatStore } from '@/stores/index.js'

const chatStore = useChatStore()

/** 输入框文本内容 */
const inputText = ref('')
/** 输入框外层容器 ref（用于 shake 动画） */
const inputWrapRef = ref(null)

/**
 * 发送消息
 * 输入为空时触发 shake 动画提示
 */
function handleSend() {
  const text = inputText.value.trim()
  if (!text) {
    // 输入为空：触发抖动动画
    inputWrapRef.value?.classList.add('shake')
    setTimeout(() => inputWrapRef.value?.classList.remove('shake'), 600)
    return
  }
  chatStore.sendMessage(text)
  inputText.value = ''
}

/**
 * Shift+Enter：在输入框中插入换行（默认行为，无需额外处理）
 */
function handleNewline() {
  // 允许默认的换行行为
}

/**
 * 发送/停止按钮点击处理
 * 流式中点击：停止响应
 * 空闲时点击：发送消息
 */
function handleSendOrStop() {
  if (chatStore.isStreaming) {
    chatStore.stopStreaming()
  } else {
    handleSend()
  }
}

/**
 * 清空对话（二次确认）
 */
async function handleClear() {
  if (!chatStore.hasMessages) return
  try {
    await ElMessageBox.confirm('确认清空所有对话记录？', '提示', {
      confirmButtonText: '确认清空',
      cancelButtonText: '取消',
      type: 'warning',
    })
    chatStore.clearMessages()
  } catch {
    // 取消操作
  }
}
</script>

<style lang="scss" scoped>
/* 输入栏外容器 */
.chat-input-bar {
  background-color: $input-bar-bg;
  padding: $spacing-sm $spacing-md $spacing-xs;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

/* 输入行：左按钮 + 输入框 + 右按钮 */
.input-inner {
  display: flex;
  align-items: flex-end;
  gap: $spacing-sm;
}

/* 输入框容器（占据剩余空间） */
.input-wrap {
  flex: 1;
  min-width: 0;
}

/* 覆盖 Element Plus textarea 样式 */
.chat-textarea {
  :deep(.el-textarea__inner) {
    border-radius: $radius-input;
    border: 1px solid rgba(0, 0, 0, 0.12);
    background-color: #fff;
    padding: 8px 14px;
    font-size: 14px;
    line-height: 1.5;
    resize: none;
    box-shadow: none;
    transition: border-color 0.2s;

    &:focus {
      border-color: $primary-light;
      box-shadow: 0 0 0 2px rgba($primary-light, 0.15);
    }

    &:disabled {
      background-color: #fafafa;
      color: $text-secondary;
    }
  }
}

/* 左侧操作按钮（清空） */
.action-btn {
  flex-shrink: 0;
  margin-bottom: 2px;
}

.clear-btn {
  color: $text-secondary;
  border-color: rgba(0, 0, 0, 0.15);

  &:hover:not(:disabled) {
    color: #F56C6C;
    border-color: #F56C6C;
  }
}

/* 发送按钮（绿色） */
.btn-send {
  background-color: $primary-light !important;
  border-color: $primary-light !important;
  color: #fff !important;

  &:hover {
    background-color: $primary-color !important;
    border-color: $primary-color !important;
  }
}

/* 停止按钮（红色） */
.btn-stop {
  background-color: #F56C6C !important;
  border-color: #F56C6C !important;
  color: #fff !important;

  &:hover {
    background-color: #f33 !important;
    border-color: #f33 !important;
  }
}

/* 底部提示文字 */
.input-hint {
  font-size: 11px;
  color: $text-secondary;
  text-align: center;
  margin-top: 4px;
  opacity: 0.7;
}

/* 响应式：移动端减小内边距 */
@media (max-width: #{$breakpoint-mobile}) {
  .chat-input-bar {
    padding: $spacing-xs $spacing-sm $spacing-xs;
  }

  .input-hint {
    display: none;
  }
}
</style>
