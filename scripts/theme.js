import "vite/modulepreload-polyfill";

// Splide
import Splide from '@splidejs/splide';
import '@splidejs/splide/css';

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
import("../styles/sections/hero.css");
import("../styles/sections/image-with-text.css");
import("../styles/sections/featured-collection.css");
import("../styles/sections/blog.css");
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

// Vue components
import "./vue/vue-loader";

document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector('#header').classList.contains('sticky')) {
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

  if (document.querySelectorAll('.splide').length) {
    document.querySelectorAll('.splide').forEach(slider => {
      if (!slider.parentElement.classList.contains('product__media-gallery')) {
        new Splide(slider).mount();
      }
    });
  }

  if (document.querySelector('.product__media-gallery')) {
    var gallery = new Splide(document.querySelector('[id*=GalleryViewer]'));
    var thumbnails = new Splide(document.querySelector('[id*=GalleryThumbnails]'));

    if (thumbnails != null || undefined) {
      gallery.sync(thumbnails);
      gallery.mount();
      thumbnails.mount();
    } else {
      gallery.mount();
    }
  }

  if (Shopify.designMode) {
    document.addEventListener("shopify:section:load", event => {
      let slider = event.target.querySelector('.splide');

      if (slider) {
        new Splide(slider).mount();
      }
    });
  }
});
