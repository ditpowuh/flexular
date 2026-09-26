import {LitElement, html, css} from "lit";
import {styleMap} from "lit/directives/style-map.js";
import {StateController} from "@lit-app/state";

import {globalStyles} from "@main/CSS/global.js";

export class IndexModule extends LitElement {
  static styles = [globalStyles, css`
    #settings {
      text-align: left;
      background-color: color-mix(in srgb, var(--highlight) 30%, transparent);
      width: 400px;
      margin: 0 auto;
      border: 3px var(--highlight) solid;
      border-radius: 5px;
      padding: 25px 50px;
    }

    #settings h2 {
      text-align: center;
    }

    #settings button {
      display: block;
      margin: 10px auto;
      background-color: var(--button);
      color: var(--button-text);
      border: none;
      padding: 10px 20px;
      border-radius: 7.5px;
      font-weight: bold;
      cursor: pointer;
      transition: 0.25s background-color;
    }

    #settings button:hover {
      background-color: var(--button-hover);
    }

    #settings select {
      border: none;
      padding: 1px;
      border-radius: 2.5px;
    }

    #settings input[type="checkbox"] {
      width: 15px;
      height: 15px;
      vertical-align: -2px;
      accent-color: var(--checkbox);
    }

    #settings footer {
      text-align: center;
      font-size: 12px;
    }
  `];

  constructor() {
    super();
    this.handleSettings = this.handleSettings.bind(this);
    this.resetSettings = this.resetSettings.bind(this);
    ipc.send("GetSettings");
  }

  connectedCallback() {
    super.connectedCallback();
    ipc.on("GetSettings", this.handleSettings);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    ipc.off("GetSettings", this.handleSettings);
  }

  handleSettings(event, settings) {
    this.renderRoot.querySelector("#themeselection").value = settings.theme;
    this.renderRoot.querySelector("#startontray").checked = settings.startInTray;
    this.renderRoot.querySelector("#developermode").checked = settings.developerMode;
  }

  onThemeSettingChange(event) {
    const selectedValue = event.target.value;
    ipc.send("UpdateSettings", "theme", selectedValue);
  }

  onStartInTraySettingChange(event) {
    const checked = event.target.checked;
    ipc.send("UpdateSettings", "startInTray", checked);
  }

  onDeveloperModeSettingChange(event) {
    const checked = event.target.checked;
    ipc.send("UpdateSettings", "developerMode", checked);
  }

  resetSettings() {
    this.renderRoot.querySelector("#themeselection").value = "light";
    this.renderRoot.querySelector("#startontray").checked = false;
    this.renderRoot.querySelector("#developermode").checked = false;
    ipc.send("ResetSettings");
  }

  clearAllData() {
    ipc.send("ClearAllData");
  }

  render() {
    return html`
      <div class="wrapper">
        <br><br>
        <h1 id="title">Home</h1>
        <p>Click the top-left icon to open the sidebar and access apps.</p>
        <br>
        <div id="settings">
          <h2>Settings For Flexular</h2>

          <span>Theme: </span>
          <select id="themeselection" name="Theme" @change=${this.onThemeSettingChange}>
            <option value="light">Light</option>
          </select>

          <br>

          <span>Start With App in Tray*: </span>
          <input id="startontray" type="checkbox" @change=${this.onStartInTraySettingChange}>

          <br>

          <span>Developer Mode*: </span>
          <input id="developermode" type="checkbox" @change=${this.onDeveloperModeSettingChange}>

          <br><br>
          <footer>*Setting requires app restart.</footer>
          <br>
          <button id="reset" @click=${this.resetSettings}>Reset Settings To Default</button>
          <button id="clear" @click=${this.clearAllData}>Clear All Data</button>
          <br>
        </div>
      </div>
    `;
  }
}

customElements.define("index-module", IndexModule);
