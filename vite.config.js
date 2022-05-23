import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import postcssNesting from "postcss-nested";

export default defineConfig({
  mode: "development", // [TODO] Remove or change mode before submission, want to make sure merchants are using it in prod out of the box 👍
  plugins: [vue()],
  publicDir: false,
  build: {
    rollupOptions: {
      input: "./scripts/theme.js",
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js",
        assetFileNames: "[name].[ext]"
      }
    },
    outDir: "assets",
    assetsDir: "./",
    emptyOutDir: false,
    watch: {}, // comment this out to remove watch
  },
  css: {
    postcss: {
      plugins: [postcssNesting]
    },
  },
});
