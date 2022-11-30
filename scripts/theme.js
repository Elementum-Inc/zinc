import "vite/modulepreload-polyfill";

// Windi import
import "virtual:windi.css";

// Globals
import "../styles/theme.css";
import "../styles/base/typography.css";
import "../styles/base/colors.css";
import "../styles/base/icons.css";
import "../styles/base/buttons.css";
import "../styles/base/forms.css";
import "../styles/base/animations.css";
import "../styles/layout/header.css";

// Sections
import("../styles/sections/blog.css");
import("../styles/sections/image-with-text.css");
import("../styles/sections/hero.css");
import("../styles/sections/modal.css");

// Snippets
import("../styles/snippets/cards.css");
import("../styles/snippets/price.css");

// By page
if (window.location.href.includes("/collection/")) {
  import("../styles/snippets/facets.css");
}

if (window.location.href.includes("/search")) {
  import("../styles/sections/search.css");
}

import "./vue/vue-loader";

import { createApp } from "vue";
import MegaMenu from "../vue/MegaMenu.vue";
import SearchMenu from "../vue/SearchMenu.vue";
import Modal from "../vue/Modal.vue";

const searchMount = document.querySelector("#searchMenuTop");
const megamenuMount = document.querySelector("#megamenu");
const modalMount = document.querySelector("#modal") || false;

const menuProps = {};
const searchProps = {};
const modalProps = {};

function fetchProps() {
  const megamenuSettings = JSON.parse(megamenuMount.dataset.settings);
  const megamenuBlocks = JSON.parse(megamenuMount.dataset.blocks);
  const topMenu = JSON.parse(megamenuMount.dataset.topmenu);
  const mobileLinks = JSON.parse(megamenuMount.dataset.mobilelinks);
  const themeSettings = window.themeSettings;

  topMenu.forEach((m) => (m.blocks = []));

  menuProps.iconSize = window.themeSettings.icon_size;
  menuProps.iconStrokeWidth = window.themeSettings.icon_stroke_width;
  menuProps.settings = megamenuSettings;
  menuProps.blocks = megamenuBlocks;
  menuProps.topMenu = topMenu;
  menuProps.mobileLinks = mobileLinks;

  const searchSettings = JSON.parse(searchMount.dataset.settings);

  searchProps.searchPosition = window.themeSettings.search_open_position;
  searchProps.trendingSearches = window.themeSettings.search_trends;
  searchProps.predictiveSearchEnabled =
    window.themeSettings.predictive_search_enabled;
  searchProps.predictiveShowNumber =
    window.themeSettings.predictive_search_show_number;
  searchProps.predictiveShowPages =
    window.themeSettings.predictive_search_show_pages;
  searchProps.predictiveShowArticles =
    window.themeSettings.predictive_search_show_articles;
  searchProps.iconSize = window.themeSettings.icon_size;
  searchProps.iconStrokeWidth = window.themeSettings.icon_stroke_width;
  searchProps.settings = searchSettings;
  searchProps.themeSettings = themeSettings;
  searchProps.cardSettings = {
    card_color_scheme: window.themeSettings.card_color_scheme,
    card_border: window.themeSettings.card_border,
    card_image_fit: window.themeSettings.card_image_fit,
    card_hover_animate: window.themeSettings.product_card_hover_animate,
    card_hover_animation: window.themeSettings.product_card_hover_animation,
    image_ratio: window.themeSettings.predictive_card_image_ratio,
    show_vendor: window.themeSettings.predictive_card_show_vendor,
    show_price: window.themeSettings.predictive_card_show_price,
    show_author: window.themeSettings.predictive_card_show_author,
    show_date: window.themeSettings.predictive_card_show_date,
    show_tags: window.themeSettings.predictive_card_show_tags,
  };

  if (modalMount) {
    modalProps.settings = JSON.parse(modalMount.dataset.settings);
    modalProps.blocks = JSON.parse(modalMount.dataset.blocks);
    modalProps.form = modalMount.dataset.form;
    modalProps.iconSize = window.themeSettings.icon_size;
    modalProps.iconStrokeWidth = window.themeSettings.icon_stroke_width;
  }
}

fetchProps();

const megamenuApp = (component, props) => createApp(component, props);
const searchApp = (component, props) => createApp(component, props);

var megamenuInit = megamenuApp(MegaMenu, menuProps);
var searchInit = searchApp(SearchMenu, searchProps);

// megamenuInit.mount(megamenuMount);
searchInit.mount(searchMount);

if (modalMount) {
  const modalApp = (component, props) => createApp(component, props);
  var modalInit = modalApp(Modal, modalProps);
  modalInit.mount(modalMount);
}

document.addEventListener("DOMContentLoaded", () => {
  if (JSON.parse(megamenuMount.dataset.settings).enable_sticky_header) {
    const body = document.querySelector("body");
    const header = document.querySelector("#shopify-section-header");
    var ticking = false;

    document.addEventListener("scroll", () => {
      var yPos = window.scrollY * 0.75;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (yPos < window.innerHeight) {
            body.classList.remove("sticky-header-active");
            header.classList.remove("sticky");
          } else {
            body.classList.add("sticky-header-active");
            header.classList.add("sticky");
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
    if (event.detail.sectionId == "header") {
      console.info("testing, hullo there", event);

      // megamenuInit.unmount();
      searchInit.unmount();

      console.log("unmounted");

      searchInit.mount();
      searchInit.render();

      console.log("remounted");

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
