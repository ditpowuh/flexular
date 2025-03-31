console.log("Hello world from script.js!");

$("#trigger").on("click", function() {
  ipc.send("TemplateTest");
});
