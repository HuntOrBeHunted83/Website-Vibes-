import  {getAllVibes, getAudioFromVibe, updateUrlToAudioMap, getVibeFromUrlAndText} from './common.js' ;
let currentActiveTabId = null;
let creatingOffscreen

async function createOffScreenDoc (url) {
  console.log("chrome.runtime", chrome.runtime)
  console.log("self.clients", self.clients)
  const offscreenUrl = chrome.runtime.getURL('offscreen.html');
  // const offscreenUrl = "https://live365.com/station/101-SMOOTH-JAZZ-a55660"
  let offscreenDocExists = false;

  if ('getContexts' in chrome.runtime) {
    const contexts = await chrome.runtime.getContexts({
      contextTypes: ['OFFSCREEN_DOCUMENT'],
      documentUrls: [offscreenUrl],
    });

    if (contexts.length > 0) {
      offscreenDocExists = true;
      console.log('Offscreen Doc already created');
    }
  } else {
    const clients = await self.clients.matchAll();
    offscreenDocExists = clients.some((client) => client.url === offscreenUrl);
  }

  if (!offscreenDocExists) {
    if (!creatingOffscreen) {
      creatingOffscreen = chrome.offscreen.createDocument({
        url: 'offscreen.html',
        reasons: ['AUDIO_PLAYBACK'],
        justification: "Plays background music matching the vibe of the active tab"
      });

      await creatingOffscreen;
      creatingOffscreen = null;
      console.log('Offscreen Document Made');
    } else {
      await creatingOffscreen;
    }
  }

  chrome.runtime.sendMessage({ type: 'PLAY_AUDIO', url });
  const clients = await self.clients.matchAll();
  console.log("End chrome.runtime", chrome.runtime)
  console.log("End self.clients", clients, self.clients)
}

chrome.tabs.onUpdated.addListener(async(tabId, changeInfo, tab) => {
  console.log("onUpdated page not ready", tab.status , tab.active, tab.focused)
  if (tab.status !== "complete" || !tab.active ) {

    return;
  }

  currentActiveTabId = tabId;

  try {
    let pageText = await chrome.tabs.sendMessage(tabId, { type: "GET_TEXT" });
    console.log("Page Text Recived: ", pageText);
    const offscreenUrl = getVibeFromUrlAndText(pageText.text, tab.url)
    if (offscreenUrl)
      createOffScreenDoc(offscreenUrl);
  } catch (err) {
    console.log("Could not reach content script:", err.message);
  }
});

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  currentActiveTabId = activeInfo.tabId;
  const tab = await chrome.tabs.get(activeInfo.tabId);

  console.log("onActivated ", activeInfo)
  if (tab.status !== "complete" ) {
    console.log("page not ready")
    return;
  }

  try {
    let pageText = await chrome.tabs.sendMessage(activeInfo.tabId, { type: "GET_TEXT" });
    console.log("Page Text Recived: ", pageText);
    const offscreenUrl = getVibeFromUrlAndText(pageText.text, tab.url)
    if (offscreenUrl)
      createOffScreenDoc(offscreenUrl);
  } catch (err) {
    console.log("Could not reach content script:", err.message);
  }
});


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "GET_TRACKS") {
    console.log("onMessage", getAllVibes(message.tabUrl))
    // Only send id/name to the popup — it doesn't need the raw URLs.
    sendResponse({
      tracks: getAllVibes(message.tabUrl),
    });
    return; // synchronous response, no need to return true
  }else if (message.type === "SAVE_AUDIO"){
    console.log("saveSettings", message.tabUrl, message.trackSelect)
    updateUrlToAudioMap(message.tabUrl,message.trackSelect)
    createOffScreenDoc(getAudioFromVibe(message.trackSelect));
  }
})

chrome.tabs.onRemoved.addListener((tabId) => {
  console.log("onRemoved", tabId, currentActiveTabId)
    if (tabId === currentActiveTabId) {
          chrome.runtime.sendMessage({ type: 'STOP_AUDIO' });
 
    }
});

chrome.tabs.onCreated.addListener((tab) => {
    console.log("onCreated", tab)
    chrome.runtime.sendMessage({ type: 'STOP_AUDIO' });
});