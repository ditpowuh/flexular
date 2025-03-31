import {ipcMain} from "electron";
import schedule from "node-schedule";
import Store from "electron-store";

import {generateNotification} from "../../Main/utility.js";

const ipc = ipcMain;
const store = new Store();

const WATER_ICON = "Modules/nurture/Icons/Water Bottle.png";

var waterReminder = null;

ipc.on("GetNurtureData", (event) => {
  if (store.get("nurture")) {
    event.sender.send("LoadNurtureData", store.get("nurture.waterreminder"));
  }
});
ipc.on("SaveWaterReminder", (event, data) => {
  store.set("nurture.waterreminder", data);
  if (waterReminder !== null) {
    waterReminder.cancel();
    waterReminder = null;
  }
  waterReminder = schedule.scheduleJob(`*/${store.get("nurture.waterreminder.minutes")} ${store.get("nurture.waterreminder.startTime")}-${store.get("nurture.waterreminder.endTime")} * * *`, function() {
    if (store.get("nurture.waterreminder.enabled") === true) {
      generateNotification("Drink water!", "It's time to drink some water.", WATER_ICON);
    }
  });

});

if (store.get("nurture.waterreminder")) {
  waterReminder = schedule.scheduleJob(`*/${store.get("nurture.waterreminder.minutes")} ${store.get("nurture.waterreminder.startTime")}-${store.get("nurture.waterreminder.endTime")} * * *`, function() {
    if (store.get("nurture.waterreminder.enabled") === true) {
      generateNotification("Drink water!", "It's time to drink some water.", WATER_ICON);
    }
  });
}
else {
  store.set("nurture.waterreminder", {
    enabled: false,
    minutes: 30,
    startTime: 7,
    endTime: 23
  });
}
