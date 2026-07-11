chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "PAGE_TEXT") {
    sendResponse({ text: document.body.innerText });
  }
});