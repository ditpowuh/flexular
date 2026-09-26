import {LitElement, html, css} from "lit";

import {formatTime} from "../Utilities/time.js";

export class StopwatchCard extends LitElement {
  static properties = {
    data: {},
    running: {type: Boolean},
    time: {type: String},
    tag: {type: String}
  };

  static styles = css`
    :host {
      display: inline-block;
      background-color: #dddddd;
      border-radius: 10px;
      padding: 30px 15%;
      margin: 10px;
    }

    button {
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

    button:hover {
      background-color: #bbbbbb;
    }

    button.clearbutton {
      width: 75px;
      padding: 5px 0;
      border-radius: 7.5px;
    }

    input.tag {
      width: 120px;
      padding: 5px;
      border: none;
      border-radius: 5px;
      text-align: center;
    }

    .time {
      display: inline-block;
      font-size: 50px;
    }

    .units {
      width: 330px;
      margin: 0 auto;
      font-size: 12px;
      text-align: left;
    }

    .units span:nth-child(1) {
      padding-left: 5px;
      padding-right: 55px;
    }

    .units span:nth-child(2) {
      padding-right: 40px;
    }

    .monofont {
      font-family: "Fira Mono", monospace;
    }
  `;

  constructor() {
    super();
    this.running = false;
    this.elapsedTime = 0;
    this.startTime = null;
    this.tag = "";
    this.time = "00:00:00.00";
    this.interval = null;
  }

  willUpdate(changed) {
    if (changed.has("data") && this.data && !this.initialized) {
      this.initialized = true;
      this.elapsedTime = this.data.elapsedTime || 0;
      this.tag = this.data.tag || "";
      this.time = formatTime(this.elapsedTime);
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.interval !== null) {
      clearInterval(this.interval);
      this.interval = null;
      this.running = false;
    }
  }

  snapshot() {
    const elapsed = this.running ? Date.now() - this.startTime : this.elapsedTime;
    return {
      startTime: null,
      elapsedTime: elapsed,
      running: false,
      tag: this.tag
    };
  }

  toggle() {
    if (!this.running) {
      this.startTime = Date.now() - this.elapsedTime;
      this.running = true;
      this.interval = setInterval(() => {
        this.elapsedTime = Date.now() - this.startTime;
        this.time = formatTime(this.elapsedTime);
      }, 10);
    }
    else {
      clearInterval(this.interval);
      this.interval = null;
      this.running = false;
      this.time = formatTime(this.elapsedTime);
    }
  }

  restart() {
    clearInterval(this.interval);
    this.interval = null;
    this.running = false;
    this.elapsedTime = 0;
    this.startTime = null;
    this.time = formatTime(0);
  }

  deleteCard() {
    this.dispatchEvent(new CustomEvent("delete-stopwatch", {bubbles: true, composed: true}));
  }

  onTagInput(event) {
    this.tag = event.target.value;
  }

  clearTag() {
    this.tag = "";
  }

  render() {
    return html`
      <div class="time monofont">${this.time}</div>
      <div class="units monofont"><span>hours</span><span>minutes</span><span>seconds</span></div>
      <br><br>
      <button class="mainbutton" @click=${() => this.toggle()}>${this.running ? "Stop" : "Start"}</button>
      <button class="restartbutton" @click=${() => this.restart()}>Restart</button>
      <button class="deletebutton" @click=${() => this.deleteCard()}>Delete</button>
      <br><br>
      <input class="tag" type="text" placeholder="Tag" maxlength="20" spellcheck="false" .value=${this.tag} @input=${(event) => this.onTagInput(event)}>
      <button class="clearbutton" @click=${() => this.clearTag()}>Clear</button>
    `;
  }
}

customElements.define("stopwatch-card", StopwatchCard);
