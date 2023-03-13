<template>
  <Popover class="header__search search">
    <PopoverButton class="header__icon-link">
      <span class="icon target align-bottom">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" :width="iconSize" :height="iconSize" fill="none" stroke="currentColor" :stroke-width="iconStrokeWidth" stroke-linecap="round" stroke-linejoin="round">
          <!--  Atomicons Free 1.00 by @atisalab License - https://atomicons.com/license/ (Icons: CC BY 4.0) Copyright 2021 Atomicons -->
          <circle cx="11" cy="11" r="9" fill="currentColor" opacity=".25" stroke="none"/>
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
                <h2>{{ trendingSearches.title }}</h2>
                <div class="search__trends-tags">
                  <a v-for="trend in trendingSearches.links" :key="trend.id" :href="trend.url" class="search__trends-tag btn secondary btn--small">
                    <span class="btn__label">
                      {{ trend.title }}
                    </span>
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
                            :cardColorScheme="cardColorScheme"
                            :cardBorder="cardBorder"
                            :cardAspectRatio="cardImageAspect"
                            :cardImageFit="cardImageFit"
                            :cardAnimate="cardAnimate"
                            :cardAnimation="cardAnimation"
                            :showVendor="cardShowVendor"
                            :showPrice="cardShowPrice"
                            :badgePosition="badgePosition"
                            :soldOutColor="soldOutColor"
                            :saleColor="saleColor"
                            :currencyCodeEnabled="currencyCodeEnabled"></card>
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
                            :cardColorScheme="cardColorScheme"
                            :cardBorder="cardBorder"
                            :cardAspectRatio="cardImageAspect"
                            :cardImageFit="cardImageFit"
                            :cardAnimate="cardAnimate"
                            :cardAnimation="cardAnimation"
                            :showAuthor="cardShowAuthor"
                            :showDate="cardShowDate"
                            :showTags="cardShowTags"
                            :badgePosition="badgePosition"
                            :soldOutColor="soldOutColor"
                            :saleColor="saleColor"
                            :currencyCodeEnabled="currencyCodeEnabled"></card>
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
                    <button class="btn" type="submit">
                      <span class="btn__label">
                        View More
                      </span>
                    </button>
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
        results: null,
        resultsHeight: 0
      }
    },
    props: {
      iconSize: Number,
      iconStrokeWidth: Number,
      searchPosition: String,
      predictiveSearchEnabled: Boolean,
      predictiveShowPages: Boolean,
      predictiveShowArticles: Boolean,
      trendingSearches: Object,
      cardColorScheme: String,
      cardBorder: Boolean,
      cardRadius: Number,
      cardImageAspect: String,
      cardImageFit: String,
      cardAnimate: Boolean,
      cardAnimation: String,
      cardShowVendor: Boolean,
      cardShowPrice: Boolean,
      cardShowAuthor: Boolean,
      cardShowDate: Boolean,
      cardShowTags: Boolean,
      badgePosition: String,
      soldOutColor: String,
      saleColor: String,
      currencyCodeEnabled: Boolean,
      accountRoute: String
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
        console.error(e);
      }
    }
  }
</script>
