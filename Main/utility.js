import {Notification} from "electron";
import {fileURLToPath} from "url";
import path from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateNotification = (title, body, icon, clickFunction) => {
  if (clickFunction !== undefined && typeof clickFunction == "function") {
    let notification = new Notification({
      title: title,
      body: body,
      icon: path.join(path.dirname(__dirname), icon)
    })
    notification.on("click", function(event, arg) {
      clickFunction();
    });
    notification.show();
  }
  else {
    new Notification({
      title: title,
      body: body,
      icon: path.join(path.dirname(__dirname), icon)
    }).show();
  }
};
