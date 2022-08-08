import 'virtual:windi.css';
import '../styles/theme.css';
import '../styles/base/typography.css';
import '../styles/base/icons.css';
import '../styles/base/buttons.css';
import '../styles/base/animations.css';
import '../styles/layout/header.css';
import '../styles/snippets/cards.css';

import 'vite/modulepreload-polyfill';

import { createApp } from 'vue';
import SearchMenu from '../vue/SearchMenu.vue';

const searchProps = {
  searchPosition: window.themeSettings.search_open_position,
  trendingSearches: window.themeSettings.search_trends,
  predictiveSearchEnabled: window.themeSettings.predictive_search_enabled,
  predictiveShowNumber: window.themeSettings.predictive_search_show_number,
  predictiveShowPages: window.themeSettings.predictive_search_show_pages,
  predictiveShowArticles: window.themeSettings.predictive_search_show_articles,
  iconSize: window.themeSettings.icon_size,
  iconStrokeWidth: window.themeSettings.icon_stroke_width,
  cardStyle: window.themeSettings.card_style,
  cardAlignment: window.themeSettings.card_text_alignment,
  cardColorScheme: window.themeSettings.card_color_scheme,
  cardBorder: window.themeSettings.card_border,
  cardRadius: window.themeSettings.card_corner_radius,
  cardImageAspect: window.themeSettings.card_image_aspect,
  cardImageFit: window.themeSettings.card_image_fit,
  cardAnimate: window.themeSettings.card_hover_animate,
  cardAnimation: window.themeSettings.card_hover_animation,
  cardShowInfoOnHover: window.themeSettings.card_hover_show_info
};

createApp(SearchMenu, searchProps).mount('#searchMenuTop');