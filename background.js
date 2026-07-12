let creatingOffscreen;

async function createOffScreenDoc (url) {
  const offscreenUrl = chrome.runtime.getURL('offscreen.html');
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
        justification: "",
      });

      await creatingOffscreen;
      creatingOffscreen = null;
      console.log('Offscreen Document Made');
    } else {
      await creatingOffscreen;
    }
  }

  chrome.runtime.sendMessage({ type: 'PLAY_AUDIO', url });
}


chrome.runtime.onStartup.addListener(() => {
  createOffScreenDoc(chrome.runtime.getURL('chime.mp3'));
  console.log('Extension started, offscreen document ensured');
});




chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId);

  if (tab.status !== "complete" ) {
    console.log("page not ready")
    return;
  }

  try {
    let pageText = await chrome.tabs.sendMessage(activeInfo.tabId, { type: "PAGE_TEXT" });
    console.log("Page Text Received: ", pageText.text);
    setMood(pageText.text)

    createOffScreenDoc(chrome.runtime.getURL('songs/believer.mp3'));
  } catch (err) {
    console.log("Could not reach content script:", err.message);
  }
});