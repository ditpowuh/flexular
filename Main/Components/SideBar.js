import {LitElement, html, css} from "lit";
import {styleMap} from "lit/directives/style-map.js";
import {classMap} from "lit/directives/class-map.js";
import {StateController} from "@lit-app/state";

import {globalStyles} from "@main/CSS/global.js";
import {appState} from "@main/AppState.js";

export class SideBar extends LitElement {
  static properties = {
    modules: {type: Array}
  };

  static styles = [globalStyles, css`
    .sidebar {
      background: var(--sidebar);
      position: fixed;
      height: 100%;
      z-index: 1;
      top: 0;
      left: 0;
      overflow-x: hidden;
      transition: width 0.5s cubic-bezier(0, 0, 0, 1);
    }

    .sidebar hr {
      margin-top: 6em;
      border-top: 0.25em solid var(--divider);
      border-left: none;
      border-right: none;
      border-bottom: none;
      border-radius: 0.25em;
      width: 75%;
    }

    .sidebar ul {
      list-style-type: none;
      padding-left: 0;
    }

    .sidebar ul li {
      background: var(--sidebar-option);
      display: block;
      padding: 20px;
      font-size: 20px;
      cursor: pointer;
      transition: 0.25s background;
    }

    .sidebar ul li:hover {
      background-color: var(--sidebar-option-hover);
    }

    .sidebar ul li:first-child {
      margin-bottom: 1em;
    }

    .sidebar ul li.selected {
      background-color: var(--sidebar-option-selected);
    }
  `];

  constructor() {
    super();
    this.handleModules = this.handleModules.bind(this);
    this.appState = new StateController(this, appState);
    this.modules = [];
    ipc.send("GetModules");
  }

  connectedCallback() {
    super.connectedCallback();
    ipc.on("ModulesList", this.handleModules);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    ipc.off("ModulesList", this.handleModules);
  }

  handleModules(event, modules) {
    this.modules = modules;
  }

  goHome() {
    appState.goHome();
  }

  async goToPage(name) {
    await appState.goToPage(name);
  }

  render() {
    const sidebarWidthStyle = {
      width: appState.sidebar ? "25%" : "0"
    };

    const homeClasses = {
      "selected": appState.page === null
    };

    return html`
      <div class="sidebar" style="${styleMap(sidebarWidthStyle)}">
        <hr>
        <ul>
          <li class="${classMap(homeClasses)}" @click=${this.goHome}>Home</li>
          ${this.modules.map((item) => {
            const itemClasses = {
              "selected": appState.page?.name === item
            };

            return html`
              <li class="${classMap(itemClasses)}" @click=${() => this.goToPage(item)}>
                ${item}
              </li>
            `;
          })}
        </ul>
      </div>
    `;
  }
}

customElements.define("side-bar", SideBar);
