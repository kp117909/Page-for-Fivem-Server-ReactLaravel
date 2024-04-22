import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import laravel from 'laravel-vite-plugin';
import postcssImport from 'postcss-import';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import path from 'path';

export default defineConfig({
  plugins: [
    reactRefresh(),
    laravel({
      input: [
          'resources/css/index.css',
          'resources/js/app.js',
      ],
      refresh: true,
  }),
  ],
  
  server: {
    host: '45.152.161.159', // replace with the IP address of the Homestead machine
    https: false,
    cors: true,
    hmr: {
        host: '45.152.161.159', // replace with the IP address of the Homestead machine
    }
},

  resolve: {
    alias: {
      '@react': path.resolve(__dirname, 'resources/react'),
      '@css': path.resolve(__dirname, 'resources/css'),
      '@js': path.resolve(__dirname, 'resources/js'),
    }
  },
  css: {
    postcss: {
      plugins: [
        postcssImport(),
        tailwindcss(),
        autoprefixer()
      ]
    }
  },
  build: {
    outDir: 'public/dist',
    assetsDir: '.',
    sourcemap: true,
    rollupOptions: {
      input: {
        react: '@react/app.tsx',
        css: '@css/index.css',
        js: '@js/app.js', // Dodajemy ścieżkę do pliku JavaScript
      }
    }
  }
});
