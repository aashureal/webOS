class Styler {
  constructor() {
    this.init();
  }

  init() {
    // Extend HTMLElement
    HTMLElement.prototype.styler = function (styles) {
      for (let key in styles) {
        if (key === "drag") {
          const dragArg = styles[key];
          if (dragArg === true) {
            this.enableDrag();
          } else if (typeof dragArg === "string") {
            this.enableDrag(dragArg);
          }
        } else if (key === "resize" && styles[key] === true) {
          this.enableResize();
        } else {
          this.style[key] = styles[key];
        }
      }

      // Always enable bring-to-front on any styled element
      this.enableBringToFront();
    };

    HTMLElement.prototype.enableBringToFront = function () {
      this.addEventListener("mousedown", () => {
        this.style.zIndex = ++Styler.globalZIndex;
      });
    };

    // DRAG SUPPORT
    HTMLElement.prototype.enableDrag = function (selector = null) {
      const el = this;
      el.style.position = "absolute";
      el.style.userSelect = "none";
      el.style.transition = "box-shadow 0.2s ease";

      let offsetX = 0,
        offsetY = 0;
      let dragTarget = selector ? el.querySelector(selector) : el;

      if (!dragTarget)
        return console.warn(
          `Selector ${selector} not found inside element`,
          el
        );

      const onMouseDown = (e) => {
        if (e.target.classList.contains("styler-resize-handle")) return;

        e.preventDefault();
        offsetX = e.clientX - el.getBoundingClientRect().left;
        offsetY = e.clientY - el.getBoundingClientRect().top;

        el.style.zIndex = ++Styler.globalZIndex;
        el.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.2)";

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
      };

      const onMouseMove = (e) => {
        el.style.left = e.clientX - offsetX + "px";
        el.style.top = e.clientY - offsetY + "px";
      };

      const onMouseUp = () => {
        el.style.boxShadow = "none";
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      };

      dragTarget.addEventListener("mousedown", onMouseDown);
    };

    // RESIZE SUPPORT
    HTMLElement.prototype.enableResize = function () {
      const el = this;
      el.style.position = "absolute";

      // Create resize handle
      const handle = document.createElement("div");
      handle.classList.add("styler-resize-handle");
      handle.style.position = "absolute";
      handle.style.width = "10px";
      handle.style.height = "10px";
      handle.style.right = "0";
      handle.style.bottom = "0";
      handle.style.cursor = "nwse-resize";
      handle.style.background = "transparent";
      handle.style.zIndex = "10";

      el.appendChild(handle);

      let startX, startY, startWidth, startHeight;

      handle.addEventListener("mousedown", (e) => {
        e.preventDefault();
        e.stopPropagation(); // prevent drag
        startX = e.clientX;
        startY = e.clientY;
        startWidth = parseInt(
          document.defaultView.getComputedStyle(el).width,
          10
        );
        startHeight = parseInt(
          document.defaultView.getComputedStyle(el).height,
          10
        );

        document.addEventListener("mousemove", doDrag);
        document.addEventListener("mouseup", stopDrag);
      });

      const doDrag = (e) => {
        el.style.width = startWidth + (e.clientX - startX) + "px";
        el.style.height = startHeight + (e.clientY - startY) + "px";
      };

      const stopDrag = () => {
        document.removeEventListener("mousemove", doDrag);
        document.removeEventListener("mouseup", stopDrag);
      };
    };
  }

  static globalZIndex = 1000;
}

export default Styler;
