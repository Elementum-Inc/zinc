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
              entryFileNames: 'assets/[name].js',
              chunkFileNames: 'assets/[name].js',
              assetFileNames: 'assets/[name].[ext]'
            }
          },
          outDir: './',
          assetsDir: './assets/',
          emptyOutDir: false,
          minify: false,
          watch: {
            include: [
              './scripts/theme.js',
              './scripts/**/*.js',
              './styles/theme.css',
              './styles/**/*.css',
              './**/*.liquid',
              './vue/**/*',
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
              entryFileNames: 'assets/[name].js',
              chunkFileNames: 'assets/[name].js',
              assetFileNames: 'assets/[name].[ext]'
            }
          },
          outDir: './',
          assetsDir: './assets',
          emptyOutDir: false,
          minify: false,
          watch: null
        },
      };
  }
});
