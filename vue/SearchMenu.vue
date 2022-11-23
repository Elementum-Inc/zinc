<template>
  <Popover class="header__search search">
    <PopoverButton class="header__icon-link">
      <span class="icon target align-bottom">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" :width="iconSize" :height="iconSize" fill="none" stroke="#000" :stroke-width="iconStrokeWidth" stroke-linecap="round" stroke-linejoin="round">
          <!--  Atomicons Free 1.00 by @atisalab License - https://atomicons.com/license/ (Icons: CC BY 4.0) Copyright 2021 Atomicons -->
          <circle cx="11" cy="11" r="9" fill="#000" opacity=".25" stroke="none"/>
          <circle cx="11" cy="11" r="9"/>
          <path d="M17.5 17.5 22 22"/>
        </svg>
      </span>
      <span class="label">Search</span>
    </PopoverButton>
    <transition :name="searchPosition">
      <PopoverPanel class="search__popover" :class="[searchPosition]" v-slot="{ close }">
        <form action="/search" method="get" role="search" class="search__form">
          <label for="q" class="sr-only">Search: </label>
          <input name="q" v-model="query" v-debounce:200="predictiveSearchEnabled ? getPredictiveResults() : null" placeholder="Search" class="search__input" />
          <span class="icon target">
            <svg @click="tryClose(close)" :width="iconSize * .75" :height="iconSize * .75" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21.4878 1L1.51221 22" :stroke-width="iconStrokeWidth"/>
              <path d="M22 21.4878L1 1.51221" :stroke-width="iconStrokeWidth"/>
            </svg>
          </span>
        </form>
        <transition name="results">
          <div v-if="query != '' && predictiveSearchEnabled" :style="[searchPosition == 'below' ? { height: resultsHeight + 'px' } : {  }]" class="search__results">
            <div class="search__results--inner">
              <h1 class="sr-only">Search Results</h1>
              <div v-if="trendingSearches" class="search__trends">
                <h2>{{ trends.title }}</h2>
                <div class="search__trends-tags">
                  <a v-for="trend in trends.items" :key="trend.id" :href="trend.url" class="search__trends-tag btn secondary">
                    {{ trend.title }}
                  </a>
                </div>
              </div>
              <div v-if="resultsLength > 0" class="search__results--loaded">
                <TabGroup>
                  <TabList class="search__tabs">
                    <Tab v-if="results.products.length">Products</Tab>
                    <Tab v-if="predictiveShowArticles && results.articles.length">Articles</Tab>
                    <Tab v-if="predictiveShowPages && results.pages.length">Pages</Tab>
                  </TabList>
                  <TabPanels>
                    <transition name="fade">
                      <TabPanel v-if="results.products.length">
                        <div class="search__products shopify-grid product-grid grid--2-col-tablet-down grid--4-col-desktop">
                          <card v-for="product in results.products"
                            :key="product.id"
                            class="grid__item"
                            cardType="product"
                            :card="product"
                            :cardColorScheme="cardSettings.card_color_scheme"
                            :cardBorder="cardSettings.card_border"
                            :cardAspectRatio="cardSettings.card_image_ratio"
                            :cardImageFit="cardSettings.card_image_fit"
                            :cardAnimate="cardSettings.card_hover_animate"
                            :cardAnimation="cardSettings.card_hover_animation"
                            :showVendor="cardSettings.show_vendor"
                            :showPrice="cardSettings.show_price"
                            :themeSettings="themeSettings"></card>
                        </div>
                      </TabPanel>
                    </transition>
                    <transition name="fade">
                      <TabPanel v-if="predictiveShowArticles && results.articles.length">
                        <div class="search__articles shopify-grid product-grid grid--2-col-tablet-down grid--4-col-desktop">
                          <card v-for="article in results.articles"
                            :key="article.id"
                            class="grid__item"
                            cardType="article"
                            :card="article"
                            :cardColorScheme="cardSettings.card_color_scheme"
                            :cardBorder="cardSettings.card_border"
                            :cardAspectRatio="cardSettings.card_image_ratio"
                            :cardImageFit="cardSettings.card_image_fit"
                            :cardAnimate="cardSettings.card_hover_animate"
                            :cardAnimation="cardSettings.card_hover_animation"
                            :showAuthor="cardSettings.show_author"
                            :showDate="cardSettings.show_date"
                            :showTags="cardSettings.show_tags"
                            :themeSettings="themeSettings"></card>
                        </div>
                      </TabPanel>
                    </transition>
                    <transition name="fade">
                      <TabPanel v-if="predictiveShowPages && results.pages.length">
                        <div class="search__pages">
                          <div class="search__page" v-for="page in results.pages" :key="page.id">
                            <a :href="page.url">
                              <h3>{{ page.title }}</h3>
                            </a>
                          </div>
                        </div>
                      </TabPanel>
                    </transition>
                  </TabPanels>
                </TabGroup>
                <div class="search__more">
                  <form action="/search" method="get" role="search">
                    <input name="q" v-model="query" type="hidden" />
                    <button class="btn" type="submit">View More</button>
                  </form>
                </div>
              </div>
              <div v-else class="search__no-results">
                No results found.
              </div>
            </div>
          </div>
        </transition>
      </PopoverPanel>
    </transition>
  </Popover>
</template>

<script>
  import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue';
  import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue';
  import ImageTag from './components/ImageTag.vue';
  import Card from './components/Card.vue';

  export default {
    name: 'SearchMenu',
    components: { Popover, PopoverButton, PopoverPanel, TabGroup, TabList, Tab, TabPanels, TabPanel, ImageTag, Card },
    directives: { debounce },
    data() {
      return {
        query: '',
        trends: null,
        results: null,
        resultsHeight: 0
      }
    },
    props: {
      iconSize: Number,
      iconStrokeWidth: Number,
      searchPosition: String,
      predictiveSearchEnabled: Boolean,
      predictiveShowNumber: Boolean,
      predictiveShowPages: Boolean,
      predictiveShowArticles: Boolean,
      trendingSearches: String,
      cardStyle: String,
      cardAlignment: String,
      cardColorScheme: String,
      cardBorder: Boolean,
      cardRadius: Number,
      cardImageAspect: String,
      cardImageFit: String,
      cardAnimate: Boolean,
      cardAnimation: String,
      cardShowInfoOnHover: Boolean,
      settings: Object,
      themeSettings: Object,
      cardSettings: Object
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
      tryClose(close) {
        if (this.query != '') {
          document.querySelector('[name="q"]').value = '';
          this.query = '';
        } else {
          close();
        }
      },
      calculateResultsOffset() {
        var header = document.querySelector('header');
        var searchForm = document.querySelector('.search__form');

        var total = header.offsetHeight + searchForm.offsetHeight;

        return total;
      },
      async getPredictiveResults() {
        if (this.query && this.query.length > 0) {
          var resourceTypes = ['product','collection'];
  
          if (this.predictiveShowArticles) {
            resourceTypes.push('article');
          }
          if (this.predictiveShowPages) {
            resourceTypes.push('page');
          }
  
          var searchUrl = `${window.routes.predictive_search_url}.json?q=${encodeURIComponent(this.query)}&resources[type]=${encodeURIComponent(resourceTypes.concat(','))}&resources[limit]=4`;
          var search = await fetch(searchUrl).then(response => response.json()).then(data => { return data });
  
          if (search.resources && search.resources.results) {
            this.results = search.resources.results;
          } else {
            this.results = null;
          }
        } else {
          this.results = null;
        }
      },
      async getTrends(handle) {
        try {
          const GET_MENU = {
            query: `
              query {
                menu(handle: "${handle}") {
                  title
                  items {
                    id
                    title
                    url
                  }
                }
              }
            `
          };
          let res = await fetch('/api/2022-07/graphql.json', {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              'X-Shopify-Storefront-Access-Token': '1c34b11ba2613f92ad45fe82bace6f83' // TO-DO: create token on app installation for vue components
            },
            body: JSON.stringify(GET_MENU)
          });
          let json = await res.json();
          this.trends = json.data.menu;
        } catch (error) {
          console.error('Error occurred fetching search trends, please investigate.', error);
        }
      }
    },
    mounted() {
      const header = document.querySelector('header');
      const searchButton = document.querySelector('#searchMenuTop .header__icon-link');

      var observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName == 'aria-expanded') {
            if (searchButton.getAttribute('aria-expanded') == 'true') { // not actually a true boolean so have to compare text values
              document.body.classList.add('search--opened');
              header.classList.add('search--opened');

              if (this.searchPosition == 'below') {
                this.resultsHeight = window.innerHeight - this.calculateResultsOffset();
              }
            } else if (searchButton.getAttribute('aria-expanded') == 'false') {
              document.body.classList.remove('search--opened');
              header.classList.remove('search--opened');
            }
          }
        });
      });

      try {
        observer.observe(searchButton, {
          attributes: true
        });
      } catch (e) {
        console.error('Error during observer creation.')
      }

      if (this.trendingSearches) {
        this.getTrends(this.trendingSearches);
      }
    }
  }
</script>
