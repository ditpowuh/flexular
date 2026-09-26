import {LitElement, html, css} from "lit";
import {keyed} from "lit/directives/keyed.js";

import {globalStyles} from "@main/CSS/global.js";
import "./Components/StopwatchCard.js";
import "./Utilities/font.js";

export const tag = "timewatch-module";

export class TimewatchModule extends LitElement {
  static properties = {
    stopwatches: {type: Array}
  };

  static styles = [globalStyles, css`
    #title {
      font-size: 42px;
    }

    #stopwatches {
      max-height: 75vh;
      overflow-x: hidden;
      overflow-y: auto;
    }

    #addbutton {
      margin-top: 20px;
      background-color: #eeeeee;
      color: #595959;
      border: none;
      width: 90px;
      padding: 10px 20px;
      border-radius: 7.5px;
      font-weight: bold;
      transition: 0.25s background-color;
      cursor: pointer;
    }

    #addbutton:hover {
      background-color: #bbbbbb;
    }
  `];

  constructor() {
    super();
    this.stopwatches = [];
    this.nextId = 1;
    this.loaded = false;
    this.handleLoad = this.handleLoad.bind(this);
    this.handleUnload = this.handleUnload.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    ipc.on("LoadStopwatches", this.handleLoad);
    window.addEventListener("beforeunload", this.handleUnload);
    ipc.send("GetStopwatches");
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    ipc.off("LoadStopwatches", this.handleLoad);
    window.removeEventListener("beforeunload", this.handleUnload);
    this.save();
  }

  handleLoad(event, stopwatches) {
    this.loaded = true;
    this.stopwatches = (stopwatches || []).map((data) => ({id: this.nextId++, data}));
  }

  handleUnload() {
    this.save();
  }

  save() {
    if (!this.loaded) {
      return;
    }
    const cards = this.renderRoot.querySelectorAll("stopwatch-card");
    const data = [...cards].map((card) => card.snapshot());
    ipc.send("SaveStopwatches", data);
  }

  addStopwatch() {
    this.stopwatches = [...this.stopwatches, {id: this.nextId++, data: {startTime: null, elapsedTime: 0, running: false, tag: ""}}];
  }

  removeStopwatch(id) {
    this.stopwatches = this.stopwatches.filter((stopwatch) => stopwatch.id !== id);
  }

  render() {
    return html`
      <div class="wrapper">
        <br><br>
        <h1 id="title">Timewatch</h1>
        <div id="stopwatches">
          ${this.stopwatches.map((stopwatch) => html`${keyed(stopwatch.id, html`<stopwatch-card .data=${stopwatch.data} @delete-stopwatch=${() => this.removeStopwatch(stopwatch.id)}></stopwatch-card>`)}`)}
        </div>
        <button id="addbutton" @click=${() => this.addStopwatch()}>Add</button>
      </div>
    `;
  }
}

customElements.define(tag, TimewatchModule);
