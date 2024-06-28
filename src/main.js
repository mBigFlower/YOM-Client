/*
 * @Date: 2023-02-12 16:02:31
 * @LastEditors: csh
 * @LastEditTime: 2023-02-18
 * @FilePath: /web/src/main.js
 * @Description: Do not edit
 */
import { createApp } from 'vue'
import App from './App.vue'
import ArcoVue from '@arco-design/web-vue'
import '@arco-design/web-vue/dist/arco.css'
import store from './store'
import JsonViewer from 'vue-json-viewer'
import './base.less'

// 路由
import Router from './router'
const app = createApp(App)
app.use(store)
app.use(ArcoVue)
app.use(JsonViewer)
app.use(Router)
app.mount('#app')
