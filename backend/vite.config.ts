import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    host: true,
    port: 5173,
    proxy: {
      // Proxy all /api/* calls to your Express backend
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
      // If you still have predicted.json in frontend/public, this isn't needed.
      // Otherwise, you can proxy /summary (or any other static file) through Express:
      '/api/summary': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  // Make sure Vite serves anything in /public at the root
  publicDir: 'public',
});
