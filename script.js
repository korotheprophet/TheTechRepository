import { files } from "./data.js";

document.addEventListener("DOMContentLoaded", () => {
  const lenis = new Lenis({
    autoRaf: true,
  });

  const filesListContainer = document.querySelector(".files-list");
  const filesList = document.querySelector(".files-list");

  const POSITIONS = {
    BOTTOM: 0,
    MIDDLE: -80,
    TOP: -160,
  };

  let lastMousePosition = { x: 0, y: 0 };
  let activeFile = null;
  let ticking = false;

  files.forEach((file) => {
    const fileElement = document.createElement("div");
    fileElement.className = "file";

    fileElement.innerHTML = `
      <div class="file-wrapper">
        <div class="file-name">
          <h1>${file.name}</h1>
          <h1>${file.type}</h1>
        </div>
        <div class="file-project">
          <h1>${file.project}</h1>
          <h1>${file.label}</h1>
        </div>
        <div class="file-name">
          <h1>${file.name}</h1>
          <h1>${file.type}</h1>
        </div>
      </div>
    `;

    filesListContainer.appendChild(fileElement);
  });

  const filesElements = document.querySelectorAll(".file");

  const updateFiles = () => {
    if (activeFile) {
      const rect = activeFile.getBoundingClientRect();
      const isStillOver =
        lastMousePosition.x >= rect.left &&
        lastMousePosition.x <= rect.right &&
        lastMousePosition.y >= rect.top &&
        lastMousePosition.y <= rect.bottom;

      if (!isStillOver) {
        const wrapper = activeFile.querySelector(".file-wrapper");
        const leavingFromTop = lastMousePosition.y < rect.top + rect.height / 2;

        gsap.to(wrapper, {
          y: leavingFromTop ? POSITIONS.TOP : POSITIONS.BOTTOM,
          duration: 0.4,
          ease: "power2.out",
        });
        activeFile = null;
      }
    }

    filessElements.forEach((file, index) => {
      if (file === activeFile) return;

      const rect = file.getBoundingClientRect();
      const isMouseOver =
        lastMousePosition.x >= rect.left &&
        lastMousePosition.x <= rect.right &&
        lastMousePosition.y >= rect.top &&
        lastMousePosition.y <= rect.bottom;

      if (isMouseOver) {
        const wrapper = file.querySelector(".file-wrapper");

        gsap.to(wrapper, {
          y: POSITIONS.MIDDLE,
          duration: 0.4,
          ease: "power2.out",
        });
        activeFile = file;
      }
    });

    ticking = false;
  };

  document.addEventListener("mousemove", (e) => {
    lastMousePosition.x = e.clientX;
    lastMousePosition.y = e.clientY;
  });

  document.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateFiles();
        });
        ticking = true;
      }
    },
    { passive: true }
  );

  filesElements.forEach((file, index) => {
    const wrapper = file.querySelector(".file-wrapper");
    let currentPosition = POSITIONS.TOP;

    file.addEventListener("mouseenter", (e) => {
      activeFile = file;
      const rect = file.getBoundingClientRect();
      const enterFromTop = e.clientY < rect.top + rect.height / 2;

      if (enterFromTop || currentPosition === POSITIONS.BOTTOM) {
        currentPosition = POSITIONS.MIDDLE;
        gsap.to(wrapper, {
          y: POSITIONS.MIDDLE,
          duration: 0.4,
          ease: "power2.out",
        });
      }
    });

    file.addEventListener("mouseleave", (e) => {
      activeFile = null;
      const rect = file.getBoundingClientRect();
      const leavingFromTop = e.clientY < rect.top + rect.height / 2;

      currentPosition = leavingFromTop ? POSITIONS.TOP : POSITIONS.BOTTOM;
      gsap.to(wrapper, {
        y: currentPosition,
        duration: 0.4,
        ease: "power2.out",
      });
    });
  });
});
