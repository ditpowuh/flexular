import {LitElement, html, css} from "lit";

import {globalStyles} from "@main/CSS/global.js";
import {appState} from "@main/AppState.js";

export class MenuBar extends LitElement {
  static styles = [globalStyles, css`
    .menubar {
      background: var(--menubar);
      position: fixed;
      display: flex;
      justify-content: space-between;
      width: 100%;
      height: 3em;
      top: 0;
      left: 0;
      z-index: 100;
      -webkit-app-region: drag;
    }

    .left, .right {
      display: flex;
      flex-direction: row;
    }

    .menuicon {
      background: var(--menubar-highlight);
      height: 3em;
      width: 3em;
      cursor: pointer;
      transition: background 0.25s;
      -webkit-user-select: none;
      -webkit-app-region: none;
    }

    .menuicon:hover {
      background: var(--menubar-hover);
    }

    .menuicon img {
      width: 100%;
      height: 100%;
    }

    .menubutton {
      background: var(--menubar-highlight);
      display: flex;
      justify-content: center;
      align-items: center;
      width: 6em;
      cursor: pointer;
      transition: background 0.25s;
      -webkit-user-select: none;
      -webkit-app-region: none;
    }

    .menubutton:hover {
      background: var(--menubar-hover);
    }

    .menubutton img {
      width: 2em;
      height: 2em;
    }

    @container style(--menubar-invert-icons: 1) {
      .menuicon img, .menubutton img {
        filter: invert(100%);
      }
    }
  `];

  constructor() {
    super();
  }

  toggleSidebar() {
    appState.sidebar = !appState.sidebar;
  }

  minimiseApp() {
    ipc.send("MinimiseApp");
  }

  resizeApp() {
    ipc.send("ResizeApp");
  }

  closeApp() {
    ipc.send("CloseApp");
  }

  render() {
    return html`
      <div class="menubar">
        <div class="left">
          <div class="menuicon" @click=${this.toggleSidebar}>
            <img src="../Main/Assets/Puzzle.png"/>
          </div>
        </div>
        <div class="right">
          <div class="menubutton" @click=${this.minimiseApp}>
            <img src="../Main/Assets/Icons/Minimise.png"/>
          </div>
          <div class="menubutton" @click=${this.resizeApp}>
            <img src="../Main/Assets/Icons/Resize.png"/>
          </div>
          <div class="menubutton" @click=${this.closeApp}>
            <img src="../Main/Assets/Icons/Close.png"/>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define("menu-bar", MenuBar);
