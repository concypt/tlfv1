"use strict";
(() => {
  // bin/live-reload.js
  new EventSource(`http://localhost:${3e3}/esbuild`).addEventListener(
    "change",
    () => location.reload()
  );

  // src/schedule-a-viewing.ts
  $(() => {
    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop)
    });
    const { address } = params;
    const inputAddress = document.querySelector('[data-element="input-listing"]');
    if (address) {
      inputAddress.value = address;
    }
  });
})();
//# sourceMappingURL=schedule-a-viewing.js.map
