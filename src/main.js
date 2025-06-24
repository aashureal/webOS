import Styler from "./styler";
import loadPartial from "./loadPartial";

// Init
const styler = new Styler();


// Window Drag Handler
(function windowDragHandler() {
  document.querySelectorAll(".app__window").forEach((win) => {
    win.styler({
      drag: ".window__header",
      resize: true,
    });
  });
})();


let Terminal = document.querySelector('.terminal-content')

loadPartial(Terminal, '../windows/file-manager.html')


// Window Controls
