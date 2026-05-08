# 智能数据分析 UI

一个现代化的 Vue 3 + Element Plus 前端应用，为智能数据分析 Agent 提供交互界面。用户通过自然语言提问，实时查看分析过程和结果。

## 核心特性

- 💬 **实时对话**：支持自然语言输入，通过 SSE 流式实时展示分析过程的每个步骤
- 📊 **流程可视化**：清晰展示意图检测、实体抽取、字段检索、SQL 生成、校验、执行等各阶段
- ⚡ **响应式设计**：基于 Element Plus 的优美 UI，适配各类设备
- 📥 **结果导出**：支持将分析结果和查询数据导出为 Excel
- 🎨 **深浅主题**：内置亮色和暗色主题切换
- 🔐 **会话管理**：支持会话历史记录

## 快速开始

### 环境要求

- Node.js ≥ 18
- npm / yarn / pnpm

### 安装与启动

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器（默认 http://localhost:5173）
npm run dev

# 3. 构建生产版本
npm run build

# 4. 预览生产构建
npm run preview
```

## 项目结构

```
smart_data_analysis_ui/
├── src/
│   ├── components/           # Vue 组件
│   │   ├── ChatBox.vue      # 聊天主界面
│   │   ├── ProcessFlow.vue  # 流程步骤展示
│   │   ├── ResultPanel.vue  # 结果展示面板
│   │   └── ...
│   ├── stores/              # Pinia 状态管理
│   │   ├── chatStore.ts     # 聊天状态
│   │   ├── uiStore.ts       # UI 状态
│   │   └── ...
│   ├── api/                 # API 请求
│   │   └── chat.ts          # 后端 API 调用
│   ├── types/               # TypeScript 类型定义
│   │   ├── chat.ts
│   │   ├── process.ts
│   │   └── ...
│   ├── styles/              # 全局样式
│   │   ├── variables.scss   # 样式变量
│   │   └── global.scss      # 全局样式
│   ├── utils/               # 工具函数
│   │   ├── request.ts       # HTTP 请求
│   │   ├── export.ts        # 导出功能
│   │   └── ...
│   ├── App.vue              # 根组件
│   └── main.ts              # 入口文件
├── public/                  # 静态资源
├── vite.config.ts           # Vite 配置
├── tsconfig.json            # TypeScript 配置
├── package.json             # 项目配置与依赖
└── README.md                # 项目说明
```

## 核心依赖

| 包 | 版本 | 用途 |
|-----|------|------|
| `vue` | ^3.4.21 | 前端框架 |
| `element-plus` | ^2.6.3 | UI 组件库 |
| `pinia` | ^2.1.7 | 状态管理 |
| `axios` | ^1.6.8 | HTTP 请求 |
| `vite` | ^5.2.0 | 构建工具 |
| `sass` | ^1.72.0 | CSS 预处理 |
| `@element-plus/icons-vue` | ^2.3.1 | 图标库 |
| `@vueuse/core` | ^10.9.0 | Vue 组合式 API 工具 |
| `dayjs` | ^1.11.10 | 日期时间处理 |
| `xlsx` | ^0.18.5 | Excel 导出 |

## 主要功能

### 1. 聊天界面

- **问题输入**：文本框输入自然语言问题
- **实时流式显示**：通过 SSE 连接实时接收后端事件流
- **消息历史**：显示往来消息记录
- **加载状态**：处理中显示加载指示器

### 2. 流程展示

实时展示分析流程的各个阶段：

```
意图检测 → 实体抽取 → 字段检索 → 指标检索 → 枚举值检索
    ↓                              ↓
[不相关/澄清] → [结束]    合并结果 → 字段过滤 → 指标过滤
                              ↓
                         关键词扩展 → SQL 生成 ↻ 校验纠错
                                        ↓
                                    查询执行 → 结果总结
```

每个步骤包含：
- 步骤名称和状态（进行中/完成/出错）
- 关键输出数据预览
- 处理耗时

### 3. 结果展示

- **分析总结**：LLM 生成的自然语言总结
- **原始数据**：查询结果的表格展示
- **查询信息**：最终执行的 SQL 语句、执行耗时等

### 4. 数据导出

支持导出为 Excel 格式：
- 导出查询结果数据
- 导出流程分析信息
- 导出原始 SQL 语句

### 5. 主题切换

- 亮色主题（Light）
- 暗色主题（Dark）
- 主题偏好持久化

## API 集成

### 后端 API 端点

```
POST /smart/data/analysis/chat
```

**请求**：
```json
{
  "question": "用户问题"
}
```

**响应**（SSE 流式事件）：

```
event: data
data: {
  "event_type": "intent_check",
  "data": {
    "is_relevant": true,
    "clarification_question": null
  }
}

event: data
data: {
  "event_type": "entity_extract",
  "data": {
    "entities": [...]
  }
}

...

event: data
data: {
  "event_type": "final_result",
  "data": "分析结果总结..."
}
```

### 事件类型

| 类型 | 说明 |
|------|------|
| `intent_check` | 意图检测结果 |
| `entity_extract` | 实体抽取结果 |
| `column_retrieval` | 字段检索结果 |
| `metrics_retrieval` | 指标检索结果 |
| `value_retrieval` | 枚举值检索结果 |
| `merge` | 结果合并 |
| `table_filter` | 表/字段过滤 |
| `metric_filter` | 指标过滤 |
| `expand` | 关键词扩展 |
| `generate_hql` | SQL 生成 |
| `validate_hql` | SQL 校验 |
| `execute_hql` | 查询执行 |
| `generate_result` | 结果分析 |
| `final_result` | 最终结果 |
| `error` | 错误消息 |

## 开发指南

### 环境变量

创建 `.env.local` 配置后端 API 地址：

```env
VITE_API_BASE_URL=http://localhost:8080/smart/data/analysis
```

### 组件开发

#### ChatBox 组件

主聊天界面组件，负责用户输入和消息展示：

```vue
<template>
  <div class="chat-box">
    <!-- 消息列表 -->
    <div class="messages"></div>
    
    <!-- 输入框 -->
    <div class="input-area"></div>
  </div>
</template>
```

#### ProcessFlow 组件

显示分析流程的各个步骤：

```vue
<template>
  <div class="process-flow">
    <el-steps :active="activeStep" process-status="process">
      <el-step title="意图检测" />
      <el-step title="实体抽取" />
      <!-- ... -->
    </el-steps>
  </div>
</template>
```

#### ResultPanel 组件

展示查询结果和分析数据：

```vue
<template>
  <div class="result-panel">
    <!-- 分析总结 -->
    <div class="summary"></div>
    
    <!-- 数据表格 -->
    <el-table :data="tableData"></el-table>
    
    <!-- 导出按钮 -->
    <el-button @click="exportExcel">导出结果</el-button>
  </div>
</template>
```

### 状态管理

使用 Pinia 管理全局状态：

```typescript
// stores/chatStore.ts
import { defineStore } from 'pinia'

export const useChatStore = defineStore('chat', {
  state: () => ({
    messages: [],
    currentQuestion: '',
    isLoading: false,
    processSteps: [],
    result: null,
  }),
  
  actions: {
    async sendMessage(question: string) {
      // 发送问题到后端
      // 处理 SSE 流
      // 更新状态
    },
  },
})
```

### API 请求

所有后端 API 请求封装在 `src/api/chat.ts`：

```typescript
// api/chat.ts
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

export const chatApi = {
  async *streamChat(question: string) {
    // 使用 SSE 连接流式获取响应
  },
}
```

### 类型定义

定义 TypeScript 接口确保类型安全：

```typescript
// types/chat.ts
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface ProcessStep {
  name: string
  status: 'pending' | 'running' | 'success' | 'error'
  data: Record<string, any>
  duration: number
}

export interface AnalysisResult {
  summary: string
  query: string
  data: any[]
  metadata: Record<string, any>
}
```

### 样式

使用 SCSS 变量和 Element Plus 主题变量：

```scss
// styles/variables.scss
$primary-color: #409eff;
$success-color: #67c23a;
$warning-color: #e6a23c;
$danger-color: #f56c6c;

$light-bg: #ffffff;
$dark-bg: #1a1a1a;
```

## 构建与部署

### 开发构建

```bash
npm run dev
```

Vite 开发服务器运行于 `http://localhost:5173`

### 生产构建

```bash
npm run build
```

输出到 `dist/` 目录

### 预览

```bash
npm run preview
```

本地预览生产构建结果

### 部署

将 `dist/` 目录部署到静态服务器：

```bash
# 示例：部署到 Nginx
cp -r dist/* /var/www/html/

# 示例：部署到 GitHub Pages
npm run build
# 将 dist 目录内容推送到 gh-pages 分支
```

## 功能清单

- [x] 聊天界面与消息展示
- [x] SSE 流式事件处理
- [x] 流程步骤可视化
- [x] 结果表格展示
- [x] Excel 数据导出
- [x] 主题切换
- [x] 会话管理
- [ ] 多语言支持
- [ ] 语音输入
- [ ] 高级查询编辑器
- [ ] 查询历史持久化
- [ ] 协作分享

## 常见问题

**Q: 如何连接后端 API？**

创建 `.env.local` 文件，设置 `VITE_API_BASE_URL` 为后端 API 地址：
```env
VITE_API_BASE_URL=http://localhost:8080/smart/data/analysis
```

**Q: 如何自定义主题颜色？**

修改 `src/styles/variables.scss` 中的颜色变量，并在 `App.vue` 中使用。

**Q: 如何添加新的流程步骤显示？**

1. 在 `src/types/process.ts` 中添加新的事件类型
2. 在 `ProcessFlow.vue` 中添加对应的步骤
3. 在 API 集成中处理新的事件

**Q: 如何优化首屏加载速度？**

- 使用 Element Plus 按需导入
- 启用 Vite 代码分割
- 压缩静态资源
- 使用 CDN 分发

## 浏览器支持

- Chrome (最新)
- Firefox (最新)
- Safari (最新)
- Edge (最新)

## 性能优化

- ✅ 虚拟化消息列表（大量消息场景）
- ✅ 防抖用户输入
- ✅ 异步加载组件
- ✅ 图片懒加载
- ✅ 缓存 API 响应

## 许可证

[待定]

## 联系方式

[待定]
