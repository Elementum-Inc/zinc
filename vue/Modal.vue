<template>
  <TransitionRoot as="template" :show="isOpen" :open="true">
    <Dialog as="div" class="section-modal-container" @close="isOpen = false">
      <TransitionChild
        as="template"
        enter="ease-out duration-600"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="section-modal__overlay" />
      </TransitionChild>

      <div class="section-modal-wrapper">
        <div
          class="section-modal-wrapper__inner"
        >
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
          <div class="section-modal">
            <DialogPanel class="section-modal__inner">
              <div class="section-modal__close">
                <button
                  type="button"
                  class="
                    hover:text-gray-500
                  "
                  @click="isOpen = false"
                >
                  <span class="sr-only">Close</span>
                  <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" role="presentation" class="stroke-scheme-text" fill="none" viewBox="0 0 18 17" :height="iconSize" :width="iconSize" :stroke-width="iconStrokeWidth">
                    <path d="M.865 15.978a.5.5 0 00.707.707l7.433-7.431 7.579 7.282a.501.501 0 00.846-.37.5.5 0 00-.153-.351L9.712 8.546l7.417-7.416a.5.5 0 10-.707-.708L8.991 7.853 1.413.573a.5.5 0 10-.693.72l7.563 7.268-7.418 7.417z" fill="currentColor"></path>
                  </svg>

                </button>
              </div>
              <div>
                <div
                  class="
                    mx-auto
                    flex
                    h-12
                    w-12
                    flex-shrink-0
                    items-center
                    justify-center
                    sm:mx-0 sm:h-10 sm:w-10
                  "
                ></div>
                <div
                  class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left"
                  v-for="block in blocks"
                  :key="block"
                >
                  <div class="section-modal__content" v-if="block.type == 'email_form'">
                    <!-- <DialogTitle
                      as="h3"
                      class="header-font leading-6 font-black text-5xl"
                      >{{ modal_content_title }}</DialogTitle
                    >
                    <div class="mt-2">
                      <p class="text-sm text-gray-500">
                        Are you sure you want to deactivate your account? All of
                        your data will be permanently removed from our servers
                        forever. This action cannot be undone.
                      </p>
                    </div>

                    <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                      <button
                        type="button"
                        class="
                          inline-flex
                          w-full
                          justify-center
                          rounded-md
                          border border-transparent
                          bg-white
                          px-4
                          py-2
                          text-base
                          font-medium
                          text-black
                          shadow-sm
                          focus:outline-none
                          focus:ring-2
                          focus:ring-red-500
                          focus:ring-offset-2
                          sm:ml-3 sm:w-auto sm:text-sm
                        "
                        @click="isOpen = false"
                      >
                        Deactivate
                      </button>
                      <button
                        type="button"
                        class="
                          mt-3
                          inline-flex
                          w-full
                          justify-center
                          border border-gray-300
                          bg-black
                          text-white
                          px-4
                          py-2
                          text-base
                          font-medium
                          text-gray-700
                          shadow-sm
                          hover:text-gray-500
                          focus:outline-none
                          focus:ring-2
                          focus:ring-indigo-500
                          focus:ring-offset-2
                          sm:mt-0 sm:w-auto sm:text-sm
                        "
                        @click="isOpen = false"
                      >
                        Cancel
                      </button>
                    </div> -->
                    
                  </div>

                  <div
                    class="section-modal__content"
                    v-else-if="block.type == 'modal_content'"
                  >
                    <DialogTitle
                      as="h2"
                      class="section-modal__heading"
                      v-if="block.settings.modal_content_title"
                      >{{ block.settings.modal_content_title }}</DialogTitle
                    >
                    <h4 v-if="block.settings.modal_content_subtitle">
                      {{ block.settings.modal_content_subtitle }}
                    </h4>
                    <div class="mt-2" :html="block.settings.modal_content_body">
                      <p
                        :html="block.settings.modal_content_body"
                      >
                        Test Body
                      </p>
                    </div>

                    <div
                      v-if="
                        block.settings.modal_content_primary_cta_url ||
                        block.settings.modal_content_secondary_cta_url
                      "
                      class="section-modal__buttons"
                    >
                      <a
                        v-if="block.settings.modal_content_primary_cta_url"
                        :href="block.settings.modal_content_primary_cta_url"
                        class="btn primary"
                      >
                        {{ block.settings.modal_content_primary_cta_text }}
                      </a>
                      <a
                        v-if="block.settings.modal_content_secondary_cta_url"
                        :href="block.settings.modal_content_secondary_cta_url"
                        class="btn secondary"
                      >
                        {{ block.settings.modal_content_secondary_cta_text }}
                      </a>
                    </div>
                  </div>
                No thanks
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
  },
  methods: {
    blocksByParent(parentHandle) {
      return this.blocks.filter((b) => b.title == parentHandle);
    },
  },
  mounted() {
    window.addEventListener("deviceorientation", () => {
      this.screen = window.innerWidth;
    });
  },
};
</script>