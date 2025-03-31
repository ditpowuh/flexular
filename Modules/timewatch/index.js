import {ipcMain} from "electron";
import Store from "electron-store";

const ipc = ipcMain;
const store = new Store();

ipc.on("GetStopwatches", (event) => {
  if (store.has("timewatch.stopwatches")) {
    event.sender.send("LoadStopwatches", store.get("timewatch.stopwatches"));
  }
});

ipc.on("SaveStopwatches", (event, stopwatches) => {
  store.set("timewatch.stopwatches", stopwatches);
});
