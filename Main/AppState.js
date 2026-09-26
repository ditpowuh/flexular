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

  async goToPage(name) {
    try {
      const {tag} = await import(`@modules/${name}/component.js`);
      this.page = {
        name, tag
      };
      window.sessionStorage.setItem("page", JSON.stringify(this.page));
      this.sidebar = false;
      return true;
    }
    catch (error) {
      console.error(`Failed to load module "${name}":`, error);
      return false;
    }
  }

  goHome() {
    this.page = null;
    window.sessionStorage.removeItem("page");
    this.sidebar = false;
  }
}

export const appState = new AppState();

const sessionPage = window.sessionStorage.getItem("page");
if (sessionPage) {
  try {
    const {name, tag} = JSON.parse(sessionPage);
    if (name && tag) {
      appState.page = {
        name, tag
      };
      import(`@modules/${name}/component.js`).then((module) => {
        appState.page = {name, tag: module.tag};
      }).catch((error) => {
        console.error(`Failed to restore module "${name}":`, error);
        appState.page = null;
        window.sessionStorage.removeItem("page");
      });
    }
    else {
      window.sessionStorage.removeItem("page");
    }
  }
  catch (error) {
    window.sessionStorage.removeItem("page");
  }
}
