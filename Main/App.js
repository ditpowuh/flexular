import {LitElement, html, css, nothing} from "lit";
import {html as staticHtml, unsafeStatic} from "lit/static-html.js";
import {styleMap} from "lit/directives/style-map.js";
import {StateController} from "@lit-app/state";

import {appState} from "@main/AppState.js";

import "@main/Components/MenuBar.js";
import "@main/Components/SideBar.js";
import "@main/Index.js";

export class App extends LitElement {
  constructor() {
    super();
    this.appState = new StateController(this, appState);
  }

  render() {
    let currentModule;
    if (appState.page === null) {
      currentModule = html`
        <index-module></index-module>
      `;
    }
    else {
      const tag = unsafeStatic(appState.page.tag);
      currentModule = staticHtml`
        <${tag}></${tag}>
      `;
    }

    return html`
      <menu-bar></menu-bar>
      <side-bar></side-bar>
      ${currentModule}
    `;
  }
}

customElements.define("main-app", App);
