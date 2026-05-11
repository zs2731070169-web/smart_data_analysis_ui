# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 常用命令

```bash
npm run dev       # 启动 Vite 开发服务器（端口 5173，含 /smart 代理到后端 127.0.0.1:8080）
npm run build     # 生产构建
npm run preview   # 本地预览构建产物
```

本项目无单元测试、无 lint 配置。

## 架构概览

智能数据分析对话式 UI（Vue 3 + Vite + Pinia + Element Plus）。核心是一条「用户提问 → SSE 流式拉取 → 渐进渲染进度/结果/拒答」的链路。

### 数据流（理解三个文件即可掌握全局）

1. **`src/views/ChatView.vue`**：唯一视图。承载输入框、消息列表，调用 `chatStore.sendMessage`。
2. **`src/stores/chatStore.js`**：单一 Pinia store，持有 `messages` 数组和 `isStreaming` 标志。`sendMessage` 会一次性 push 一条 user 消息和一条助手占位消息（含 `progressSteps`、`tableData`、`fallbackText`、`errorText` 等字段），然后把对该占位消息的引用作为闭包传给 SSE 回调，由回调直接变更其字段触发响应式更新。
3. **`src/services/sseService.js`**：用原生 `fetch` + `ReadableStream` 自实现 SSE 解析，返回 `AbortController` 供中断。

### 后端 SSE 协议（重要、易踩坑）

后端走 `POST /smart/data/analysis/chat`，`Content-Type: application/json`，body `{ question, session }`：

- `session` 必传字段（可空串）。首次请求传 `""`，后端在响应头 `x-session-id` 下发会话 id；前端记录后在同一会话的后续请求中回传，保持多轮上下文。
- 点击「清空对话」需同时重置前端 `chatStore.sessionId` 以开启新会话。
- 会话 id 仅在响应头中下发，不出现在 SSE data 事件里。

返回 `text/event-stream`，每行格式：

```
data: ["custom", <string | object>]
```

- `payload` 为字符串 → 进度文本（命中 `PROGRESS_KEYWORDS` 时归 `onProgress`）或拒答/错误文本（归 `onFallback`，**支持流式逐字累加**）
- `payload` 为对象且含 `output` 数组 → 查询结果（归 `onOutput`，将数组首项的键作为表格列）
- 流自然关闭即结束，**没有 `[DONE]` 标志**
- 兼容兜底：旧格式 `{output:[...]}`、`{text:"..."}`、纯文本 `data: xxx` 也会被处理

判定「进度」vs「拒答」靠 `sseService.js` 的 `PROGRESS_KEYWORDS` 关键字列表（如「意图识别」「HQL 生成」「执行查询」等）。**新增后端进度文案时必须同步更新此列表**，否则进度会被误判为拒答。

### 渲染分支（`MessageItem.vue`）

助手消息按字段优先级渲染：`errorText` > `tableData` （用 `DataTable.vue`）> `fallbackText`（用 `FallbackText.vue`）> `progressSteps`（带 typing 光标）。

### 配置约定

- `vite.config.js` 中 `@` → `src`，并通过 `additionalData` 全局注入 `@/styles/variables.scss`，组件 `<style lang="scss">` 内可直接用变量，**不要手动 `@use`**。
- 开发环境请求走相对路径 `/smart/...`（被 vite proxy 转发到 8080）；生产环境从 `.env.production` 的 `VITE_API_BASE_URL` 拼绝对路径。
- 构建侧 `manualChunks` 已按 vue/element/icons/utils/xlsx 拆分 vendor，新增大型依赖时考虑加入对应分组。
- `main.js` 已批量注册全部 Element Plus 图标为全局组件，`<el-icon><Search /></el-icon>` 直接用，无需 import。

## 语言

代码注释、文档、回复一律使用简体中文（与用户全局指令一致）。
