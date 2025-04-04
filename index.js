import {BrowserWindow, Tray, Menu, Notification, app, ipcMain, globalShortcut, dialog} from "electron";
import {fileURLToPath} from "url";
import Store from "electron-store";
import path from "path";
import fs from "fs";

import {generateNotification} from "./Main/utility.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ipc = ipcMain;
const store = new Store();

const MODULES_PATH = (app.isPackaged) ? "./resources/app/Modules" : "./Modules";

const modules = fs.readdirSync(MODULES_PATH, {
  withFileTypes: true
}).filter(dirent => dirent.isDirectory()).map(dirent => dirent.name);

function setDefaultSettings() {
  store.set("settings", {
    theme: "light",
    startInTray: false,
    developerMode: false,
    window: {
      width: 1280,
      height: 720,
      fullscreen: false
    }
  });
}

function registerShortcuts() {
  globalShortcut.register("Control+Q", () => {
    app.isQuiting = true;
    app.quit();
  });
  globalShortcut.register("Control+Shift+R", () => {
    app.relaunch();
    app.exit();
  });
}

function unregisterShortcuts() {
  globalShortcut.unregisterAll();
}

if (!store.has("settings")) {
  setDefaultSettings();
}

const createWindowAndTray = () => {

  const window = new BrowserWindow({
    width: store.get("settings.window.width") || 1280,
    height: store.get("settings.window.height") || 720,
    minWidth: 1120,
    minHeight: 630,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: false,
      devTools: (!app.isPackaged || store.get("settings.developerMode"))
    },
    frame: false,
    autoHideMenuBar: true,
    resizable: true,
    maximizable: true,
    icon: path.join(__dirname, "Main/Icon.png")
  });
  window.loadFile("Main/index.html");

  if (store.get("settings.window.fullscreen")) {
    window.maximize();
  }
  if (store.get("settings.startInTray") === true) {
    window.hide();
    generateNotification("Flexular", "Flexular is running in the background.", "Main/Icon.png", function() {
      window.show();
    });
  }

  window.on("close", function(event) {
    if (!app.isQuiting) {
      event.preventDefault();
      window.hide();
    }
  });

  const tray = new Tray(path.join(__dirname, "Main/Icon.png"));
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Show Flexular",
      click: function() {
        window.show();
      }
    },
    {
      label: "Quit Flexular",
      click: function() {
        app.isQuiting = true;
        window.close();
      }
    }
  ]);
  tray.setContextMenu(contextMenu);
  tray.setToolTip("Flexular");

  tray.on("click", function(event) {
    window.show();
  });

  ipc.on("MinimiseApp", () => {
    window.minimize();
  });
  ipc.on("ResizeApp", () => {
    if (window.isMaximized()) {
      window.unmaximize();
    }
    else {
      window.maximize();
    }
  });
  ipc.on("CloseApp", () => {
    window.hide();
  });

  ipc.on("ResetSettings", (event) => {
    setDefaultSettings();
    event.sender.send("GetSettings", store.get("settings"));
  });

  ipc.on("UpdateSettings", (event, key, value) => {
    store.set(`settings.${key}`, value);
  });

  ipc.on("GetModules", (event) => {
    event.sender.send("ModulesList", modules);
  });

  ipc.on("GetSettings", (event) => {
    event.sender.send("GetSettings", store.get("settings"));
  });

  ipc.on("ClearAllData", (event) => {
    store.clear();
    setDefaultSettings();
    app.isQuiting = true;
    app.quit();
  });

  window.on("close", () => {
    let fullscreenState = window.isMaximized();
    window.unmaximize();
    let windowSize = window.getSize();
    store.set("settings.window", {
      width: windowSize[0],
      height: windowSize[1],
      fullscreen: fullscreenState
    });
  });

  window.on("focus", () => {
    registerShortcuts();
  });

  window.on("blur", () => {
    unregisterShortcuts();
  });

};

app.whenReady().then(() => {
  createWindowAndTray();
});

app.on("window-all-closed", () => {
  if (process.platform !== "DARWIN".toLowerCase()) {
    app.quit();
  }
});

app.on("will-quit", () => {
  unregisterShortcuts();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindowAndTray();
  }
});

app.setAppUserModelId("Flexular");

for (let i = 0; i < modules.length; i++) {
  if (fs.existsSync(`${MODULES_PATH}/${modules[i]}/index.js`)) {
    await import(`./Modules/${modules[i]}/index.js`);
  }
}
