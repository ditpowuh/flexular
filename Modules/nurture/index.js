import {ipcMain} from "electron";
import schedule from "node-schedule";
import Store from "electron-store";

import {generateNotification} from "../../Main/utility.js";

const ipc = ipcMain;
const store = new Store();

const WATER_ICON = "Modules/nurture/Icons/Water Bottle.png";
const DEFAULT_WATER_REMINDER = {enabled: false, minutes: 30, startTime: 7, endTime: 23};

let waterReminder = null;

function scheduleWaterReminder() {
  if (waterReminder !== null) {
    waterReminder.cancel();
    waterReminder = null;
  }
  const data = store.get("nurture.waterreminder", DEFAULT_WATER_REMINDER);
  waterReminder = schedule.scheduleJob(`*/${data.minutes} ${data.startTime}-${data.endTime} * * *`, function() {
    if (store.get("nurture.waterreminder.enabled") === true) {
      generateNotification("Drink water!", "It's time to drink some water.", WATER_ICON);
    }
  });
}

ipc.on("GetNurtureData", (event) => {
  event.sender.send("LoadNurtureData", store.get("nurture.waterreminder", DEFAULT_WATER_REMINDER));
});
ipc.on("SaveWaterReminder", (event, data) => {
  store.set("nurture.waterreminder", data);
  scheduleWaterReminder();
});

if (!store.get("nurture.waterreminder")) {
  store.set("nurture.waterreminder", DEFAULT_WATER_REMINDER);
}
scheduleWaterReminder();
