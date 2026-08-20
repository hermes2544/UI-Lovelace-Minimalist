// UI Lovelace Minimalist mobile tapbar compatibility patch for Home Assistant 2026+
// Runs only when the selected/card-mod theme is "minimalist-mobile-tapbar".
(function () {
  const STYLE_ID = "ulm-mobile-tapbar-ha2026-fix";
  const CSS = `
    .header {
      position: fixed !important;
      top: auto !important;
      bottom: 0px !important;
      left: 0 !important;
      right: 0 !important;
      width: 100% !important;
      z-index: 999 !important;
      height: var(--header-height, 70px) !important;
      transform: none !important;
      box-shadow: var(--footer-shadow, 0px -1px 3px 0px rgba(0,0,0,0.12));
    }
    .toolbar {
      height: var(--header-base-height, 70px) !important;
      padding-bottom: env(safe-area-inset-bottom) !important;
    }
    #view {
      padding-top: 0 !important;
      padding-bottom: var(--header-height, 70px) !important;
    }
    ha-tab-group {
      display: flex !important;
      justify-content: space-evenly !important;
      width: 97% !important;
    }
    ha-tab-group-tab,
    ha-tab,
    paper-tab,
    sl-tab {
      flex: 1 1 auto !important;
      min-width: unset !important;
      justify-content: center !important;
    }
  `;

  function selectedThemeMatches() {
    try {
      const raw = localStorage.getItem("selectedTheme");
      if (raw && JSON.parse(raw).theme === "minimalist-mobile-tapbar") return true;
    } catch (_) {}

    const theme = getComputedStyle(document.documentElement)
      .getPropertyValue("--card-mod-theme")
      .trim();
    return theme === "minimalist-mobile-tapbar";
  }

  function findHuiRootShadow() {
    const ha = document.querySelector("home-assistant");
    const main = ha?.shadowRoot?.querySelector("home-assistant-main");
    const panel = main?.shadowRoot?.querySelector("ha-panel-lovelace");
    const root = panel?.shadowRoot?.querySelector("hui-root");
    return root?.shadowRoot;
  }

  function apply() {
    if (!selectedThemeMatches()) return false;
    const root = findHuiRootShadow();
    if (!root) return false;

    let style = root.getElementById(STYLE_ID);
    if (!style) {
      style = document.createElement("style");
      style.id = STYLE_ID;
      root.appendChild(style);
    }
    if (style.textContent !== CSS) style.textContent = CSS;
    return true;
  }

  function schedule() {
    apply();
    setTimeout(apply, 500);
    setTimeout(apply, 1500);
    setTimeout(apply, 4000);
  }

  window.addEventListener("location-changed", schedule);
  window.addEventListener("hashchange", schedule);
  window.addEventListener("storage", schedule);
  document.addEventListener("visibilitychange", schedule);
  schedule();
  setInterval(apply, 5000);
})();
