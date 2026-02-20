// Content script — runs on all pages, only acts when the Shopify preview bar exists

// page.js runs in the MAIN world and dispatches theme info via custom event
let cachedThemeInfo = null;

document.addEventListener("__spb_theme_info__", (e) => {
  cachedThemeInfo = e.detail;
});

function requestThemeInfo() {
  document.dispatchEvent(new CustomEvent("__spb_request_theme_info__"));
}

function getPreviewBar() {
  return document.getElementById("PBarNextFrameWrapper");
}

function isBarHidden() {
  const bar = getPreviewBar();
  if (!bar) return false;
  return bar.style.display === "none";
}

function hideBar() {
  const bar = getPreviewBar();
  if (!bar) return false;
  bar.style.display = "none";
  document.documentElement.style.setProperty("--preview-bar-height", "0px");
  document.body.style.paddingBottom = "0px";
  return true;
}

function showBar() {
  const bar = getPreviewBar();
  if (!bar) return false;
  bar.style.display = "";
  document.body.style.paddingBottom = "";
  return true;
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getStatus") {
    // Re-request in case it wasn't ready on first load
    requestThemeInfo();
    // Small delay to let the injected script fire the event
    setTimeout(() => {
      const bar = getPreviewBar();
      sendResponse({
        hasBar: !!bar,
        hidden: isBarHidden(),
        themeName: cachedThemeInfo?.name || null,
        themeId: cachedThemeInfo?.id || null,
        themeRole: cachedThemeInfo?.role || null,
      });
    }, 50);
  } else if (message.action === "toggle") {
    if (isBarHidden()) {
      showBar();
      sendResponse({ hidden: false });
    } else {
      hideBar();
      sendResponse({ hidden: true });
    }
  } else if (message.action === "hide") {
    hideBar();
    sendResponse({ hidden: true });
  } else if (message.action === "show") {
    showBar();
    sendResponse({ hidden: false });
  }
  return true; // keep channel open for async
});
