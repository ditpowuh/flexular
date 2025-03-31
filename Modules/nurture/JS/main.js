const availableMinutes = [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60];
const defaultMinutes = availableMinutes.indexOf(30);

var currentSelectedMinutes = defaultMinutes;
ipc.send("GetNurtureData");

function updateWaterReminder() {
  if ($("#starttime").val() == "" || $("#endTime").val() == "") {
    return;
  }
  ipc.send("SaveWaterReminder", {
    enabled: $("#waterenabled").is(":checked"),
    minutes: availableMinutes[currentSelectedMinutes],
    startTime: parseInt($("#starttime").val().split(":")[0], 10),
    endTime: parseInt($("#endtime").val().split(":")[0], 10)
  });
}

$("#reduceminute").on("click", function() {
  if (currentSelectedMinutes > 0) {
    currentSelectedMinutes = currentSelectedMinutes - 1;
    $("#water").html(availableMinutes[currentSelectedMinutes]);
    updateWaterReminder();
  }
});
$("#increaseminute").on("click", function() {
  if (currentSelectedMinutes < availableMinutes.length - 1) {
    currentSelectedMinutes = currentSelectedMinutes + 1;
    $("#water").html(availableMinutes[currentSelectedMinutes]);
    updateWaterReminder();
  }
});

ipc.on("LoadNurtureData", (event, waterReminderData) => {
  currentSelectedMinutes = availableMinutes.indexOf(waterReminderData.minutes);
  $("#water").html(availableMinutes[currentSelectedMinutes]);
  $("#starttime").val((waterReminderData.startTime < 10) ? `0${waterReminderData.startTime}:00` : `${waterReminderData.startTime}:00`);
  $("#endtime").val((waterReminderData.endTime < 10) ? `0${waterReminderData.endTime}:00` : `${waterReminderData.endTime}:00`);
  $("#waterenabled").prop("checked", waterReminderData.enabled);
});

$("#waterenabled, #starttime, #endtime").on("change", function() {
  if ($("#endtime").val() == "00:00") {
    $("#endtime").val("23:00");
  }
  updateWaterReminder();
});
