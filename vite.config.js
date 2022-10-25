import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import WindiCSS from 'vite-plugin-windicss';

export default defineConfig(({ command, mode }) => {
  switch (mode) {
    case 'development':
      return {
        // experimental: {
        //   renderBuiltUrl(filename) {
        //     return { runtime: `window.__toCdnUrl(${JSON.stringify(filename)})` }
        //   }
        // },
        plugins: [vue(), WindiCSS()],
        publicDir: false,
        build: {
          rollupOptions: {
            input: './scripts/theme.js',
            output: {
              entryFileNames: 'assets/et_[name].js',
              chunkFileNames: 'assets/et_[name].js',
              assetFileNames: 'assets/et_[name].[ext]'
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
              entryFileNames: 'assets/et_[name].js',
              chunkFileNames: 'assets/et_[name].js',
              assetFileNames: 'assets/et_[name].[ext]'
            }
          },
          outDir: './',
          assetsDir: './assets/',
          emptyOutDir: false,
          minify: false,
          watch: null,
          // modulePreload: {
          //   resolveDependencies(filename, { type }) {
          //     if (type === 'asset') {
          //       return 'test/' + filename;
          //       // return { runtime: `window.__toCdnUrl(${JSON.stringify(filename)})` }
          //     }
          //   }
          // }
        },
        // experimental: {
        //   renderBuiltUrl(filename, { type }) {
        //     if (type === 'asset') {
        //       return { runtime: `window.__toCdnUrl(${JSON.stringify(filename)})` }
        //     }
        //   }
        // },
      };
  }
});
