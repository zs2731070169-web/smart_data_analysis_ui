<template>
  <!-- 顶部导航栏：白色背景 -->
  <header class="chat-header">
    <div class="header-left">
      <!-- 机器人头像图标 -->
      <div class="avatar">
        <el-icon :size="24"><Monitor /></el-icon>
      </div>
      <div class="title-wrap">
        <h1 class="title">智能数据分析</h1>
      </div>
    </div>
  </header>
</template>

<script setup>
import { Monitor } from '@element-plus/icons-vue'
</script>

<style lang="scss" scoped>
.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 $spacing-md;
  height: 60px;
  background-color: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
  user-select: none;
}

.header-left {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba($primary-color, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: $primary-color;
  flex-shrink: 0;
}

.title-wrap {
  display: flex;
  flex-direction: column;
}

.title {
  font-size: 16px;
  font-weight: 600;
  color: $text-primary;
  line-height: 1.2;
}
</style>
