export default function loadPartial(target, file) {
  fetch(file)
    .then((res) => res.text())
    .then((html) => {
      const el =
        typeof target === "string" ? document.querySelector(target) : target;
      el.innerHTML = html;
    })
    .catch((err) => console.error("Failed to load partial:", err));
}
