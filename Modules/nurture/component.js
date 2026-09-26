import {LitElement, html, css} from "lit";

import {globalStyles} from "@main/CSS/global.js";

import {availableMinutes, defaultMinutes, formatHour} from "./Utilities/time.js";

export const tag = "nurture-module";

export class NurtureModule extends LitElement {
  static properties = {
    minutesIndex: {},
    startTime: {},
    endTime: {},
    enabled: {}
  };

  static styles = [globalStyles, css`
    #title {
      font-size: 42px;
    }

    hr#beforetask {
      border: none;
      border-top: 5px solid #eeeeee;
      border-radius: 5px;
      width: 450px;
      margin-bottom: 15px;
    }

    div.enablecheckbox {
      font-size: 24px;
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
      background-color: rgba(255, 255, 255, 0.25);
      padding: 30px 90px 60px 90px;
      font-family: "Quicksand", sans-serif;
      border-radius: 30px;
    }

    .task * {
      display: inline-block;
      vertical-align: middle;
    }

    .task h2 {
      display: block;
      font-size: 32px;
    }

    .task #water {
      width: 40px;
      font-size: 32px;
      text-shadow: 0 0 16px rgba(0, 0, 0, 0.75);
      color: #ffffff;
    }

    .task input[type="time"] {
      font-family: "Fira Mono", monospace;
      padding: 7.5px;
      border: none;
      border-radius: 10px;
      margin: 0 15px;
      box-shadow: 0 0 25px rgba(0, 0, 0, 0.25);
      cursor: pointer;
      color: #666666;
      font-size: 14px;
      font-weight: bold;
    }

    .task input[type="time"]::-webkit-calendar-picker-indicator, .task input[type="time"]::-webkit-inner-spin-button, .task input[type="time"]::-webkit-clear-button {
      display: none;
    }

    .task button.changebutton {
      font-family: "Quicksand", sans-serif;
      font-weight: bold;
      margin: 0 10px;
      width: 30px;
      height: 30px;
      border: 2px #777777 solid;
      border-radius: 50%;
      color: #777777;
      cursor: pointer;
    }

    .task footer {
      font-size: 12px;
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
        <br><br>
        <h1 id="title">Nurture</h1>
        <br>
        <hr id="beforetask">
        <div class="task">
          <h2>Drink Water!</h2>
          <span>A notification will remind you every</span>
          <button id="reduceminute" class="changebutton" @click=${() => this.decreaseMinutes()}>&lt;</button>
          <div id="water">${availableMinutes[this.minutesIndex]}</div>
          <button id="increaseminute" class="changebutton" @click=${() => this.increaseMinutes()}>&gt;</button>
          <span>minute(s)!</span>
          <br><br><br>
          <span>From</span>
          <input id="starttime" type="time" step="3600" .value=${this.startTime} @change=${this.handleStartChange}>
          <span>to</span>
          <input id="endtime" type="time" step="3600" .value=${this.endTime} @change=${this.handleEndChange}>
          <span>*</span>
          <br><br><br>
          <div class="enablecheckbox">Enabled:</div>
          <input id="waterenabled" class="enablecheckbox" type="checkbox" .checked=${this.enabled} @change=${this.handleEnabledChange}>
          <br><br>
          <footer>*12 AM to 11 PM for full day.</footer>
        </div>
      </div>
    `;
  }
}

customElements.define(tag, NurtureModule);
