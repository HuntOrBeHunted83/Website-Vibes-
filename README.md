# Tab Vibe

A Chrome extension that detects the "vibe" of the page you're browsing and plays matching background music. It classifies pages either by known domain or by scanning page text for topic-related keywords, then plays a genre-appropriate internet radio station.

## How it works

1. **Content script** (`content.js`) gets the visible text of the page (`document.body.innerText`) when asked.
2. **Background service worker** (`background.js`) listens for tab activation/update events, asks the content script for page text, and figures out the "vibe."
3. **Vibe detection** (`common.js`) happens in two ways:
   - **Domain match**: if the page's hostname is in `urlToAudioMap` (or a user override saved from the popup), that vibe is used directly.
   - **Keyword match**: otherwise, the page text is sent in `vibeToWordsMap`, where a category with the most keyword hits wins.
4. **Audio playback**: the matched vibe is mapped to a SomaFM internet radio stream URL (`vibeToAudioMap`) and sent to an **offscreen document** (`offscreen.html` / `offscreen.js`). The offscreen document loops the stream.
5. **Popup UI** (`popup.html` / `popup.js`) lets the user manually pick a track/vibe for the current site. That choice is saved as a per-domain override in `urlToAudioMap` and played immediately.

## File overview

| File | Purpose |
|---|---|
| `manifest.json` | MV3 manifest: permissions, service worker, content script, popup |
| `background.js` | Service worker — tab lifecycle listeners, offscreen document management, message routing |
| `common.js` | Vibe/keyword maps, domain-to-vibe maps, vibe-to-audio maps, and the core classification logic |
| `content.js` | Injected into every page; returns page text on request |
| `offscreen.html` / `offscreen.js` | Hidden document that owns the actual `Audio` element and handles play/stop |
| `popup.html` / `popup.js` | Extension popup UI for manually selecting/overriding a track per domain |


## Permissions

- `tabs`, `activeTab` — read tab URLs and status, message content scripts
- `scripting` — inject/interact with content scripts
- `offscreen` — required to create the offscreen audio document
- Host permissions on `http(s)://*/*` — needed to read page content and match domains

## Installation (unpacked/dev)

1. Go to `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked** and select this project's folder.
4. Browse to any site — Tab Vibe will auto-detect a vibe and start playing matching background audio. Click the extension icon to override the track manually.

