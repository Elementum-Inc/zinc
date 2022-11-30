// import { createApp, h } from 'vue';
import { createApp, h } from 'vue/dist/vue.esm-bundler';
import Test from '../../../vue/Test.vue';

export class TestApp {
  constructor(id, data) {
    this._sectionId = id;
    this._appType = 'test';
    this._appInstance = null;
    this._appData = data;
    this._mountingNode = null;
  }

  getSectionId() {
    return this._sectionId;
  }

  setMountingNode() {
    this._mountingNode = document.querySelector(`div[data-app-id="${this._sectionId}"][data-app-type="${this._appType}"]`);
  }

  // required
  kill() {
    this._appInstance.kill();
  }

  // required
  init() {
    console.log('attempting init');

    this.setMountingNode();

    console.log(this._mountingNode);
    console.log(this._appData);

    this._appInstance = createApp({
      el: this._mountingNode,
      render: () => h(Test, { // don't pass 'h' function as a parameter to the render method
        props: {
          ...this._appData
        }
      }),
      methods: {
        kill() {
        // this.$destroy();
        // remove $destroy() call as it's no longer supported in Vue 3.x
        // it's not a big deal as we were using it in the editor mode only
        }
      }
    }, this._appData).mount(this._mountingNode);

    console.log('mounted?')
  }
}
