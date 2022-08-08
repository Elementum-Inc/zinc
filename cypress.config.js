const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      return require("./cypress/plugins/index.js")(on, config);
    },
    baseUrl: "http://127.0.0.1:9292",
  },

  component: {
    devServer: {
      framework: "vue",
      bundler: "vite",
    },
  },
});
