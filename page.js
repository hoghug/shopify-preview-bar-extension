// Runs in the MAIN world (page's JS context) so it can access Shopify globals
function emitThemeInfo() {
  var info = {};
  if (window.Shopify && window.Shopify.theme) {
    info.name = window.Shopify.theme.name || null;
    info.id = window.Shopify.theme.id || null;
    info.role = window.Shopify.theme.role || null;
  }
  document.dispatchEvent(
    new CustomEvent("__spb_theme_info__", { detail: info })
  );
}

emitThemeInfo();

// Also listen for re-extraction requests from the content script
document.addEventListener("__spb_request_theme_info__", emitThemeInfo);
