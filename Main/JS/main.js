ipc.send("GetSettings");

ipc.on("GetSettings", (event, settings) => {
  $("#themeselection").val(settings.theme)
  $("#startontray").prop("checked", settings.startInTray);
  $("#developermode").prop("checked", settings.developerMode);
});

$("#themeselection").on("change", function() {
  ipc.send("UpdateSettings", "theme", this.value);
});
$("#startontray").on("change", function() {
  ipc.send("UpdateSettings", "startInTray", $(this).is(":checked"));
});
$("#developermode").on("change", function() {
  ipc.send("UpdateSettings", "developerMode", $(this).is(":checked"));
});

$("#reset").on("click", function() {
  ipc.send("ResetSettings");
});
$("#clear").on("click", function() {
  ipc.send("ClearAllData");
});
