let player = null

function playAudio(url) {
    if (!url){
        stopAudio()
    }

    if (!player) {
        player = new Audio();
        player.addEventListener('error', (e) => {
        console.error('Audio playback failed:', e);
        });
    }
    player.src = url;
    player.currentTime = 0;
    player.loop = true;   
    player.play().catch((err) => console.error('play() rejected:', err));
}

function stopAudio() {
    if (player) {
        player.pause();
        player.currentTime = 0;
    }
}

chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'PLAY_AUDIO') {
        playAudio(message.url);
    } else if (message.type === 'STOP_AUDIO') {
        stopAudio();
    }
});