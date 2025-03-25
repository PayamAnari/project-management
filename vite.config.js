import { defineConfig } from 'vite'
import laravel from 'laravel-vite-plugin'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [
    laravel({
      input: ['resources/css/app.css', 'resources/js/app.js'],
      refresh: true,
    }),
    vue(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './resources/js')
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['resources/js/**/*.{test,spec}.{js,vue}'],
    deps: {
      optimizer: {
        web: {
          include: ['@vue/test-utils']
        }
      }
    }
  }
})