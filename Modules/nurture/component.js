import {LitElement, html, css} from "lit";

import {globalStyles} from "@main/CSS/global.js";

import {availableMinutes, defaultMinutes, formatHour} from "./Utilities/time.js";
import "./Utilities/font.js";

export const tag = "nurture-module";

export class NurtureModule extends LitElement {
  static properties = {
    minutesIndex: {},
    startTime: {},
    endTime: {},
    enabled: {}
  };

  static styles = [globalStyles, css`
    hr.divider {
      border: none;
      border-top: 0.25em solid #eeeeee;
      border-radius: 0.25em;
      width: 32em;
      margin-bottom: 1em;
    }

    div.enablecheckbox {
      font-size: 1.5em;
    }

    input[type="checkbox"].enablecheckbox {
      margin-left: 4px;
      width: 24px;
      height: 24px;
      vertical-align: middle;
      accent-color: var(--checkbox);
    }

    .task {
      display: inline-block;
      background: rgba(255, 255, 255, 0.25);
      width: 48em;
      padding: 3em 2em;
      font-family: "Quicksand", sans-serif;
      border-radius: 2em;
    }

    .task h2 {
      font-size: 2em;
      margin-top: 0;
    }

    .task .frequency {
      margin: 2em 0;
    }

    .task .frequency > * {
      display: inline-block;
    }

    .task .frequency .minutes {
      width: 3rem;
      font-size: 2em;
      text-shadow: 0 0 0.25rem rgba(0, 0, 0, 0.5);
      color: #ffffff;
      transform: translateY(0.25rem);
    }

    .task .frequency button.changebutton {
      font-family: "Quicksand", sans-serif;
      font-weight: bold;
      margin: 0 0.5em;
      width: 2em;
      height: 2em;
      border: 0.125em rgba(0, 0, 0, 0.25) solid;
      border-radius: 50%;
      color: #777777;
      cursor: pointer;
    }

    .task .timerange {
      margin: 1em 0;
    }

    .task .timerange input[type="time"] {
      font-family: "Fira Mono", monospace;
      padding: 0.5em;
      border: none;
      border-radius: 0.5em;
      margin: 0 0.25em;
      box-shadow: 0 0 0.25em rgba(0, 0, 0, 0.25);
      cursor: pointer;
      color: #666666;
      font-size: 1em;
      font-weight: bold;
    }

    .task .timerange input[type="time"]::-webkit-calendar-picker-indicator, .task input[type="time"]::-webkit-inner-spin-button, .task input[type="time"]::-webkit-clear-button {
      display: none;
    }

    .task footer {
      margin-top: 1rem;
      font-size: 0.75em;
    }

    :focus {
      outline: unset;
    }
  `];

  constructor() {
    super();
    this.minutesIndex = defaultMinutes;
    this.startTime = "07:00";
    this.endTime = "23:00";
    this.enabled = false;
    this.handleLoad = this.handleLoad.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    ipc.on("LoadNurtureData", this.handleLoad);
    ipc.send("GetNurtureData");
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    ipc.off("LoadNurtureData", this.handleLoad);
  }

  handleLoad(event, data) {
    if (!data) {
      return;
    }
    const index = availableMinutes.indexOf(data.minutes);
    this.minutesIndex = index === -1 ? defaultMinutes : index;
    this.startTime = formatHour(data.startTime);
    this.endTime = formatHour(data.endTime);
    this.enabled = data.enabled === true;
  }

  normalizeEndTime() {
    if (this.endTime === "00:00") {
      this.endTime = "23:00";
    }
  }

  save() {
    if (this.startTime === "" || this.endTime === "") {
      return;
    }
    ipc.send("SaveWaterReminder", {
      enabled: this.enabled,
      minutes: availableMinutes[this.minutesIndex],
      startTime: parseInt(this.startTime.split(":")[0], 10),
      endTime: parseInt(this.endTime.split(":")[0], 10)
    });
  }

  decreaseMinutes() {
    if (this.minutesIndex > 0) {
      this.minutesIndex -= 1;
      this.save();
    }
  }

  increaseMinutes() {
    if (this.minutesIndex < availableMinutes.length - 1) {
      this.minutesIndex += 1;
      this.save();
    }
  }

  handleStartChange(event) {
    this.startTime = event.target.value;
    this.normalizeEndTime();
    this.save();
  }

  handleEndChange(event) {
    this.endTime = event.target.value;
    this.normalizeEndTime();
    this.save();
  }

  handleEnabledChange(event) {
    this.enabled = event.target.checked;
    this.normalizeEndTime();
    this.save();
  }

  render() {
    return html`
      <div class="wrapper">
        <h1 class="defaulttitle">Nurture</h1>
        <hr class="divider">
        <div class="task">
          <h2>Drink Water!</h2>
          <div class="frequency">
            <span>A notification will remind you every</span>
            <button class="changebutton" @click=${() => this.decreaseMinutes()}>&lt;</button>
            <div class="minutes">${availableMinutes[this.minutesIndex]}</div>
            <button class="changebutton" @click=${() => this.increaseMinutes()}>&gt;</button>
            <span>minute(s)!</span>
          </div>
          <div class="timerange">
            <span>From</span>
            <input type="time" step="3600" .value=${this.startTime} @change=${this.handleStartChange}>
            <span>to</span>
            <input type="time" step="3600" .value=${this.endTime} @change=${this.handleEndChange}>
            <span>*</span>
          </div>
          <div ">
            <div class="enablecheckbox">Enabled:</div>
            <input class="enablecheckbox" type="checkbox" .checked=${this.enabled} @change=${this.handleEnabledChange}>
          </div>
          <footer>*12 AM to 11 PM for full day.</footer>
        </div>
      </div>
    `;
  }
}

customElements.define(tag, NurtureModule);
