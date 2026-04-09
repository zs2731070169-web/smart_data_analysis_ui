/**
 * 应用入口
 * 初始化 Vue 应用、注册插件和全局组件
 */
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import App from './App.vue'
import './styles/reset.scss'
import './styles/global.scss'

const app = createApp(App)
const pinia = createPinia()

// 批量注册所有 Element Plus 图标组件（全局可用）
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(pinia)
app.use(ElementPlus, { locale: zhCn })
app.mount('#app')
