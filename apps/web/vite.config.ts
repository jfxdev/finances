import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
import { fileURLToPath, URL } from 'node:url';
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['icon-192.png', 'icon-512.png'],
      manifest: {
        name: 'Finances',
        short_name: 'Finances',
        description: 'Suas finanças, com clareza.',
        lang: 'pt-BR',
        start_url: '/',
        display: 'standalone',
        background_color: '#f8faf9',
        theme_color: '#142a22',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,woff2}'],
        navigateFallback: 'index.html',
        navigateFallbackDenylist: [/^\/api\//, /^\/mcp/, /^\/health\//],
        runtimeCaching: [],
        cleanupOutdatedCaches: true,
      },
    }),
  ],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  server: {
    port: 5173,
    strictPort: true,
    proxy: { '/api': 'http://127.0.0.1:3000', '/mcp': 'http://127.0.0.1:3000' },
  },
  build: {
    rollupOptions: {
      output: {
        onlyExplicitManualChunks: true,
        manualChunks(id) {
          if (
            id.includes('/node_modules/react/') ||
            id.includes('/node_modules/react-dom/') ||
            id.includes('/node_modules/scheduler/')
          )
            return 'react';
          if (id.includes('/node_modules/@radix-ui/') || id.includes('/node_modules/radix-ui/'))
            return 'ui';
          if (
            id.includes('/node_modules/recharts/') ||
            id.includes('/node_modules/d3-') ||
            id.includes('/node_modules/victory-vendor/')
          )
            return 'charts';
        },
      },
    },
  },
});
