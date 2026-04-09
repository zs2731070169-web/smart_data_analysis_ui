import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // 路径别名，@ 指向 src 目录
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        // 使用新版 Sass API 避免弃用警告
        api: 'modern-compiler',
        // 全局自动注入 SCSS 变量，所有组件中直接使用变量无需手动导入
        additionalData: `@use "@/styles/variables.scss" as *;`
      }
    }
  },
  server: {
    port: 5173,
    // 开发代理：将 /smart 请求转发到后端服务
    proxy: {
      '/smart': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true
      }
    }
  },
  build: {
    // 代码分割：将大型第三方库拆分为独立 chunk，优化首屏加载
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-vue': ['vue', 'pinia'],
          'vendor-element': ['element-plus'],
          'vendor-icons': ['@element-plus/icons-vue'],
          'vendor-utils': ['axios', 'dayjs', '@vueuse/core'],
          'vendor-xlsx': ['xlsx'],
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})
