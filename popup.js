document.addEventListener("DOMContentLoaded", init);

let trackSelect
async function init() {
    trackSelect = document.getElementById("trackSelect");
    trackSelect.addEventListener("change", saveSettings);
    loadTracks();
}

async function saveSettings() {
    if (trackSelect.value && trackSelect.value != ""){
      chrome.runtime.sendMessage({ 
        type: "SAVE_AUDIO", 
        trackSelect: trackSelect.value,
        tabUrl: await getTabUrl(),  
    })
    }
}

async function loadTracks() {
    chrome.runtime.sendMessage({ type: "GET_TRACKS", tabUrl: await getTabUrl()}, (response) => {
      if (chrome.runtime.lastError || !response || !response.tracks) {
        trackSelect.innerHTML = '<option value="">No tracks available</option>';
        return([]);
      }
 
      trackSelect.innerHTML = "";
      for (const track of response.tracks) {
        const option = document.createElement("option");
        option.value = track;
        option.textContent = track;
        trackSelect.appendChild(option);
      }
 
      response.tracks;
    });
  }


async function getTabUrl(){

  const  [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
 
  if (!tab || !tab.url || !tab.url.startsWith("http")) {
    return "";
  }
  let hostname = new URL(tab.url).hostname
  return hostname.replace(/^www\./, "");
}