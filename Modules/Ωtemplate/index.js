import {ipcMain, dialog} from "electron";

const ipc = ipcMain;

ipc.on("TemplateTest", (event) => {
  dialog.showMessageBox(null, {
    title: "Hello world!",
    message: "Hello world from index.js!"
  });
});
