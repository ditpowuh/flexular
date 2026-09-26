import {LitElement, html, css} from "lit";
import {styleMap} from "lit/directives/style-map.js";
import {StateController} from "@lit-app/state";

import {globalStyles} from "@main/CSS/global.js";
import {appState} from "@main/AppState.js";

export class SideBar extends LitElement {
  static styles = [globalStyles, css`
    #sidebar {
      position: fixed;
      height: 100%;
      width: 0;
      background-color: var(--sidebar);
      z-index: 1;
      top: 0;
      left: 0;
      overflow-x: hidden;
      transition: width 0.5s;
    }

    #sidebar hr#top {
      margin-top: 80px;
    }

    #sidebar ul {
      list-style-type: none;
      padding-left: 0;
    }

    #sidebar ul li {
      background-color: var(--sidebar-option);
      display: block;
      padding: 20px;
      font-size: 20px;
      cursor: pointer;
      transition: 0.25s background-color;
    }

    #sidebar ul li:hover {
      background-color: var(--sidebar-option-hover);
    }

    #sidebar ul li:first-child {
      margin-bottom: 35px;
    }

    #sidebar ul li.selected {
      background-color: var(--sidebar-option-selected);
    }
  `];

  constructor() {
    super();
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

  render() {
    const sidebarWidthStyle = {
      width: appState.sidebar ? "25%" : "0"
    };

    return html`
      <div id="sidebar" style=${styleMap(sidebarWidthStyle)}>
        <hr id="top/">
        <br/>
        <ul>
          <li>Home</li>
        </ul>
      </div>
    `;
  }
}

customElements.define("side-bar", SideBar);
