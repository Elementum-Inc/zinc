<template>
  <Popover class="header__search">
    <PopoverButton class="header__icon-link">
      <svg class="icon align-bottom" :class="strokeColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" :width="iconSize" :height="iconSize" fill="none" stroke="#000" :stroke-width="iconStrokeWidth" stroke-linecap="round" stroke-linejoin="round">
        &lt;!--!  Atomicons Free 1.00 by @atisalab License - https://atomicons.com/license/ (Icons: CC BY 4.0) Copyright 2021 Atomicons --&gt;
        <circle :class="fillColor" cx="11" cy="11" r="9" fill="#000" opacity=".25" stroke="none"/>
        <circle cx="11" cy="11" r="9"/>
        <path d="M17.5 17.5 22 22"/>
      </svg>
      <span class="label">Search</span>
    </PopoverButton>
    <PopoverPanel class="header__search-popover" :class="[searchPosition, bgColor, textColor]">
      <input type="text" :value="terms" placeholder="Search" />
    </PopoverPanel>
  </Popover>
</template>

<style scoped>
  .header__search-popover {
    @apply absolute left-0 w-full;
  }

  .over {
    @apply top-0 h-full;
  }
  
  .below {
    @apply left-0 top-full;
  }
</style>

<script setup>
  import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
</script>

<script>
export default {
  name: 'SearchMenu',
  data() {
    return {
      bgColor: '',
      textColor: '',
      strokeColor: '',
      fillColor: '',
    }
  },
  props: {
    searchPosition: String,
    predictiveSearchEnabled: Boolean,
    predictiveShowNumber: Boolean,
    predictiveShowPages: Boolean,
    predictiveShowArticles: Boolean,
    iconSize: Number,
    iconStrokeWidth: Number,
    terms: String,
  },
  mounted() {
    switch (this.$attrs.headerColorScheme) {
      case 'primary':
        this.bgColor = 'bg-primary';
        this.textColor = 'text-secondary';
        this.strokeColor = 'stroke-secondary';
        this.fillColor = 'fill-none';
      case 'secondary':
        this.bgColor = 'bg-secondary';
        this.textColor = 'text-primary';
        this.strokeColor = 'stroke-primary';
        this.fillColor = 'fill-none';
      case 'accent1':
        this.bgColor = 'bg-primary';
        this.textColor = 'text-secondary';
        this.strokeColor = 'stroke-secondary';
        this.fillColor = 'fill-accent1';
      case 'accent2':
        this.bgColor = 'bg-primary';
        this.textColor = 'text-secondary';
        this.strokeColor = 'stroke-secondary';
        this.fillColor = 'fill-accent2';
    }
  }
}
</script>
