import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // ✅ For alias like "@/components/..."
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5001', // ✅ Your backend server
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
