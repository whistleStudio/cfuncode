import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import viteCompression from 'vite-plugin-compression'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    viteCompression({
      threshold: 10240 // 对大于 1mb 的文件进行压缩
    })
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "./src/assets/style/variables.scss";' 
      },
    },
  },
  esbuild: {
    drop: ['console', 'debugger'],
  },
})
