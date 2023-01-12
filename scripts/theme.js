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
import "../styles/layout/footer.css";

// Pages 
import("../styles/pages/account.css");

// Sections
import("../styles/sections/blog.css");
import("../styles/sections/image-with-text.css");
import("../styles/sections/hero.css");
import("../styles/sections/modal.css");
import("../styles/sections/collapsible-content.css");
import("../styles/sections/contact-content.css");
import("../styles/sections/contact-form.css");
import("../styles/sections/featured-collection.css");
import("../styles/sections/film-strip.css");
import("../styles/sections/hero-slideshow.css");
import("../styles/sections/media-collage.css");
import("../styles/sections/multicolumn.css");
import("../styles/sections/quick-add.css");
import("../styles/sections/testimonials.css");

//Components
import("../styles/components/accordion.css");
import("../styles/components/cart-drawer.css");
import("../styles/components/cart-items.css");
import("../styles/components/cart.css");

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

document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector("#header").classList.contains("sticky")) {
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
