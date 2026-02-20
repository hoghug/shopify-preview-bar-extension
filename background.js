const ICONS = {
  open: { 16: "icons/eye-open-16.png", 48: "icons/eye-open-48.png" },
  closed: { 16: "icons/eye-closed-16.png", 48: "icons/eye-closed-48.png" },
};

function setIcon(tabId, hidden) {
  chrome.action.setIcon({
    tabId,
    path: hidden ? ICONS.closed : ICONS.open,
  });
}

// Single click on the extension icon toggles the preview bar
chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.sendMessage(tab.id, { action: "toggle" }, (response) => {
    if (chrome.runtime.lastError || !response) return;
    setIcon(tab.id, response.hidden);
  });

  // Fetch theme info for the tooltip
  chrome.tabs.sendMessage(tab.id, { action: "getStatus" }, (response) => {
    if (chrome.runtime.lastError || !response) return;
    if (response.themeName) {
      let title = response.themeName;
      if (response.themeRole) title += ` (${response.themeRole})`;
      chrome.action.setTitle({ tabId: tab.id, title });
    }
  });
});
