// Windi import
import 'virtual:windi.css';

// Globals
import '../styles/theme.css';
import '../styles/base/typography.css';
import '../styles/base/colors.css';
import '../styles/base/icons.css';
import '../styles/base/buttons.css';
import '../styles/base/forms.css';
import '../styles/base/animations.css';
import '../styles/layout/header.css';

// Sections
import('../styles/sections/blog.css');
import('../styles/sections/image-with-text.css');

// Snippets
import('../styles/snippets/cards.css');
import('../styles/snippets/price.css');

// By page
if (window.location.href.includes('/collection/')) {
  import('../styles/sections/collection-hero.css');
  import('../styles/snippets/facets.css');
}

if (window.location.href.includes('/search?')) {
  import('../styles/sections/search.css');
}

import 'vite/modulepreload-polyfill';

import { createApp } from 'vue';
import MegaMenu from '../vue/MegaMenu.vue';
import SearchMenu from '../vue/SearchMenu.vue';

const searchMount = document.querySelector('#searchMenuTop');
const megamenuMount = document.querySelector('#megamenu');

const menuProps = {};
const searchProps = {};

function fetchProps() {
  const megamenuSettings = JSON.parse(megamenuMount.dataset.settings);
  const megamenuBlocks = JSON.parse(megamenuMount.dataset.blocks);
  const topMenu = JSON.parse(megamenuMount.dataset.topmenu);
  const mobileLinks = JSON.parse(megamenuMount.dataset.mobilelinks);
  
  topMenu.forEach((m) => m.blocks = []);
  
  menuProps.iconSize = window.themeSettings.icon_size;
  menuProps.iconStrokeWidth = window.themeSettings.icon_stroke_width;
  menuProps.settings = megamenuSettings;
  menuProps.blocks = megamenuBlocks;
  menuProps.topMenu = topMenu;
  menuProps.mobileLinks = mobileLinks;
  
  const searchSettings = JSON.parse(searchMount.dataset.settings);
  
  searchProps.searchPosition = window.themeSettings.search_open_position;
  searchProps.trendingSearches = window.themeSettings.search_trends;
  searchProps.predictiveSearchEnabled = window.themeSettings.predictive_search_enabled;
  searchProps.predictiveShowNumber = window.themeSettings.predictive_search_show_number;
  searchProps.predictiveShowPages = window.themeSettings.predictive_search_show_pages;
  searchProps.predictiveShowArticles = window.themeSettings.predictive_search_show_articles;
  searchProps.iconSize = window.themeSettings.icon_size;
  searchProps.iconStrokeWidth = window.themeSettings.icon_stroke_width;
  searchProps.cardColorScheme = window.themeSettings.card_color_scheme;
  searchProps.cardBorder = window.themeSettings.card_border;
  searchProps.cardImageAspect = window.themeSettings.card_image_aspect;
  searchProps.cardImageFit = window.themeSettings.card_image_fit;
  searchProps.cardAnimate = window.themeSettings.card_hover_animate;
  searchProps.cardAnimation = window.themeSettings.card_hover_animation;
  searchProps.settings = searchSettings;
}

fetchProps();

const megamenuApp = (component, props) => createApp(component, props);
const searchApp = (component, props) => createApp(component, props);

var megamenuInit = megamenuApp(MegaMenu, menuProps);
var searchInit = searchApp(SearchMenu, searchProps);

megamenuInit.mount(megamenuMount);
searchInit.mount(searchMount);

document.addEventListener('DOMContentLoaded', () => {
  if (JSON.parse(megamenuMount.dataset.settings).enable_sticky_header) {
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
  }
});

// TO-DO: Fix vue app loading in the theme editor
// Recap of issue: Elements for observers are not
// there on reload/remount for some reason. When a
// change is made in the theme editor, the mounted
// element get cleared out, then on remount it fails
// to find the child elements for attaching observers.
if (Shopify.designMode) {
  // editor mode helper function
  // const registerNewApps = function(event) {
  //   event.target
  //     .querySelectorAll(`div[data-app]`)
  //     .forEach((appElement) => {
  //       const appType = appElement.getAttribute("data-app-type");
  //       // eval(
  //       //   document.getElementById(`${eventSectionId}-${appType}`).innerHTML
  //       // );
  //     });
  // };

  // Handle theme editor events
  document.addEventListener("shopify:section:load", (event) => {
    if (event.detail.sectionId == 'header') {
      console.info('testing, hullo there', event);

      // megamenuInit.unmount();
      searchInit.unmount();

      console.log('unmounted');

      searchInit.mount();

      console.log('remounted');
      
      // fetchProps();

      // console.log('new props fetched', searchProps);

      // var megamenuInit = megamenuApp(MegaMenu, menuProps);
      // var searchReload = searchApp(SearchMenu, searchProps);

      // console.log('new app created', searchReload);

      // megamenuApp().mount(megamenuMount);
      // searchReload.mount(searchMount);

      // console.log('mounted new');
    }

    // const eventSectionId = event.detail.sectionId;
    // registerNewApps(event);
    // window.vue.loaded.forEach((app) => {
    //   // check if a new section has got apps
    //   if (app.id == eventSectionId) {
    //     // create instances for apps in the new section
    //     if (appTypeClass[app.type]) {
    //       const newApp = new appTypeClass[app.type](app.id, app.data);
    //       activeApps.push(newApp);
    //       newApp.init();
    //     } else {
    //       console.log(`App "${app.type}" was not registered`);
    //     }
    //   }
    // });
  });
}