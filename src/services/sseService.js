/**
 * SSE 流式请求服务
 * 使用原生 fetch + ReadableStream 实现，支持中断控制
 *
 * 后端 SSE 事件格式（text/event-stream）：
 *   data: ["custom", "文本"]           → 进度文本 或 拒答/错误文本（字符串 payload）
 *   data: ["custom", {"output":[...]}] → 查询结果数据（对象 payload）
 *   流结束时连接自然关闭，无 [DONE] 标志
 */

// 开发环境走 vite proxy（相对路径），生产环境读取环境变量
const BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

/**
 * 进度相关关键词列表
 * 用于区分"流式进度文本"和"拒答/错误文本"
 */
const PROGRESS_KEYWORDS = [
  '开始执行',
  '开始 HQL',
  '开始解析',
  'HQL 生成',
  'HQL 执行',
  '意图识别',
  '实体抽取',
  '字段检索',
  '指标检索',
  '表过滤',
  '指标过滤',
  '扩展信息',
  '生成查询',
  '校验',
  '纠错',
  '字段补全',
  '执行查询',
  '分析结果',
]

/**
 * 判断文本是否为进度信息
 * @param {string} text - 待判断文本
 * @returns {boolean}
 */
function isProgressText(text) {
  return PROGRESS_KEYWORDS.some((keyword) => text.includes(keyword))
}

/**
 * 发送问题并接收 SSE 流式响应
 *
 * @param {string} question - 用户问题
 * @param {Object} callbacks - 事件回调函数集合
 * @param {Function} callbacks.onProgress  - 进度文本回调(text: string)
 * @param {Function} callbacks.onOutput    - 数据输出回调(data: Array<Object>)
 * @param {Function} callbacks.onFallback  - 拒答/错误文本回调(text: string)
 * @param {Function} callbacks.onComplete  - 流结束回调
 * @param {Function} callbacks.onError     - 错误回调(errMsg: string)
 * @returns {AbortController} 可调用 .abort() 中断请求
 */
export function sendQuestion(question, callbacks) {
  const controller = new AbortController()

  const fetchSSE = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/smart/data/analysis/chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            Accept: 'text/event-stream',
          },
          body: JSON.stringify({ question }),
          signal: controller.signal,
        }
      )

      if (!response.ok) {
        throw new Error(`HTTP 错误：${response.status} ${response.statusText}`)
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder('utf-8')
      let buffer = '' // 未完整行缓冲区

      while (true) {
        const { done, value } = await reader.read()

        if (done) {
          // 流读取结束，处理缓冲区剩余内容
          if (buffer.trim()) {
            processLine(buffer.trim(), callbacks)
          }
          callbacks.onComplete?.()
          break
        }

        // 将字节流解码为文本，追加到缓冲区
        buffer += decoder.decode(value, { stream: true })

        // 按换行符切分，保留最后一个可能不完整的行
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''

        for (const line of lines) {
          processLine(line, callbacks)
        }
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        // 主动中断
        callbacks.onError?.('连接已中断')
      } else {
        callbacks.onError?.(err.message || '网络错误，请检查连接')
      }
    }
  }

  fetchSSE()
  return controller
}

/**
 * 处理单行 SSE 数据
 *
 * 后端格式：data: ["custom", <string | object>]
 *   - payload 为字符串 → 进度文本或拒答文本
 *   - payload 为对象且含 output 数组 → 查询结果
 *
 * 兼容兜底：data: 纯文本（非 JSON 数组）→ 直接作为拒答文本处理
 *
 * @param {string} line - 单行原始文本
 * @param {Object} callbacks - 回调集合
 */
function processLine(line, callbacks) {
  // 只处理 data: 开头的行
  if (!line.startsWith('data: ')) return

  const payload = line.slice(6).trim()
  if (!payload || payload === '[DONE]') return

  // 尝试解析为 JSON
  try {
    const parsed = JSON.parse(payload)

    // 后端格式：["custom", <string | object>]
    if (Array.isArray(parsed) && parsed.length >= 2 && parsed[0] === 'custom') {
      const content = parsed[1]

      if (typeof content === 'string') {
        // 字符串内容：进度文本 或 拒答/错误文本
        dispatchText(content, callbacks)
      } else if (content && typeof content === 'object') {
        // 对象内容：查询结果
        if (Array.isArray(content.output)) {
          callbacks.onOutput?.(content.output)
        }
      }
      return
    }

    // 兼容旧格式：{"output": [...]}
    if (parsed.output && Array.isArray(parsed.output)) {
      callbacks.onOutput?.(parsed.output)
      return
    }

    // 兼容旧格式：{"text": "..."}
    if (parsed.text) {
      dispatchText(parsed.text, callbacks)
    }
  } catch {
    // 非 JSON，作为纯文本（拒答/错误）处理
    if (payload) {
      dispatchText(payload, callbacks)
    }
  }
}

/**
 * 根据文本内容分发到对应回调
 * @param {string} text
 * @param {Object} callbacks
 */
function dispatchText(text, callbacks) {
  if (isProgressText(text)) {
    callbacks.onProgress?.(text)
  } else {
    callbacks.onFallback?.(text)
  }
}
