<template>
  <TransitionRoot appear as="template" :show="isOpen" :open="true">
    <Dialog as="div" class="section-modal-container" @close="isOpen = false">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="section-modal__overlay" />
      </TransitionChild>

      <div class="section-modal-wrapper" id="modal_wrapper">
        <div class="section-modal-wrapper__inner">
          <TransitionChild
            as="template"
            name="modal"
            enter="ease-out duration-300 delay-2000"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div class="section-modal" :class="[settings.float_modal_content || settings.overlay > 0 ? 'section-modal--float-content' : 'section-modal--stacked', settings.overlay > 0 ? 'section-modal--borderless' : '', `color-scheme--${settings.color_scheme}`]">
              <div class="section-modal__image"></div>
              <DialogPanel class="section-modal__inner">
                <div class="section-modal__content-wrapper">
                  <div class="section-modal__close">
                    <button
                      type="button"
                      class="hover:text-gray-500 icon target"
                      @click="isOpen = false"
                    >
                      <span class="sr-only">Close</span>
                      <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" role="presentation" class="stroke-scheme-text" fill="none" viewBox="0 0 18 17" :height="iconSize" :width="iconSize" :stroke-width="iconStrokeWidth">
                        <path d="M.865 15.978a.5.5 0 00.707.707l7.433-7.431 7.579 7.282a.501.501 0 00.846-.37.5.5 0 00-.153-.351L9.712 8.546l7.417-7.416a.5.5 0 10-.707-.708L8.991 7.853 1.413.573a.5.5 0 10-.693.72l7.563 7.268-7.418 7.417z" fill="currentColor"></path>
                      </svg>
  
                    </button>
                  </div>
                  <div class="section-modal__content">
                    <div v-for="block in blocks" :key="block" class="section-modal__block">
                      <div class="section-modal__newsletter" v-if="block.type == 'email_form'" v-html="form"></div>
  
                      <DialogTitle
                        as="h2"
                        class="section-modal__heading"
                        v-else-if="block.type == 'modal_title' && block.settings.modal_content_title">
                        {{ block.settings.modal_content_title }}
                      </DialogTitle>
  
                      <h4 v-else-if="block.type == 'modal_subtitle' && block.settings.modal_content_subtitle">
                        {{ block.settings.modal_content_subtitle }}
                      </h4>
  
                      <p v-else-if="block.type == 'modal_body' && block.settings.modal_content_body">
                        {{ block.settings.modal_content_body }}
                      </p>
  
                      <div v-else-if="block.type == 'modal_buttons' &&
                        (block.settings.primary_button_url ||
                        block.settings.secondary_button_url)"
                        class="section-modal__buttons buttons"
                      >
                        <a
                          v-if="block.settings.primary_button_url"
                          :href="block.settings.primary_button_url"
                          class="btn primary"
                          :class="[`btn-${block.settings.style}`, block.settings.reverse ? 'order-2' : '']"
                        >
                          <span class="btn__label">
                            {{ block.settings.primary_button_label }}
                          </span>
                        </a>
                        <a
                          v-if="block.settings.secondary_button_url"
                          :href="block.settings.secondary_button_url"
                          class="btn secondary"
                          :class="[`btn-${block.settings.style}`]"
                        >
                          <span class="btn__label">
                            {{ block.settings.secondary_button_label }}
                          </span>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div class="section-modal__close">
                    <button
                      type="button"
                      class="hover:text-gray-500"
                      @click="isOpen = false"
                    >
                      <span>Close</span>
                    </button>
                  </div>
                </div>
              </DialogPanel>
            </div>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
 

<script>
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/vue";

export default {
  name: "Modal",
  components: {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogPanel,
    DialogTitle,
  },
  data() {
    return {
      screen: window.innerWidth,
      isOpen: true
    };
  },
  props: {
    settings: Object,
    blocks: Array,
    iconSize: Number,
    iconStrokeWidth: Number,
    form: String
  },
  mounted() {
    window.addEventListener("deviceorientation", () => {
      this.screen = window.innerWidth;
    });
  },
};
</script>