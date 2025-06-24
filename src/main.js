import Styler from "./styler";
import loadPartial from "./loadPartial";

let zIndexCounter = 2;
const styler = new Styler();

// App definitions
const allApps = {
  myComputer: {
    name: "My Computer",
    icon: "<i class='ri-computer-fill'></i>",
    content: "",
  },
  notepad: {
    name: "Notepad",
    icon: "<i class='ri-booklet-fill'></i>",
    content: "",
  },
  notion: {
    name: "Notion",
    icon: "<i class='ri-notion-fill'></i>",
    content: "",
  },
  trash: {
    name: "Trash",
    icon: "<i class='ri-delete-bin-5-fill'></i>",
    content: "",
  },
  fileManager: {
    name: "File Manager",
    icon: "<i class='ri-folder-6-fill'></i>",
    content: "",
  },
  chrome: {
    name: "Chrome",
    icon: "<i class='ri-chrome-fill'></i>",
    content: "",
  },
  terminal: {
    name: "Terminal",
    icon: "<i class='ri-terminal-box-fill'></i>",
    content: "",
  },
};

// Helpers for window controls
function closeWindow(appWindow, taskItem) {
  appWindow.remove();
  if (taskItem) taskItem.remove();
}

function minimizeWindow(appWindow) {
  appWindow.styler({ display: "none" });
}

function toggleMaximizeWindow(appWindow) {
  if (!appWindow.dataset.maximized) {
    // store previous state
    const rect = appWindow.getBoundingClientRect();
    appWindow.dataset.prevTop = appWindow.style.top || `${rect.top}px`;
    appWindow.dataset.prevLeft = appWindow.style.left || `${rect.left}px`;
    appWindow.dataset.prevWidth = appWindow.style.width || `${rect.width}px`;
    appWindow.dataset.prevHeight = appWindow.style.height || `${rect.height}px`;

    // maximize using styler
    appWindow.styler({
      top: "0",
      left: "0",
      width: "100vw",
      height: "calc(100vh - 3rem)",
    });
    appWindow.dataset.maximized = "true";
  } else {
    // restore using styler
    appWindow.styler({
      top: appWindow.dataset.prevTop,
      left: appWindow.dataset.prevLeft,
      width: appWindow.dataset.prevWidth,
      height: appWindow.dataset.prevHeight,
    });
    delete appWindow.dataset.maximized;
  }
  appWindow.styler({ zIndex: zIndexCounter++ });
}

function attachWindowControls(appWindow, taskItem) {
  const btnClose = appWindow.querySelector(".window__btn.close");
  const btnMinimize = appWindow.querySelector(".window__btn.minimize");
  const btnMaximize = appWindow.querySelector(".window__btn.maximize");
  const header = appWindow.querySelector(".window__header");

  btnClose?.addEventListener("click", () => closeWindow(appWindow, taskItem));
  btnMinimize?.addEventListener("click", () => minimizeWindow(appWindow));
  btnMaximize?.addEventListener("click", () => toggleMaximizeWindow(appWindow));

  // Double-click header to toggle maximize/restore
  header?.addEventListener("dblclick", () => toggleMaximizeWindow(appWindow));
}

// Format app key to display name
function formatAppName(key) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (c) => c.toUpperCase())
    .trim();
}

// Inject desktop icons
(function injectApps() {
  const grid = document.querySelector(".app__grid");
  Object.keys(allApps).forEach((appKey) => {
    const icon = document.createElement("div");
    icon.classList.add("desktop__icon");
    icon.dataset.app = appKey;
    icon.innerHTML = `${
      allApps[appKey].icon
    }<p class='app__name'>${formatAppName(appKey)}</p>`;
    grid.appendChild(icon);
  });
})();

// Handle double-click on desktop icons
document.addEventListener("dblclick", (e) => {
  const icon = e.target.closest(".desktop__icon");
  if (!icon) return;
  openApp(icon.dataset.app);
});

// Open or focus app window
function openApp(appKey) {
  let win = document.querySelector(`.app__window[data-app=\"${appKey}\"]`);
  if (win) {
    win.styler({ display: "block", zIndex: zIndexCounter++ });
    return;
  }

  // create window
  win = document.createElement("div");
  win.classList.add("app__window");
  win.dataset.app = appKey;
  win.innerHTML = `
    <div class="window__header">
      <p class="window__name">${allApps[appKey].name}</p>
      <div class="btn__group">
        <button class="window__btn minimize"><i class="ri-subtract-fill"></i></button>
        <button class="window__btn maximize"><i class="ri-expand-diagonal-fill"></i></button>
        <button class="window__btn close"><i class="ri-close-large-fill"></i></button>
      </div>
    </div>
    <div class="window__content">
      ${allApps[appKey].content || "<p>Content not available.</p>"}
    </div>`;

  document.body.appendChild(win);
  win.styler({
    drag: ".window__header",
    resize: true,
    minWidth: "25rem",
    minHeight: "25rem",
    zIndex: zIndexCounter++,
    top: Math.random() * 10 + "rem",
    left: Math.random() * 10 + "rem",
  });

  // add to taskbar
  addAppToTaskbar(win);
}

// Taskbar integration
function addAppToTaskbar(appWindow) {
  const bar = document.querySelector(".task__items__list");
  const item = document.createElement("button");
  item.classList.add("task__item");
  item.dataset.app = appWindow.dataset.app;
  item.innerHTML = allApps[appWindow.dataset.app].icon;

  // running style
  item.styler({
    background: "rgba(66, 66, 66, 0.33)",
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
    backdropFilter: "blur(7.9px)",
    WebkitBackdropFilter: "blur(7.9px)",
    border: "1px solid rgba(66, 66, 66, 0.22)",
  });
  bar.appendChild(item);

  // restore or focus on click
  item.addEventListener("click", () =>
    appWindow.styler({ display: "block", zIndex: zIndexCounter++ })
  );

  // open on double-click if closed
  item.addEventListener("dblclick", () => openApp(item.dataset.app));

  // attach window controls & header dblclick
  attachWindowControls(appWindow, item);
}

// bring window to front when clicking inside
document.addEventListener("click", (e) => {
  const win = e.target.closest(".app__window");
  if (win) win.styler({ zIndex: zIndexCounter++ });
});

function getFormattedTime() {
  const date = new Date();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

function getFormattedDate() {
  const date = new Date();
  const weekdays = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];

  const day = weekdays[date.getDay()];
  const month = months[date.getMonth()];
  const dayNum = date.getDate();

  return `${day}, ${month} ${dayNum}`;
}

const taskbarTimeElement = document.querySelector(".taskbar__time");
const taskbarDateElement = document.querySelector(".taskbar__date");
taskbarTimeElement.textContent = getFormattedTime();
taskbarDateElement.textContent = getFormattedDate();
