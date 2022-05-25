import "vite/modulepreload-polyfill";
import { createApp } from "vue";
import App from "./vue/App.vue";

import "virtual:windi.css";
import "../styles/theme.css";

createApp(App).mount("#app");
