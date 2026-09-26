import {LitElement, html, css} from "lit";

import {globalStyles} from "@main/CSS/global.js";
import {appState} from "@main/AppState.js";

export class MenuBar extends LitElement {
  static styles = [globalStyles, css`
    #menubar {
      z-index: 100;
      width: 100%;
      background-color: var(--menubar);
      -webkit-app-region: drag;
    }

    #menubar {
      text-align: center;
      width: 100%;
      position: fixed;
      top: 0;
      right: 0;
    }

    #menubar ul {
      list-style-type: none;
      margin: 0;
      padding: 0;
      overflow: hidden;
    }

    #menubar ul li {
      -webkit-user-select: none;
      -webkit-app-region: none;
    }

    #menubar ul li.left {
      float: left;
    }

    #menubar ul li.right {
      float: right;
    }

    #menubar ul li a {
      display: block;
      font-size: 15px;
      font-weight: bold;
      text-align: center;
      text-decoration: none;
      cursor: pointer;
      transition: background-color 0.375s;
    }

    #menubar ul li a#menubaricon {
      height: 45.5px;
      background-color: var(--menubar-highlight);
      transition: background-color 0.375s;
    }

    #menubar ul li a#menubaricon:hover {
      background-color: var(--menubar-hover);
    }

    #menubar ul li a#menubaricon img {
      padding-left: 5px;
      padding-right: 5px;
      padding-top: 2px;
      height: 40px;
      width: 40px;
    }

    #menubar ul li a.menubuttons {
      padding-top: 10px;
      padding-right: 40px;
      padding-left: 40px;
      padding-bottom: 7.5px;
      text-decoration: none;
      background-color: var(--menubar-highlight);
    }

    #menubar ul li a.menubuttons img {
      height: 25px;
      width: 25px;
    }

    #menubar ul li a:hover {
      background-color: var(--menubar-hover);
    }

    @container style(--menubar-invert-icons: 1) {
      :is(#menubaricon, #closebutton, #resizebutton, #minimisebutton) img {
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
      <div id="menubar" class="wrapper">
        <ul>
          <li class="left">
            <a id="menubaricon" @click=${this.toggleSidebar}>
              <img src="../Main/Assets/Puzzle.png"/>
            </a>
          </li>
          <li class="right">
            <a id="closebutton" class="menubuttons" @click=${this.closeApp}>
              <img src="../Main/Assets/Icons/Close.png"/>
            </a>
          </li>
          <li class="right">
            <a id="resizebutton" class="menubuttons" @click=${this.resizeApp}>
              <img src="../Main/Assets/Icons/Resize.png"/>
            </a>
          </li>
          <li class="right">
            <a id="minimisebutton" class="menubuttons" @click=${this.minimiseApp}>
              <img src="../Main/Assets/Icons/Minimise.png"/>
            </a>
          </li>
        </ul>
      </div>
    `;
  }
}

customElements.define("menu-bar", MenuBar);
