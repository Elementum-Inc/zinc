<template>
  <div class="card-wrapper underline-links-hover" v-if="card">
    <div class="card"
      :class="[
        card.featured_image ? 'card--media' : 'card--text',
        cardAnimate ? cardAnimation : '',
        `color-scheme--${cardColorScheme}`,
        cardBorder ? 'border border-scheme-fg' : '',
        cardType == 'article' ? 'article-card' : ''
      ]"
    >
      <div class="card__inner ratio"
        :class="[cardAspectRatio]"
        :style="[`--ratio-percent: ${ratio}%`]">
        <div class="card__media" v-if="card.featured_image">
          <div class="media media--transparent">
            <img
              :srcset="[
                card.featured_image.width >= 165 ? `${card.featured_image.url} 165w,` : '',
                card.featured_image.width >= 360 ? `${card.featured_image.url} 360w,` : '',
                card.featured_image.width >= 533 ? `${card.featured_image.url} 533w,` : '',
                card.featured_image.width >= 720 ? `${card.featured_image.url} 720w,` : '',
                card.featured_image.width >= 940 ? `${card.featured_image.url} 940w,` : '',
                card.featured_image.width >= 1066 ? `${card.featured_image.url} 1066w,` : '',
                `${card.featured_image.url} ${card.featured_image.width}w`
              ]"
              :src="card.featured_image"
              sizes="(min-width: 1280px) calc((100vw - 130px) / 4), (min-width: 768px) calc((100vw - 120px) / 3), calc((100vw - 35px) / 2)"
              :alt="card.featured_image.alt"
              class="card__image"
              :class="[
                cardAspectRatio,
                cardImageFit
              ]"
              :loading="[lazyLoad ? 'lazy' : '']"
              :width="card.featured_image.width"
              :height="card.featured_image.height"
            >
          </div>
        </div>
        <div class="card__content">
          <div class="card__information" v-if="card.featured_image == null">
            <h3 class="card__heading" :id="[`title-SearchModal-${card.id}`]">
              <a :href="card.url" :id="[`StandardCardNoMediaLink-SearchModal-${card.id}`]" class="full-unstyled-link" :aria-labelledby="[`StandardCardNoMediaLink-SearchModal-${card.id}`, `NoMediaStandardBadge-SearchModal-${card.id}`]">
                {{ card.title }}
              </a>
            </h3>
          </div>
          <div class="card__badge" :class="badgePosition">
              <span v-if="card.available == false"
                :id="[`NoMediaStandardBadge-SearchModal-${card.id}`]"
                class="badge badge--bottom-left btn"
                :class="[`btn-${soldOutColor}`]">
                <span class="btn__label">
                  Sold Out
                </span>
              </span>
              <span v-if="card.compare_at_price > card.price && card.available"
                :id="[`NoMediaStandardBadge-SearchModal-${card.id}`]"
                class="badge badge--bottom-left btn"
                :class="[`btn-${saleColor}`]">
                <span class="btn__label">
                  On Sale
                </span>
              </span>
          </div>
        </div>
      </div>

      <div class="card__content">
        <div class="card__information">
          <div class="card-information before" v-if="cardType == 'article'">
            <div class="article-card__header caption-spaced h5">
              <span v-if="showTags && card.tags.size > 0">{{ card.tags.join(', ').substring(0, 25) }}</span>
              <span v-if="showDate">{{ formattedDate }}</span>
              <span v-if="showAuthor">{{ card.author }}</span>
            </div>
          </div>
          <h3 class="card__heading" :id="[`title-SearchModal-${card.id}`]">
            <a :href="card.url"
              :id="[`CardLink-SearchModal-${card.id}`]"
              class="full-unstyled-link"
              :aria-labelledby="[`CardLink-SearchModal-${card.id}`, `Badge-SearchModal-${card.id}`]">
              {{ cardType == 'article' ? card.title.length > 40 ? card.title.substring(0, 30).concat('...') : card.title : card.title }}
            </a>
          </h3>
          <div class="card-information">
            <div class="vendor" v-if="cardType == 'product' && showVendor">
              <span class="visually-hidden">Vendor:</span>
              <div class="caption-spaced light">{{ card.vendor }}</div>
            </div>
            <div class="price" v-if="cardType == 'product' && showPrice">
              <div class="price__container">
                <div class="price__regular">
                  <span class="visually-hidden visually-hidden--inline">Regular price</span>
                  <span class="price-item price-item--regular">
                    {{ regularPrice }}
                  </span>
                </div>
                <div class="price__sale">
                  <div v-if="card.price_varies && card.compare_at_price_varies == false">
                    <span class="visually-hidden visually-hidden--inline">Regular price</span>
                    <span>
                      <s class="price-item price-item--regular">
                        {{ regularPrice }}
                      </s>
                    </span>
                  </div>
                  <span class="visually-hidden visually-hidden--inline">Sale price</span>
                  <span class="price-item price-item--sale price-item--last">
                    {{ compareAtPrice }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="card-wrapper underline-links-hover" v-else>
    <div class="card card--text"
      :class="[`color-scheme--${cardColorScheme}`]"
    >
      <div class="card__inner">
        <div class="card__content">
          <div class="card__information">
            <h3 class="card__heading">
              <a role="link" aria-disabled="true" class="full-unstyled-link">
                Example Product Title
              </a>
            </h3>
          </div>
        </div>
      </div>
      <div class="card__content">
        <div class="card__information">
          <h3 class="card__heading">
            <a role="link" aria-disabled="true" class="full-unstyled-link">
                Example Product Title
            </a>
          </h3>
          <div class="card-information">
            <div v-if="showVendor">
              <span class="visually-hidden">Vendor</span>
              <div class="caption-spaced light">Shopify</div>
            </div>
            <div class="price" v-if="showPrice">
              <div class="price__container">
                <div class="price__regular">
                  <span class="visually-hidden visually-hidden--inline">Regular price</span>
                  <span class="price-item price-item--regular">
                    {{ regularPrice }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ImageTag from './ImageTag.vue';

export default {
  name: 'Card',
  components: { ImageTag },
  props: {
    cardType: String,
    card: Object,
    cardColorScheme: String,
    cardAspectRatio: String,
    cardImageFit: String,
    cardAnimate: Boolean,
    cardAnimation: String,
    cardBorder: Boolean,
    showVendor: Boolean,
    showPrice: Boolean,
    showAuthor: Boolean,
    showDate: Boolean,
    showTags: Boolean,
    lazyLoad: Boolean,
    badgePosition: String,
    soldOutColor: String,
    saleColor: String,
    currencyCodeEnabled: Boolean,
  },
  computed: {
    ratio() {
      switch (this.cardAspectRatio) {
        case 'lportrait':
          var ratio = 0.5625;
        case 'sportrait':
          var ratio = 0.67;
        case 'widescreen':
          var ratio = 1.77;
        case 'landscape':
          var ratio = 1.5;
        case 'square':
          var ratio = 1;
        case 'auto':
          var ratio = this.card.featured_image.aspect_ratio;
        default:
          var ratio = 1;

        return ((1 / ratio) * 100);
      }
    },
    regularPrice() {
      var price = this.card.price || 1999;
      var money_price = new Intl.NumberFormat(`${window.Shopify.locale}-${window.Shopify.country}`, { style: 'currency', currency: window.Shopify.currency.active }).format(price)

      if (this.currencyCodeEnabled) {
        var money_price = money_price + ` ${window.Shopify.currency.active}`
      }

      if (this.card.price_varies) {
        var money_price = 'From ' + money_price;
      }

      return money_price;
    },
    compareAtPrice() {
      var compare_at_price = this.card.compare_at_price;

      if (compare_at_price) {
        var money_price = new Intl.NumberFormat(`${window.Shopify.locale}-${window.Shopify.country}`, { style: 'currency', currency: window.Shopify.currency.active }).format(compare_at_price)
  
        if (this.currencyCodeEnabled) {
          var money_price = money_price + ` ${window.Shopify.currency.active}`
        }
  
        return money_price;
      }

      return false;
    },
    formattedDate() {
      return new Date(this.card.published_at).toLocaleDateString(`${window.Shopify.locale}-${window.Shopify.country}`, { month: 'long', day: 'numeric', year: 'numeric' });
    }
  }
}
</script>
