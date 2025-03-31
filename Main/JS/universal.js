const {ipcRenderer} = require("electron");
const ipc = ipcRenderer;

window.$ = require("jquery");

document.title = "Flexular: " + document.title;

function minimiseApp() {
  ipc.send("MinimiseApp");
}

function resizeApp() {
  ipc.send("ResizeApp");
}

function closeApp() {
  ipc.send("CloseApp");
}

$("#minimisebutton").on("click", minimiseApp);
$("#resizebutton").on("click", resizeApp);
$("#closebutton").on("click", closeApp);

$(window).on("keydown", (event) => {
  if ((event.code === "Minus" || event.code === "Equal") && (event.ctrlKey || event.metaKey)) {
    event.preventDefault();
  }
});

ipc.on("ModulesList", (event, modules) => {
  if ($("#sidebar ul li").length === 0) {
    $("#sidebar ul").append("<li>Home</li>");
  }
  for (let i = 0; i < modules.length; i++) {
    $("#sidebar ul").append(`<li>${modules[i]}</li>`);
  }

  $("#sidebar ul li").each((index, element) => {
    let segmentedPath = decodeURIComponent(window.location.href).split("/");
    if (segmentedPath.at(-2).toLowerCase() == "main" && segmentedPath.at(-3).toLowerCase() != "modules") {
      if ($(element).html() == "Home") {
        $(element).addClass("selected");
      }
    }
    else if (segmentedPath.at(-3).toLowerCase() == "modules" && segmentedPath.at(-2).toLowerCase() == $(element).html().toLowerCase()) {
      $(element).addClass("selected");
    }
    $(element).on("click", function() {
      if (segmentedPath.at(-2).toLowerCase() == "main" && segmentedPath.at(-3).toLowerCase() != "modules") {
        if ($(element).html() != "Home") {
          window.location.href = `../Modules/${$(element).html()}/index.html`;
        }
      }
      else {
        if ($(element).html() == "Home") {
          window.location.href = `../../Main/index.html`;
        }
        else if (segmentedPath.at(-2).toLowerCase() != $(element).html().toLowerCase()) {
          window.location.href = `../${$(element).html()}/index.html`;
        }
      }
    });
  });

});

var sidebar = false;

function toggleSidebar() {
  if (sidebar === true) {
    sidebar = false;
    $("#sidebar").css("width", "0");
  }
  else {
    sidebar = true;
    $("#sidebar").css("width", "25%");
  }
}

$("#menubaricon").on("click", toggleSidebar);
ipc.send("GetModules");
