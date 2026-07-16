chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "GET_TEXT") {
    sendResponse({ text: document.body.innerText });
  } 
});


