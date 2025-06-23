import Styler from "./styler";
import loadPartial from "./loadPartial";

// Init
const styler = new Styler();

const appWindow = document.querySelectorAll("#window");
const windowContent = document.querySelector(".window__content");

(function windowDragHandler() {
  document.querySelectorAll(".window").forEach((win) => {
    win.styler({
      drag: ".window__header",
      resize: true,
    });
  });
})();

// let fileManager = document.querySelector(".file-manager");
// loadPartial(fileManager, "../windows/file-manager.html");
// appWindow.enableDrag(".window__header");

function maxWindow() {
  alert("Chala");
}

// maxWindow();
