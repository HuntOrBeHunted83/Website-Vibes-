import  {getMood} from './common.js' ;

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
        justification: ""
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
    let pageText = await chrome.tabs.sendMessage(activeInfo.tabId, { type: "GET_TEXT" });
    console.log("Page Text Recived: ", pageText);
    const offscreenUrl = getMood(pageText.text, tab.url)
    // const offscreenUrl = "https://ice.somafm.com/thetrip-128-mp3"
    // createOffScreenDoc(chrome.runtime.getURL('songs/believer.mp3'));
    createOffScreenDoc(offscreenUrl);
  } catch (err) {
    console.log("Could not reach content script:", err.message);
  }
});


