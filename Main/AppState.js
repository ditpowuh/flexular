import {State} from "@lit-app/state";

class AppState extends State {
  static properties = {
    sidebar: {}
  };

  constructor() {
    super();
    this.sidebar = false;
  }
}

export const appState = new AppState();
