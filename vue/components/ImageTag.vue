<template>
  <img
    :srcset="formattedSrcSet"
    :src="formattedSrc"
    :sizes="sizes"
    :alt="alt"
    :preload="preload"
    :width="width"
    :height="height"
    :class="classes" />
</template>

<style>

</style>

<script>
export default {
  name: 'ImageTag',
  props: {
    src: {
      type: Object,
      required: true
    },
    height: String,
    width: {
      type: String,
      default(rawProps) {
        return rawProps.src.width
      }
    },
    sizes: String,
    srcsetWidths: {
      type: Array,
      default(rawProps) {
        return [rawProps.width]
      }
    },
    srcset: String,
    preload: {
      type: Boolean,
      default: false
    },
    alt: {
      type: String,
      default(rawProps) {
        return rawProps.src.alt;
      }
    },
    classes: String
  },
  computed: {
    formattedSrc() {
      return `${this.src.url ? this.src.url : this.src.src}&width=${this.width}`;
    },
    formattedSrcSet() {
      var srcset = '';

      this.srcsetWidths.forEach(w => {
        srcset += `${this.src.url ? this.src.url : this.src.src}&width=${w} ${w}w,`;
      });

      return srcset;
    }
  }
}
</script>
