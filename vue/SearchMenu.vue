<template>
  <Popover class="header__search search">
    <PopoverButton class="header__icon-link">
      <svg class="icon align-bottom" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" :width="iconSize" :height="iconSize" fill="none" stroke="#000" :stroke-width="iconStrokeWidth" stroke-linecap="round" stroke-linejoin="round">
        &lt;!--!  Atomicons Free 1.00 by @atisalab License - https://atomicons.com/license/ (Icons: CC BY 4.0) Copyright 2021 Atomicons --&gt;
        <circle cx="11" cy="11" r="9" fill="#000" opacity=".25" stroke="none"/>
        <circle cx="11" cy="11" r="9"/>
        <path d="M17.5 17.5 22 22"/>
      </svg>
      <span class="label">Search</span>
    </PopoverButton>
    <transition :name="searchPosition">
      <PopoverPanel class="search__popover" :class="[searchPosition, headerColorScheme]">
        <form action="/search" method="get" role="search" class="search__input">
          <input v-model="query" v-debounce:200="predictiveSearchEnabled ? getPredictiveResults() : null" placeholder="Search" />
        </form>
        <!-- trending searches -->
        <div v-if="false">
          trending search buttons will go here
        </div>
        <transition name="results">
          <div v-if="query != '' && predictiveSearchEnabled && resultsLength > 0" class="search__results">
            <div class="search__results--inner">
              <div v-if="predictiveShowNumber">
                {{ resultsLength }} Results
              </div>
              <TabGroup>
                <TabList class="tabs">
                  <Tab v-if="results.products.length">Products ( {{ results.products.length }} )</Tab>
                  <Tab v-if="predictiveShowPages && results.pages.length">Pages ( {{ results.pages.length }} )</Tab>
                  <Tab v-if="predictiveShowArticles && results.articles.length">Articles ( {{ results.articles.length }} )</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel v-if="results.products.length">
                    <div v-for="product in results.products" :key="product.id">
                      <a :href="product.url">
                        <img :src="product.featured_image.url" :alt="product.featured_image.alt" />
                        <span>
                          {{ product.title }}
                        </span>
                      </a>
                    </div>
                  </TabPanel>
                  <TabPanel v-if="predictiveShowPages && results.pages.length">
                    <div v-for="page in results.pages" :key="page.id">
                      <a :href="page.url">
                        <h3>
                          {{ page.title }}
                        </h3>
                      </a>
                    </div>
                  </TabPanel>
                  <TabPanel v-if="predictiveShowArticles && results.articles.length">
                    <div v-for="article in results.articles" :key="article.id">
                      <a :href="article.url">
                        <h3>
                          {{ article.title }}
                        </h3>
                      </a>
                    </div>
                  </TabPanel>
                </TabPanels>
              </TabGroup>
              <!-- view more -->
            </div>
          </div>
        </transition>
      </PopoverPanel>
    </transition>
  </Popover>
</template>

<style lang="postcss" scoped>
  .search__popover {
    @apply absolute left-0 w-full bg-primary text-secondary;

    &.secondary {
      @apply bg-secondary text-primary;
    }
  }

  .search__results {
    background-color: inherit;
    color: inherit;
  }

  .search__results--inner {
    @apply container lg:container-md xl:container-lg mx-auto py-8;
  }

  .tabs {
    @apply text-center;

    & > button {
      @apply text-lg mx-4;
    }
  }

  .over {
    @apply top-0 h-full;

    & .search__input {
      @apply h-full w-full;

      & input {
        @apply relative block top-1/2 transform -translate-y-1/2 bg-bg2 border-b border-secondary w-1/3 m-auto p-sm;
      }
    }

    & .search__results {
      @apply w-full;
    }
  }

  .over-enter-active,
  .over-leave-active {
    @apply transition transform;
  }

  .over-enter-active {
    @apply ease-in duration-300;
  }

  .over-leave-active {
    @apply ease-out duration-220;
  }

  .over-enter-to,
  .over-leave-from {
    @apply opacity-100 translate-y-0;
  }

  .over-enter-from,
  .over-leave-to {
    @apply opacity-0 -translate-y-full;
  }
  
  .below {
    @apply left-0 top-full;
  }

  .below-enter-active,
  .below-leave-active {
    @apply transition transform;
  }

  .below-enter-active {
    @apply ease-in duration-300;
  }

  .below-leave-active {
    @apply ease-out duration-220;
  }

  .below-enter-to,
  .below-leave-from {
    @apply translate-y-0;
  }

  .below-enter-from,
  .below-leave-to {
    @apply -translate-y-full;
  }

  .results-enter-active,
  .results-leave-active {
    @apply transition transform relative -z-1;
  }

  .results-enter-active {
    @apply ease-in duration-200;
  }

  .results-leave-active {
    @apply ease-out duration-300;
  }

  .results-enter-to,
  .results-leave-from {
    @apply translate-y-0;
  }

  .results-enter-from,
  .results-leave-to {
    @apply -translate-y-full;
  }
</style>

<script>
  import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue';
  import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue';

  export default {
    name: 'SearchMenu',
    components: { Popover, PopoverButton, PopoverPanel, TabGroup, TabList, Tab, TabPanels, TabPanel },
    directives: { debounce },
    data() {
      return {
        query: '',
        results: null,
      }
    },
    props: {
      iconSize: Number,
      iconStrokeWidth: Number,
      headerColorScheme: String,
      searchPosition: String,
      predictiveSearchEnabled: Boolean,
      predictiveShowNumber: Boolean,
      predictiveShowPages: Boolean,
      predictiveShowArticles: Boolean,
    },
    computed: {
      resultsLength() {
        if (this.results) {
          return this.results.products.length + this.results.pages.length + this.results.articles.length;
        } else {
          return 0;
        }
      }
    },
    methods: {
      async getPredictiveResults() {
        if (this.query && this.query.length > 0) {
          var resourceTypes = ['product','collection'];
  
          if (this.predictiveShowArticles) {
            resourceTypes.push('article');
          }
          if (this.predictiveShowPages) {
            resourceTypes.push('page');
          }
  
          var searchUrl = `${window.routes.predictive_search_url}.json?q=${encodeURIComponent(this.query)}&resources[type]=${encodeURIComponent(resourceTypes.concat(','))}`;
          var search = await fetch(searchUrl).then(response => response.json()).then(data => { return data });
  
          if (search.resources && search.resources.results) {
            this.results = search.resources.results;
          } else {
            this.results = null;
          }
        } else {
          this.results = null;
        }
      }
    },
    mounted() {
      const header = document.querySelector('header');
      const searchButton = document.querySelector('#searchMenuTop .header__icon-link');

      var observer = new MutationObserver(function(mutations) {
        mutations.forEach(mutation => {
          if (mutation.attributeName == 'aria-expanded') {
            if (searchButton.getAttribute('aria-expanded') == 'true') { // not actually a true boolean so have to compare text values
              document.body.classList.add('search--opened');
              header.classList.add('search--opened');
            } else if (searchButton.getAttribute('aria-expanded') == 'false') {
              document.body.classList.remove('search--opened');
              header.classList.remove('search--opened');
            }
          }
        });
      });

      observer.observe(searchButton, {
        attributes: true
      });
    }
  }
</script>
