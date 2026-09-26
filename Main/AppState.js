import {State} from "@lit-app/state";

class AppState extends State {
  static properties = {
    sidebar: {},
    page: {}
  };

  constructor() {
    super();
    this.sidebar = false;
    this.page = null;
  }
}

export const appState = new AppState();
