/**
 * 聊天状态管理 Store
 * 管理消息列表、流式响应状态、SSE 连接控制
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { sendQuestion } from '../services/sseService.js'
import dayjs from 'dayjs'

export const useChatStore = defineStore('chat', () => {
  // ==================== 状态定义 ====================

  /** 消息列表，每条消息为一个对象 */
  const messages = ref([])

  /** 是否正在进行流式响应 */
  const isStreaming = ref(false)

  /** 当前 SSE AbortController，用于中断请求 */
  const abortController = ref(null)

  /**
   * 当前会话 id
   * 首次请求为空字符串，后端通过响应头 x-session-id 下发后由前端记录并回传；
   * 清空对话时重置。
   */
  const sessionId = ref('')

  // ==================== 计算属性 ====================

  /** 是否存在历史消息 */
  const hasMessages = computed(() => messages.value.length > 0)

  // ==================== 工具函数 ====================

  /**
   * 生成唯一消息 ID
   * @returns {number}
   */
  function genId() {
    return Date.now() + Math.floor(Math.random() * 1000)
  }

  /**
   * 创建用户消息对象
   * @param {string} question
   * @returns {Object}
   */
  function createUserMessage(question) {
    return {
      id: genId(),
      role: 'user',
      content: question,
      timestamp: dayjs().format('HH:mm'),
    }
  }

  /**
   * 创建助手消息占位对象（流式填充）
   * @returns {Object}
   */
  function createAssistantMessage() {
    return {
      id: genId(),
      role: 'assistant',
      /** 进度步骤列表 [{text, done, time}] */
      progressSteps: [],
      /** 是否显示打字光标（流式等待中） */
      typing: true,
      /** 查询结果数据数组 */
      tableData: null,
      /** 表格列名数组 */
      tableColumns: [],
      /** 拒答或兜底文本（流式累加） */
      fallbackText: '',
      /** 错误提示文本 */
      errorText: '',
      /** 消息完成时间戳 */
      timestamp: '',
    }
  }

  // ==================== Actions ====================

  /**
   * 发送用户消息，启动 SSE 流式响应
   * @param {string} question - 用户输入的问题
   */
  function sendMessage(question) {
    if (!question.trim() || isStreaming.value) return

    // 1. 添加用户消息
    messages.value.push(createUserMessage(question))

    // 2. 添加助手消息占位
    const assistantMsg = createAssistantMessage()
    messages.value.push(assistantMsg)

    // 3. 获取最后一条消息的引用（reactive）
    const lastMsg = messages.value[messages.value.length - 1]

    isStreaming.value = true

    // 4. 启动 SSE 请求（携带当前会话 id，首次为空字符串）
    abortController.value = sendQuestion(question, {
      /**
       * 会话 id 回调：保存后端下发的 sessionId，后续请求回传
       */
      onSession(id) {
        if (id) sessionId.value = id
      },

      /**
       * 进度文本回调：追加步骤，将上一步标记为完成
       */
      onProgress(text) {
        // 将上一步标记为完成
        if (lastMsg.progressSteps.length > 0) {
          lastMsg.progressSteps[lastMsg.progressSteps.length - 1].done = true
        }
        // 追加新步骤
        lastMsg.progressSteps.push({
          text,
          done: false,
          time: dayjs().format('HH:mm:ss'),
        })
      },

      /**
       * 数据输出回调：解析表格列和数据
       */
      onOutput(data) {
        if (data.length > 0) {
          lastMsg.tableColumns = Object.keys(data[0])
          lastMsg.tableData = data
        }
        // 收到结果，隐藏打字光标，标记所有步骤完成
        lastMsg.typing = false
        lastMsg.progressSteps.forEach((s) => (s.done = true))
      },

      /**
       * 拒答文本回调：累加文本（支持流式逐字输出）
       */
      onFallback(text) {
        lastMsg.fallbackText += text
        lastMsg.typing = false
        lastMsg.progressSteps.forEach((s) => (s.done = true))
      },

      /**
       * 流结束回调：更新状态
       */
      onComplete() {
        isStreaming.value = false
        lastMsg.typing = false
        lastMsg.timestamp = dayjs().format('HH:mm')
        lastMsg.progressSteps.forEach((s) => (s.done = true))
        abortController.value = null
      },

      /**
       * 错误回调：显示错误信息
       */
      onError(errMsg) {
        isStreaming.value = false
        lastMsg.typing = false
        lastMsg.errorText = errMsg
        lastMsg.timestamp = dayjs().format('HH:mm')
        abortController.value = null
      },
    }, { session: sessionId.value })
  }

  /**
   * 停止当前流式响应
   */
  function stopStreaming() {
    if (abortController.value) {
      abortController.value.abort()
      abortController.value = null
    }
    isStreaming.value = false

    // 更新最后一条助手消息状态
    const last = messages.value[messages.value.length - 1]
    if (last?.role === 'assistant') {
      last.typing = false
      last.timestamp = dayjs().format('HH:mm')
      // 所有进度步骤标记为完成
      last.progressSteps.forEach((s) => (s.done = true))
    }
  }

  /**
   * 清空所有对话历史
   */
  function clearMessages() {
    stopStreaming()
    messages.value = []
    // 清空对话同时重置会话 id，开启新一轮会话
    sessionId.value = ''
  }

  return {
    // 状态
    messages,
    isStreaming,
    hasMessages,
    sessionId,
    // 操作
    sendMessage,
    stopStreaming,
    clearMessages,
  }
})
