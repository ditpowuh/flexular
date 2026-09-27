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
      border-radius: 0.5em;
      padding: 2em 15%;
      margin: 0.5em;
    }

    :host > div {
      margin: 1.5em 0;
    }

    :host > div:first-of-type, :host > div:last-of-type {
      margin: 0;
    }

    button {
      background: #eeeeee;
      color: #595959;
      border: none;
      width: 7.5em;
      height: 2.5em;
      border-radius: 0.5em;
      font-weight: bold;
      transition: 0.25s background;
      cursor: pointer;
    }

    button:hover {
      background-color: #bbbbbb;
    }

    button.clearbutton {
      width: 6em;
      padding: 0.5em 0;
      border-radius: 0.5em;
    }

    input.tag {
      width: 7.5rem;
      padding: 0.5rem;
      border: none;
      border-radius: 0.5rem;
      text-align: center;
    }

    .time {
      display: inline-block;
      width: 20rem;
      font-size: 3em;
    }

    .units {
      width: 20rem;
      margin: 0 auto;
      font-size: 0.75rem;
      text-align: left;
    }

    .units span:nth-child(1) {
      padding-left: 0.5rem;
      padding-right: 3.125rem;
    }

    .units span:nth-child(2) {
      padding-right: 2.125rem;
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
      <div>
        <div class="time monofont">${this.time}</div>
        <div class="units monofont"><span>hours</span><span>minutes</span><span>seconds</span></div>
      </div>
      <div>
        <button class="mainbutton" @click=${() => this.toggle()}>${this.running ? "Stop" : "Start"}</button>
        <button class="restartbutton" @click=${() => this.restart()}>Restart</button>
        <button class="deletebutton" @click=${() => this.deleteCard()}>Delete</button>
      </div>
      <div>
        <input class="tag" type="text" placeholder="Tag" maxlength="20" spellcheck="false" .value=${this.tag} @input=${(event) => this.onTagInput(event)}>
        <button class="clearbutton" @click=${() => this.clearTag()}>Clear</button>
      </div>
    `;
  }
}

customElements.define("stopwatch-card", StopwatchCard);
