/*
 * @Author: csh
 * @Date: 2023-02-18
 * @LastEditors: csh
 * @LastEditTime: 2023-02-18
 * @Description: file content
 * @FilePath: /web/vite.config.js
 */
import { defineConfig } from 'vite'
import path from 'path' // 此处如果报错则安装 node/path依赖

export default defineConfig({
  build: {
    outDir: './yom-lib/dist',
    sourcemap: true,
    lib: {
      entry: path.resolve(__dirname, '../yom-lib/index.js'),
      name: 'yom',
      fileName: `yom`
    },
    // rollupOptions: {
    //   output: {
    //     entryFileNames: `yom-[hash].js`,
    //     chunkFileNames: `yom-[hash].js`
    //   },
    // },
  },
})
