import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/embed.ts'),
      name: 'EchoWidget',
      fileName: (format) => `echo-widget.${format}.js`,
      formats: ['iife']
    },
    rollupOptions: {
      output: {
        extend: true
      }
    }
  },
  server: {
    port: 3002,
    open: '/src/index.html'
  }
});
