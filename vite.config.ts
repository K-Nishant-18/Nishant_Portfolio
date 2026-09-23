import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Nishant Portfolio',
        short_name: 'Portfolio',
        description: 'Nishant Portfolio Progressive Web App',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/Logo.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/Logo.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@designcodeio/threeui/style.css': fileURLToPath(new URL('./src/shaders/threeui.css', import.meta.url)),
      '@designcodeio/threeui': fileURLToPath(new URL('./src/shaders/index.ts', import.meta.url)),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
