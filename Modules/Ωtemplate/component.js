import {LitElement, html, css} from "lit";
import {styleMap} from "lit/directives/style-map.js";
import {StateController} from "@lit-app/state";

import {globalStyles} from "@main/CSS/global.js";

export const tag = "template-module";

export class TemplateModule extends LitElement {

  static styles = [globalStyles, css`
    .title {
      font-size: 3em;
    }
  `];

  // Constructor and super() is a must
  constructor() {
    super();

    console.log("Hello world from component.js!");
  }

  // You can define regular functions like this
  triggerMessage() {
    ipc.send("TemplateTest");
  }

  // Render HTML here with state and functions 
  render() {
    return html`
      <div class="wrapper">
         <!--Put your title here-->
        <h1 class="title">Template</h1>
        <!--Put your new stuff here!-->
        <button @click=${this.triggerMessage}> <!--Here to show off index.js and how triggering functions work!-->
          Trigger message!
        </button>
      </div>
    `;
  }
}

customElements.define(tag, TemplateModule);
