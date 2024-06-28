/*
 * @Author: csh
 * @Date: 2023-02-18
 * @LastEditors: csh
 * @LastEditTime: 2023-02-18
 * @Description: file content
 * @FilePath: /web/vite.config.js
 */
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { join } from 'path' // 此处如果报错则安装 node/path依赖

export default defineConfig({
  build: {
    outDir: '../mBigFlower.github.io/yom'
  },
  plugins: [vue(), { src: '@/plugins/vue-mavon-editor', ssr: false }],
  resolve: {
    alias: {
      '@': join(__dirname, "src")
    }
  },
  server: {
    host: "0.0.0.0"
  },
  base: 'yom', // 公网部署时，需要配置
})
