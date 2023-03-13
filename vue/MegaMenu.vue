<template>
  <Popover>
    <PopoverButton class="header__menu-trigger" name="menu-open__trigger" aria-label="Open  Menu" :class="{ 'hide-desktop' : !settings.collapse_menu_desktop }">
      <span class="icon target">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" :width="iconSize" :height="iconSize" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
          <!--  Atomicons Free 1.00 by @atisalab License - https://atomicons.com/license/ (Icons: CC BY 4.0) Copyright 2021 Atomicons -->
          <path d="M21 18H3M21 12H3M21 6H3"/>
        </svg>
      </span>
    </PopoverButton>
    <!-- mobile -->
    <transition name="slideRight" v-if="screen < 1024">
      <PopoverPanel as="nav"  class="header__menu-collapsed" :class="[`color-scheme--${settings.mm_color_scheme}`]" v-slot="{ close }">
        <div class="mobile-header">
          <button name="menu-close_trigger" aria-label="Close Menu" @click="close()">
            <span class="icon target">
              <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" role="presentation" fill="none" viewBox="0 0 10 10" :width="iconSize" :height="iconSize">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M1 4.51a.5.5 0 000 1h3.5l.01 3.5a.5.5 0 001-.01V5.5l3.5-.01a.5.5 0 00-.01-1H5.5L5.49.99a.5.5 0 00-1 .01v3.5l-3.5.01H1z" fill="currentColor" />
              </svg>
            </span>
          </button>
          <!-- logo -->
        </div>
        <div class="submenus">
          <Disclosure v-slot="{ open }" v-for="(link, index) in topMenu" :key="link.id">
            <div class="submenu" :class="open ? 'opened' : ''">
              <DisclosureButton :name="[`top-link_trigger_${index}`]" class="submenu__top-link">
                <a :href="link.url">
                  {{ link.title }}
                </a>
                <span v-if="link.links.length" class="icon target expand">
                  <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" role="presentation" class="stroke-scheme-text" fill="none" viewBox="0 0 18 17" :height="iconSize" :width="iconSize" :stroke-width="iconStrokeWidth">
                    <path d="M.865 15.978a.5.5 0 00.707.707l7.433-7.431 7.579 7.282a.501.501 0 00.846-.37.5.5 0 00-.153-.351L9.712 8.546l7.417-7.416a.5.5 0 10-.707-.708L8.991 7.853 1.413.573a.5.5 0 10-.693.72l7.563 7.268-7.418 7.417z" fill="currentColor"></path>
                  </svg>
                </span>
              </DisclosureButton>
              <transition name="slideDown" v-if="link.links.length">
                <DisclosurePanel class="submenu__links">
                  <Disclosure as="div" v-for="(child, index) in link.links" :key="index + 1">
                    <DisclosureButton :name="[`level1-link_trigger_${index}`]" class="submenu__level1">
                      <a :href="child.url">
                        {{ child.title }}
                      </a>
                      <span v-if="child.links.length" class="icon target expand">
                        <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" role="presentation" class="stroke-scheme-text" fill="none" viewBox="0 0 18 17" :height="iconSize" :width="iconSize" :stroke-width="iconStrokeWidth">
                          <path d="M.865 15.978a.5.5 0 00.707.707l7.433-7.431 7.579 7.282a.501.501 0 00.846-.37.5.5 0 00-.153-.351L9.712 8.546l7.417-7.416a.5.5 0 10-.707-.708L8.991 7.853 1.413.573a.5.5 0 10-.693.72l7.563 7.268-7.418 7.417z" fill="currentColor"></path>
                        </svg>
                      </span>
                    </DisclosureButton>
                    <transition name="slideDown" v-if="child.links.length">
                      <DisclosurePanel>
                        <ul>
                          <li v-for="grandchild in child.links" :key="grandchild.id" class="submenu__level2">
                            {{ grandchild.title }}
                          </li>
                        </ul>
                      </DisclosurePanel>
                    </transition>
                  </Disclosure>
                </DisclosurePanel>
              </transition>
            </div>
          </Disclosure>
        </div>
        <div v-if="mobileLinks.length" class="mobile-links">
          <a v-for="link in mobileLinks" :key="link.id" :href="link.url">
            {{ link.title }}
          </a>
        </div>
        <div class="mobile-footer">
          <a :href="accountRoute">
            Account
            <span class="icon target">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" :width="iconSize" :height="iconSize" fill="none" stroke="currentColor" :stroke-width="iconStrokeWidth" stroke-linecap="round" stroke-linejoin="round">
                <!--  Atomicons Free 1.00 by @atisalab License - https://atomicons.com/license/ (Icons: CC BY 4.0) Copyright 2021 Atomicons -->
                <circle cx="12" cy="6" r="4" fill="currentColor" opacity=".25" stroke="none"/>
                <circle cx="12" cy="6" r="4"/>
                <path d="M17.67 22a2 2 0 0 0 1.92-2.56A7.8 7.8 0 0 0 12 14a7.8 7.8 0 0 0-7.59 5.44A2 2 0 0 0 6.34 22Z" fill="currentColor" opacity=".25" stroke="none"/>
                <path d="M17.67 22a2 2 0 0 0 1.92-2.56A7.8 7.8 0 0 0 12 14a7.8 7.8 0 0 0-7.59 5.44A2 2 0 0 0 6.34 22Z"/>
              </svg>
            </span>
          </a>
        </div>
      </PopoverPanel>
    </transition>
    <!-- desktop -->
    <transition name="slideRight" v-else>
      <PopoverPanel :static="!settings.collapse_menu_desktop">
        <PopoverGroup as="nav" class="header__menu-top" :class="[`color-scheme--${settings.mm_color_scheme}`, settings.collapse_menu_desktop ? 'collapsed' : '']">
          <Popover v-for="link in topMenu" :key="link.id" class="top-link">
            <a v-if="(!link.blocks || !link.blocks.length) && (!link.links || !link.links.length)" :href="link.url">
              {{ link.title }}
            </a>
            <PopoverButton v-else as="a" :href="link.url">
              {{ link.title }}
            </PopoverButton>
            <transition name="slideDown">
              <PopoverPanel v-if="link.blocks && link.blocks.length" class="header__menu-content" :class="[settings.mm_type]">
                <div v-for="block in link.blocks" :key="block.id" class="submenu-block" :class="[block.type, block.type == 'menu' ? `images-${block.settings.submenu_item_image}` : '']">
                  <div v-if="block.type == 'menu'" :class="[`images-${block.settings.submenu_item_image}__inner`, `${block.type}__inner`, `color-scheme--${settings.mm_color_scheme}`]">
                    <h4 v-if="block.settings.submenu_title != ''">{{ block.settings.submenu_title }}</h4>
                    <h4 v-else>{{ block.settings.submenu.title }}</h4>
                    <ul class="menu__level0">
                      <Disclosure as="li" v-for="link in block.settings.submenu" :key="link.id">
                        <DisclosureButton v-if="link.links.length" class="menu__top-link parent">
                          <transition name="fade" appear>
                            <image-tag v-if="link.object && link.object.image && block.settings.submenu_item_image != 'none'" :src="link.object.image"
                                        width="320"
                                        sizes="320px"
                                        :srcsetWidths="[320]"
                                        class="menu__image"></image-tag>
  
                          </transition>
                          <a v-if="settings.mm_toplink_behavior == 'parent_link'" :href="link.url">
                            <span>
                              {{ link.title }}
                            </span>
                          </a>
                          <span v-else>
                            {{ link.title }}
                          </span>
                          <span v-if="settings.mm_enable_caret" class="icon target expand">
                            <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" role="presentation" class="stroke-scheme-text" fill="none" viewBox="0 0 18 17" :height="iconSize" :width="iconSize" :stroke-width="iconStrokeWidth">
                              <path d="M.865 15.978a.5.5 0 00.707.707l7.433-7.431 7.579 7.282a.501.501 0 00.846-.37.5.5 0 00-.153-.351L9.712 8.546l7.417-7.416a.5.5 0 10-.707-.708L8.991 7.853 1.413.573a.5.5 0 10-.693.72l7.563 7.268-7.418 7.417z" fill="currentColor"></path>
                            </svg>
                          </span>
                        </DisclosureButton>
                        <a v-else :href="link.url" class="menu__top-link">
                          <transition name="fade" appear>
                            <image-tag v-if="link.object && link.object.image && block.settings.submenu_item_image != 'none'" :src="link.object.image"
                                        width="320"
                                        sizes="320px"
                                        :srcsetWidths="[320]"
                                        class="menu__image"></image-tag>
  
                          </transition>
                          <span>
                            {{ link.title }}
                          </span>
                        </a>
                        <transition name="slideDown" v-if="link.links.length">
                          <DisclosurePanel as="ul" class="menu__level1">
                            <li v-if="settings.mm_toplink_behavior == 'view_all_link'" class="menu__view-all">
                              <a :href="link.url">
                                All {{ link.title }}
                              </a>
                            </li>
                            <Disclosure as="li" v-for="child in link.links" :key="child.id">
                              <DisclosureButton v-if="child.links.length" class="parent">
                                <a v-if="settings.mm_toplink_behavior == 'parent_link'" :href="child.url">
                                  {{ child.title }}
                                </a>
                                <span v-else>
                                  {{ child.title }}
                                </span>
                                <span v-if="settings.mm_enable_caret" class="icon expand">      
                                  <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" role="presentation" class="stroke-scheme-text" fill="none" viewBox="0 0 18 17" :height="iconSize" :width="iconSize" :stroke-width="iconStrokeWidth">
                                    <path d="M.865 15.978a.5.5 0 00.707.707l7.433-7.431 7.579 7.282a.501.501 0 00.846-.37.5.5 0 00-.153-.351L9.712 8.546l7.417-7.416a.5.5 0 10-.707-.708L8.991 7.853 1.413.573a.5.5 0 10-.693.72l7.563 7.268-7.418 7.417z" fill="currentColor"></path>
                                  </svg>
                                </span>
                              </DisclosureButton>
                              <a v-else :href="child.url">
                                {{ child.title }}
                              </a>
                              <transition name="slideDown" v-if="child.links.length">
                                <DisclosurePanel as="ul" class="menu__level2">
                                  <li v-if="settings.mm_toplink_behavior == 'view_all_link'" class="menu__view-all">
                                    <a :href="child.url">
                                      All {{ child.title }}
                                    </a>
                                  </li>
                                  <li v-for="grandchild in child.links" :key="grandchild.id">
                                    <a :href="grandchild.url">
                                      {{ grandchild.title }}
                                    </a>
                                  </li>
                                </DisclosurePanel>
                              </transition>
                            </Disclosure>
                          </DisclosurePanel>
                        </transition>
                      </Disclosure>
                    </ul>
                  </div>
                  <div v-else-if="block.type == 'image_content'" :class="[`${block.type}__inner`]">
                    <div class="image_content__image-container">
                      <image-tag v-if="block.settings.image" :src="block.settings.image"
                                  width="960"
                                  sizes="(min-width: 1440px) 960px, (min-width: 1280px) 640px, 320px"
                                  :srcsetWidths="[960, 640, 320]"
                                  class="image_content__image"></image-tag>
                    </div>
                    <div class="image_content__content"
                      :class="[block.settings.image ? 'float' : '']"
                      v-if="block.settings.content_title ||
                        block.settings.content_subtitle ||
                        block.settings.content ||
                        (block.settings.primary_button_label && block.settings.primary_button_url) ||
                        (block.settings.secondary_button_label && block.settings.secondary_button_url)"
                    >
                      <h2 v-if="block.settings.content_title" :class="block.settings.content_title_size">{{ block.settings.content_title }}</h2>
                      <h4 v-if="block.settings.content_subtitle" :class="block.settings.content_subtitle_size">{{ block.settings.content_subtitle }}</h4>
                      <div v-if="block.settings.content">{{ block.settings.content }}</div>
                      <div class="buttons" :class="[`color-scheme--${settings.mm_color_scheme}`]">
                        <a v-if="block.settings.primary_button_label && block.settings.primary_button_url" :href="block.settings.primary_button_url" class="btn primary" :class="[`btn-${block.settings.button_style}`, block.settings.button_reverse ? 'order-2' : '']">
                          <span class="btn__label">
                            {{ block.settings.primary_button_label }}
                          </span>
                        </a>
                        <a v-if="block.settings.secondary_button_label && block.settings.secondary_button_url" :href="block.settings.secondary_button_url" class="btn secondary" :class="[`btn-${block.settings.button_style}`]">
                          <span class="btn__label">
                            {{ block.settings.secondary_button_label }}
                          </span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </PopoverPanel>
              <PopoverPanel v-else-if="link.links.length" class="header__menu-dropdown" :class="[`color-scheme--${settings.mm_color_scheme}`]">
                <ul class="dropdown">
                  <Disclosure as="li" v-for="child in link.links" :key="child.id" class="dropdown__level1">
                    <DisclosureButton v-if="child.links.length">
                      <a v-if="settings.mm_toplink_behavior == 'parent_link'" :href="child.url">
                        {{ child.title }}
                      </a>
                      <span v-else>
                        {{  child.title }}
                      </span>
                      <span v-if="child.links.length" class="icon target expand">
                        <svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-caret" viewBox="0 0 10 6">
                          <path fill-rule="evenodd" clip-rule="evenodd" d="M9.354.646a.5.5 0 00-.708 0L5 4.293 1.354.646a.5.5 0 00-.708.708l4 4a.5.5 0 00.708 0l4-4a.5.5 0 000-.708z" fill="currentColor" />
                        </svg>
                      </span>
                    </DisclosureButton>
                    <a v-else :href="child.url">
                      {{ child.title }}
                    </a>
                    <transition name="slideDown" v-if="child.links.length">
                      <DisclosurePanel as="ul">
                        <li v-if="settings.mm_toplink_behavior == 'view_all_link'" class="dropdown__view-all">
                          <a :href="child.url">
                            All {{ child.title }}
                          </a>
                        </li>
                        <li v-for="grandchild in child.links" :key="grandchild.id" class="dropdown__level2">
                          <a :href="grandchild.url">
                            {{ grandchild.title }}
                          </a>
                        </li>
                      </DisclosurePanel>
                    </transition>
                  </Disclosure>
                </ul>
              </PopoverPanel>
            </transition>
          </Popover>
        </PopoverGroup>
      </PopoverPanel>
    </transition>
  </Popover>
</template>

<script>
  import { PopoverGroup, Popover, PopoverButton, PopoverPanel } from '@headlessui/vue';
  import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue';
  import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue';
  import ImageTag from './components/ImageTag.vue';

  export default {
    name: "Mega Menu",
    components: { PopoverGroup, Popover, PopoverButton, PopoverPanel, TabGroup, TabList, Tab, TabPanels, TabPanel, Disclosure, DisclosureButton, DisclosurePanel, ImageTag },
    data() {
      return {
        screen: window.innerWidth
      }
    },
    props: {
      iconSize: Number,
      iconStrokeWidth: Number,
      settings: Object,
      blocks: Array,
      topMenu: Object,
      mobileLinks: Object,
      accountRoute: String
    },
    computed: {
    },
    watch: {
    },
    methods: {
      blocksByParent(parentHandle) {
        return this.blocks.filter((b) => b.title == parentHandle);
      }
    },
    mounted() {
      window.addEventListener('resize', () => { this.screen = window.innerWidth; });
      window.addEventListener('deviceorientation', () => { this.screen = window.innerWidth; });

      this.topMenu.forEach((m) => (m.blocks = []));

      this.blocks.forEach((block) => {
        var match = this.topMenu.find((item) => item.title.toLowerCase() == block.settings.title.toLowerCase());

        if (match != undefined) {
          var pos = this.topMenu.indexOf(match);
          this.topMenu[pos].blocks.push(block);
        }
      });

      const header = document.querySelector('header');
      const menuTrigger = document.querySelector('.header__menu-trigger');
      const topLinks = Array.from(document.querySelectorAll('.header__menu-top .top-link > a'));

      var observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName == 'aria-expanded') {
            var activeTopLink = topLinks.find((t) => t.getAttribute('aria-expanded') == 'true') || false;
            var triggerVisible = window.getComputedStyle(menuTrigger).display == 'none' ? false : true;
            if (activeTopLink) {
              var isDropdown = activeTopLink.nextElementSibling.classList.contains('header__menu-dropdown');
            }

            if ((menuTrigger.getAttribute('aria-expanded') == 'true' && window.innerWidth < 1024) ||
                (activeTopLink && !isDropdown && activeTopLink.getAttribute('aria-expanded') == 'true')) { // not actually a true boolean so have to compare text values
                  document.body.classList.add('menu--opened');
              header.classList.add('menu--opened');
            } else if (menuTrigger.getAttribute('aria-expanded') == 'false' ||
                      (!triggerVisible && !activeTopLink)) {
              document.body.classList.remove('menu--opened');
              header.classList.remove('menu--opened');
            }
          }
        });
      });

      observer.observe(menuTrigger, {
        attributes: true
      });

      topLinks.forEach((topLink) => {
        observer.observe(topLink, {
          attributes: true
        });
      });
    }
  }
</script>