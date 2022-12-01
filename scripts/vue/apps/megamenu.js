import { createApp, h } from "vue/dist/vue.esm-bundler";
import MegaMenu from "../../../vue/MegaMenu.vue";

export class MegaMenuApp {
  constructor(id, data) {
    this._sectionId = id;
    this._appType = "megamenu";
    this._appInstance = null;
    this._appData = data;
    this._mountingNode = null;
  }

  getSectionId() {
    return this._sectionId;
  }

  setMountingNode() {
    this._mountingNode = document.querySelector(
      `div[data-app-id="${this._sectionId}"][data-app-type="${this._appType}"]`
    );
  }

  // required
  kill() {
    this._appInstance.kill();
  }

  // required
  init() {
    this.setMountingNode();
    this._appInstance = createApp(
      {
        el: this._mountingNode,
        render: () =>
          h(MegaMenu, {
            props: {
              ...this._appData,
            },
          }),
        methods: {
          kill() {
          },
        },
      },
      this._appData
    ).mount(this._mountingNode);
  }
}
