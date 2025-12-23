import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'   // ← 이거 추가해야 함!


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    headers: {
      'Content-Security-Policy': "img-src 'self' data: https://* http://localhost:* blob:"
    },

  },
  proxy: {
    '/uploads': {
      target: 'http://localhost:8080',  // 백엔드 주소
      changeOrigin: true,
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    }
  }
})
