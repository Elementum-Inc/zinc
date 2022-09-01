import 'virtual:windi.css';
import '../styles/theme.css';
import '../styles/base/typography.css';
import '../styles/base/icons.css';
import '../styles/base/buttons.css';
import '../styles/base/animations.css';
import '../styles/layout/header.css';
import '../styles/snippets/cards.css';

if (window.location.href.includes('/collection/')) {
  import('../styles/sections/collection-hero.css');
}

import 'vite/modulepreload-polyfill';

import { createApp } from 'vue';
import MegaMenu from '../vue/MegaMenu.vue';
import SearchMenu from '../vue/SearchMenu.vue';

const searchMount = document.querySelector('#searchMenuTop');
const megamenuMount = document.querySelector('#megamenu');

var megamenuSettings = JSON.parse(megamenuMount.dataset.settings);
var megamenuBlocks = JSON.parse(megamenuMount.dataset.blocks);
var topMenu = JSON.parse(megamenuMount.dataset.topmenu);
var mobileLinks = JSON.parse(megamenuMount.dataset.mobilelinks);

topMenu.forEach((m) => m.blocks = []);

const menuProps = {
  iconSize: window.themeSettings.icon_size,
  iconStrokeWidth: window.themeSettings.icon_stroke_width,
  settings: megamenuSettings,
  blocks: megamenuBlocks,
  topMenu: topMenu,
  mobileLinks: mobileLinks
};

var searchSettings = JSON.parse(searchMount.dataset.settings);

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
  cardShowInfoOnHover: window.themeSettings.card_hover_show_info,
  settings: searchSettings
};

createApp(MegaMenu, menuProps).mount(megamenuMount);
createApp(SearchMenu, searchProps).mount(searchMount);

document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('#shopify-section-header');
  var ticking = false;

  document.addEventListener('scroll', () => {
    var yPos = window.scrollY;
  
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (yPos < window.innerHeight) {
          header.classList.remove('sticky');
        } else {
          header.classList.add('sticky');
        }

        ticking = false;
      });
  
      ticking = true;
    }
  });
});