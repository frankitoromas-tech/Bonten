import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'BONTEN_LOG0.jpg'],
      manifest: {
        name: 'BONTEN NG',
        short_name: 'BONTEN',
        description: 'BONTEN - Nuestra Resistencia',
        theme_color: '#033266',
        background_color: '#f4f6f9',
        display: 'standalone',
        icons: [
          {
            src: '/BONTEN_LOG0.jpg',
            sizes: '192x192',
            type: 'image/jpeg',
          },
          {
            src: '/BONTEN_LOG0.jpg',
            sizes: '512x512',
            type: 'image/jpeg',
          }
        ]
      }
    })
  ],
});
