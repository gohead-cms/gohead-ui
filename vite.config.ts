// Update your vite.config.ts to intercept the proxy response and add the missing header

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
        // The configure option lets you modify the proxy instance.
        // Here we listen to the "proxyRes" event to modify the response headers.
        configure: (proxy) => {
          proxy.on('proxyRes', (proxyRes, req, res) => {
            // Get existing Access-Control-Allow-Headers header
            let acAllowHeaders = proxyRes.headers['access-control-allow-headers'];
            if (acAllowHeaders) {
              // If "Authorization" is not already included, add it
              if (!acAllowHeaders.toLowerCase().includes('authorization')) {
                acAllowHeaders = acAllowHeaders + ', Authorization';
              }
            } else {
              // Otherwise, set the header to include the required headers
              acAllowHeaders = 'Authorization, Content-Type';
            }
            proxyRes.headers['access-control-allow-headers'] = acAllowHeaders;
          });
        },
      },
    },
  },
});
