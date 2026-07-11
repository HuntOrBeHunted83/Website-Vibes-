
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId);

  if (tab.status !== "complete" ) {
    console.log("page not ready")
    return;
  }

  try {
    let pageText = await chrome.tabs.sendMessage(activeInfo.tabId, { type: "PAGE_TEXT" });
    console.log("Page Text Received: ", pageText.text);
  } catch (err) {
    console.log("Could not reach content script:", err.message);
  }
});



