<template>
  <!-- 数据表格区域：动态渲染查询结果 -->
  <div class="data-table-wrap" v-if="data && data.length > 0">
    <!-- 表格工具栏 -->
    <div class="table-toolbar">
      <span class="record-count">共 {{ data.length }} 条记录</span>
      <div class="toolbar-actions">
        <!-- 复制为 CSV 按钮 -->
        <el-button size="small" :icon="CopyDocument" @click="copyAsCSV">
          复制 CSV
        </el-button>
        <!-- 导出 Excel 按钮 -->
        <el-button size="small" :icon="Download" type="primary" @click="exportExcel">
          导出 Excel
        </el-button>
      </div>
    </div>

    <!-- Element Plus 表格 -->
    <el-table
      :data="data"
      border
      stripe
      size="small"
      max-height="400"
      style="width: 100%"
      class="result-table"
    >
      <el-table-column
        v-for="col in columns"
        :key="col"
        :prop="col"
        :label="col"
        :sortable="isNumericColumn(col)"
        min-width="100"
        show-overflow-tooltip
      />
    </el-table>
  </div>
</template>

<script setup>
import { CopyDocument, Download } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import * as XLSX from 'xlsx'

const props = defineProps({
  /** 表格数据数组 */
  data: {
    type: Array,
    default: () => [],
  },
  /** 列名数组 */
  columns: {
    type: Array,
    default: () => [],
  },
})

/**
 * 判断某列是否为数值列（用于开启排序）
 * 取前5行数据中该列的值进行判断
 * @param {string} col - 列名
 * @returns {boolean}
 */
function isNumericColumn(col) {
  if (!props.data.length) return false
  const sample = props.data.slice(0, 5)
  return sample.some((row) => {
    const val = row[col]
    if (val === null || val === undefined || val === '') return false
    return typeof val === 'number' || !isNaN(Number(val))
  })
}

/**
 * 将数据转换为 CSV 格式文本
 * @returns {string}
 */
function toCSVString() {
  const header = props.columns.join(',')
  const rows = props.data.map((row) =>
    props.columns
      .map((col) => {
        const val = row[col] ?? ''
        // 含逗号、引号、换行的值需用双引号包裹
        const str = String(val)
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
          return `"${str.replace(/"/g, '""')}"`
        }
        return str
      })
      .join(',')
  )
  return [header, ...rows].join('\n')
}

/**
 * 复制数据为 CSV 格式到剪贴板
 */
async function copyAsCSV() {
  try {
    await navigator.clipboard.writeText(toCSVString())
    ElMessage.success('已复制为 CSV 格式')
  } catch {
    ElMessage.error('复制失败，请手动复制')
  }
}

/**
 * 导出数据为 Excel 文件
 * 使用 xlsx 库的 utils.json_to_sheet + writeFile 方法
 */
function exportExcel() {
  try {
    const worksheet = XLSX.utils.json_to_sheet(props.data, {
      header: props.columns,
    })
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, '查询结果')

    // 生成带时间戳的文件名
    const now = new Date()
    const fileName = `查询结果_${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}.xlsx`

    XLSX.writeFile(workbook, fileName)
    ElMessage.success('Excel 导出成功')
  } catch (err) {
    ElMessage.error(`导出失败：${err.message}`)
  }
}
</script>

<style lang="scss" scoped>
.data-table-wrap {
  margin-top: $spacing-sm;
}

.table-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: $spacing-xs;
  flex-wrap: wrap;
  gap: $spacing-xs;
}

.record-count {
  font-size: 12px;
  color: $text-secondary;
}

.toolbar-actions {
  display: flex;
  gap: $spacing-xs;
}

/* 表格整体样式微调 */
.result-table {
  border-radius: 4px;
  overflow: hidden;

  :deep(.el-table__header) {
    th {
      background-color: rgba($primary-color, 0.06) !important;
      color: $text-primary;
      font-weight: 600;
    }
  }

  :deep(.el-table__row:hover td) {
    background-color: rgba($primary-light, 0.05) !important;
  }
}

/* 响应式：移动端隐藏部分操作按钮文字 */
@media (max-width: #{$breakpoint-mobile}) {
  .table-toolbar {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
