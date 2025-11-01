import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // base must match the repo name when deploying to GitHub Pages
  base: '/',
  // Polyfill 'global' for sockjs-client (and similar libs) during bundling
  define: {
    global: 'window',
  },
  // Optional: For WebSocket proxying in dev (if CORS issues arise with backend on different port)
  // server: {
  //   proxy: {
  //     '/ws': {
  //       target: 'http://localhost:9999', // Your backend port
  //       ws: true,
  //     },
  //   },
  // },
})