import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import WindiCSS from 'vite-plugin-windicss';

export default defineConfig(({ command, mode }) => {
  switch (mode) {
    case 'development':
      return {
        plugins: [vue(), WindiCSS()],
        publicDir: false,
        build: {
          rollupOptions: {
            input: './scripts/theme.js',
            output: {
              entryFileNames: '[name].js',
              chunkFileNames: '[name].js',
              assetFileNames: '[name].[ext]'
            }
          },
          outDir: 'assets',
          assetsDir: './',
          emptyOutDir: false,
          minify: false,
          watch: {
            include: [
              './scripts/theme.js',
              './scripts/**/*.js',
              './styles/theme.css',
              './styles/**/*.css',
            ]
          },
        },
      };
    case 'production':
      return {
        plugins: [vue(), WindiCSS()],
        publicDir: false,
        build: {
          rollupOptions: {
            input: './scripts/theme.js',
            output: {
              entryFileNames: '[name].js',
              chunkFileNames: '[name].js',
              assetFileNames: '[name].[ext]'
            }
          },
          outDir: 'assets',
          assetsDir: './',
          emptyOutDir: false,
          watch: null
        },
      };
  }
});
