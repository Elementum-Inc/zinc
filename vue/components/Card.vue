<template>
  <div v-if="cardProduct" class="card-wrapper underline-links-hover">
    <div class="card gradient" :class="[`color-scheme--${cardColorScheme}`,
      cardProduct.featured_image ? 'card--media' : 'card--text',
      cardAnimate ? cardAnimation : '',
      cardBorder ? 'border border-scheme-fg' : '']"
    >
      <div class="card__inner gradient" :class="cardAspectRatio">
        <div v-if="cardProduct.featured_image" class="card__media">
          <div class="media media--transparent media--hover-effect">
            <image-tag :src="cardProduct.featured_image"
                        width="300"
                        sizes="(min-width: 1280px) calc((100vw - 130px) / 4), (min-width: 750px) calc((100vw - 120px) / 3), calc((100vw - 35px) / 2)"
                        :srcsetWidths="[cardProduct.featured_image.width >= 165 ? 165 : '',
                                        cardProduct.featured_image.width >= 360 ? 360 : '',
                                        cardProduct.featured_image.width >= 533 ? 533 : '',
                                        cardProduct.featured_image.width >= 720 ? 720 : '',
                                        cardProduct.featured_image.width >= 940 ? 940 : '',
                                        cardProduct.featured_image.width >= 1066 ? 1066 : '']"
                        :alt="cardProduct.featured_image.alt"
                        class="card__image"
                        :class="[cardAspectRatio, cardImageFit]">
            </image-tag>
          </div>
        </div>
      </div>
      <div class="card__content">
        <div class="card__information">
          <h3 class="card__heading">
            <a :href="cardProduct.url"
                class="full-unstyled-link">
              {{ cardProduct.title }}
            </a>
          </h3>
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
    cardProduct: Object,
    cardColorScheme: String,
    cardAspectRatio: String,
    cardImageFit: String,
    showSecondaryImage: Boolean,
    cardAnimate: Boolean,
    cardAnimation: String,
    cardBorder: Boolean
  }
}
</script>
