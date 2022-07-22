import settingsFile from '../config/settings_data.json';

import 'virtual:windi.css';
import '../styles/theme.css';
import '../styles/base/typography.css';
import '../styles/base/icons.css';
import '../styles/base/buttons.css';
import '../styles/layout/header.css';

import 'vite/modulepreload-polyfill';

import { createApp } from 'vue';
import SearchMenu from '../vue/SearchMenu.vue';

const sections = settingsFile.current.sections;

const searchProps = {
  searchPosition: window.themeSettings.search_open_position,
  predictiveSearchEnabled: window.themeSettings.predictive_search_enabled,
  predictiveShowNumber: window.themeSettings.predictive_search_show_number,
  predictiveShowPages: window.themeSettings.predictive_search_show_pages,
  predictiveShowArticles: window.themeSettings.predictive_search_show_articles,
  headerColorScheme: sections.header.settings.color_scheme,
  iconSize: window.themeSettings.icon_size,
  iconStrokeWidth: window.themeSettings.icon_stroke_width,
};

createApp(SearchMenu, searchProps).mount('#searchMenu');