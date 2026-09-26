import {LitElement, html, css} from "lit";
import {styleMap} from "lit/directives/style-map.js";
import {StateController} from "@lit-app/state";

import {globalStyles} from "@main/CSS/global.js";

export class IndexModule extends LitElement {
  static styles = [globalStyles, css`
    .settings {
      text-align: left;
      background-color: color-mix(in srgb, var(--highlight) 30%, transparent);
      width: 32em;
      margin: 0 auto;
      border: 0.25em var(--highlight) solid;
      border-radius: 1em;
      padding: 2em 2em;
    }

    .settings .minititle {
      font-size: 2em;
      text-align: center;
    }

    .settings button {
      display: block;
      margin: 0.5em auto;
      background: var(--button);
      color: var(--button-text);
      border: none;
      padding: 1em 1.5em;
      border-radius: 1em;
      font-weight: bold;
      cursor: pointer;
      transition: 0.25s background;
    }

    .settings button:hover {
      background-color: var(--button-hover);
    }

    .settings select {
      border: none;
      padding: 0.25em;
      border-radius: 0.25em;
    }

    .settings input[type="checkbox"] {
      width: 1rem;
      height: 1rem;
      vertical-align: -2px;
      accent-color: var(--checkbox);
    }

    .settings footer {
      margin: 1rem 0;
      text-align: center;
      font-size: 0.75em;
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
        <h1 class="defaulttitle">Home</h1>
        <p>Click the top-left icon to open the sidebar and access apps.</p>
        <br>
        <div class="settings">
          <h2 class="minititle">Settings For Flexular</h2>
          <div>
            <span>Theme: </span>
            <select id="themeselection" name="Theme" @change=${this.onThemeSettingChange}>
              <option value="light">Light</option>
            </select>
          </div>
          <div>
            <span>Start With App in Tray*: </span>
            <input id="startontray" type="checkbox" @change=${this.onStartInTraySettingChange}>
          </div>
          <div>
            <span>Developer Mode*: </span>
            <input id="developermode" type="checkbox" @change=${this.onDeveloperModeSettingChange}>
          </div>
          <footer>*Setting requires app restart.</footer>
          <button id="reset" @click=${this.resetSettings}>Reset Settings To Default</button>
          <button id="clear" @click=${this.clearAllData}>Clear All Data</button>
        </div>
      </div>
    `;
  }
}

customElements.define("index-module", IndexModule);
