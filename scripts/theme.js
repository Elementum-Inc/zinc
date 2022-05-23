import "vite/modulepreload-polyfill";
import { createApp } from "vue";
import App from "../vue/App.vue";

import "../styles/theme.css";

createApp(App).mount("#app");
