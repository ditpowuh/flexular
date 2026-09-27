import {LitElement, html, css} from "lit";
import {styleMap} from "lit/directives/style-map.js";
import {StateController} from "@lit-app/state";

import {globalStyles} from "@main/CSS/global.js";

export const tag = "template-module";

export class TemplateModule extends LitElement {
  // Declare reactive properties here, render() re-runs when they change
  static properties = {
    count: {}
  };

  // Put your styles here as if it was like regular CSS!
  // Also pass in globalStyles if you like (i.e. for .defaulttitle and others)
  static styles = [globalStyles, css`
    .coolbutton {
      padding: 0.5em;
      border: none;
      font-weight: bold;
      border-radius: 0.5em;
      cursor: pointer;
    }

    .coolnumber {
      font-size: 2em;
      margin: 1rem;
    }
  `];

  // Constructor and super() is a must
  constructor() {
    super();
    // Define your initial values for your properties here
    this.count = 0;

    console.log("Hello world from component.js!");
  }

  // You can define regular functions like this
  triggerMessage() {
    ipc.send("TemplateTest");
  }

  increaseCount() {
    this.count += 1;
  }

  resetCount() {
    this.count = 0;
  }

  // Render HTML here with state and functions
  render() {
    return html`
      <div class="wrapper">
         <!--Put your title here-->
        <h1 class="defaulttitle">Template</h1>

        <!--Put your new stuff here!-->

        <!--Example stuff below-->
        <div style="margin: 1em;">
          <div>
            <button class="coolbutton" @click=${this.increaseCount}>Increase count</button>
            <button class="coolbutton" @click=${this.resetCount}>Reset count</button>
          </div>
          <!--This div is reactive, and will change!-->
          <div class="coolnumber">${this.count}</div>
        </div>
        <div style="margin: 3em;">
          <!--Here to show off index.js and how triggering functions work!-->
          <button class="coolbutton" @click=${this.triggerMessage}>Trigger message!</button>
        </div>
      </div>
    `;
  }
}

customElements.define(tag, TemplateModule);
