const {ipcRenderer} = require("electron");
const ipc = ipcRenderer;

window.$ = require("jquery");

window.addEventListener("keydown", (event) => {
  if ((event.code === "Minus" || event.code === "Equal") && (event.ctrlKey || event.metaKey)) {
    event.preventDefault();
  }
});
