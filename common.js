export const vibeToWordsMap = {
    store: ["shop", "cart", "checkout", "reviews", "price", "shipping", "payment", "sale", "discount", "product"],
    news: ["headline", "news", "article", "editor", "journalist", "media", "archive", "breaking", "report", "columnist"],
    socialMedia: ["likes", "comment", "follow", "feed", "share", "post", "hashtag", "story", "notification", "profile"],
    videoGame: ["game", "play", "wishlist", "offers", "leaderboard", "DLC", "achievement", "sale", "gameplay", "controller"],
    travel: ["travel", "itinerary", "booking", "hotel", "flight", "layover", "destination", "reservation", "passport", "excursion"],
    learning: ["course", "lesson", "curriculum", "quiz", "assignments", "score", "module", "progress", "certificate", "tutorial"],
    finance: ["invoice", "balance", "portfolio", "stock", "budget", "transaction", "interest", "dividend", "credit", "expense"],
    health: ["symptom", "diagnosis", "prescription", "appointment", "wellness", "fitness", "nutrition", "therapy", "clinic", "vitals"],
    food: ["recipe", "ingredient", "menu", "cuisine", "restaurant", "delivery", "review", "nutrition", "cook", "flavor"],
    entertainment: ["movie", "show", "streaming", "episode", "trailer", "celebrity", "review", "cast", "genre", "premiere"],
    chatbot: ["assistant", "conversation", "prompt", "response", "message", "chat", "AI", "query", "session", "reply"]
};

const vibeToAudioMap = {
  store: "https://ice.somafm.com/poptron-128-mp3",
  news: "https://ice.somafm.com/sf1033-128-mp3",
  socialMedia: "https://ice.somafm.com/indiepop-128-mp3",
  videoGame: "https://ice.somafm.com/cliqhop-128-mp3",
  travel: "https://ice.somafm.com/suburbsofgoa-128-mp3",
  learning: "https://ice.somafm.com/dronezone-128-mp3",
  finance: "https://ice.somafm.com/illstreet-128-mp3",
  health: "https://ice.somafm.com/groovesalad-128-mp3",
  food: "https://ice.somafm.com/bossa-128-mp3",
  entertainment: "https://ice.somafm.com/seventies-128-mp3",
  chatbot: "https://ice.somafm.com/beatblender-128-mp3",
  noAudio: "",
};

const DEFAULT_TRACK = "https://ice.somafm.com/groovesalad-128-mp3";

const urlToAudioMap = {
    "amazon.com": "store",
    "etsy.com": "store",
    "target.com": "store",
    "walmart.com": "store",
    "ebay.com": "store",
    "shopify.com": "store",
    "bestbuy.com": "store",
    "nytimes.com": "news",
    "bbc.com": "news",
    "cnn.com": "news",
    "theguardian.com": "news",
    "washingtonpost.com": "news",
    "facebook.com": "socialMedia",
    "twitter.com": "socialMedia",
    "tiktok.com": "socialMedia",
    "reddit.com": "socialMedia",
    "linkedin.com": "socialMedia",
    "pinterest.com": "socialMedia",
    "snapchat.com": "socialMedia",
    "tumblr.com": "socialMedia",
    "youtube.com": "entertainment",
    "steampowered.com": "videoGame",
    "epicgames.com": "videoGame",
    "ign.com": "videoGame",
    "gog.com": "videoGame",
    "playstation.com": "videoGame",
    "xbox.com": "videoGame",
    "nintendo.com": "videoGame",
    "expedia.com": "travel",
    "booking.com": "travel",
    "airbnb.com": "travel",
    "tripadvisor.com": "travel",
    "delta.com": "travel",
    "united.com": "travel",
    "khanacademy.org": "learning",
    "udemy.com": "learning",
    "duolingo.com": "learning",
    "codecademy.com": "learning",
    "brilliant.org": "learning",
    "quizlet.com": "learning",
    "mint.com": "finance",
    "chase.com": "finance",
    "bankofamerica.com": "finance",
    "fidelity.com": "finance",
    "coinbase.com": "finance",
    "wellsfargo.com": "finance",
    "cvs.com": "health",
    "cdc.gov": "health",
    "doordash.com": "food",
    "ubereats.com": "food",
    "yelp.com": "food",
    "epicurious.com": "food",
    "grubhub.com": "food",
    "netflix.com": "entertainment",
    "hulu.com": "entertainment",
    "disneyplus.com": "entertainment",
    "imdb.com": "entertainment",
    "rottentomatoes.com": "entertainment",
    "hbomax.com": "entertainment",
    "spotify.com": "entertainment",
    "chat.openai.com": "chatbot",
    "claude.ai": "chatbot",
    "perplexity.ai": "chatbot",
    "copilot.microsoft.com": "chatbot",
    "perplexity.com": "chatbot"
};

export function extractHostname(url) {
    try {
        const hostname = new URL(url).hostname;
        return hostname.replace(/^www\./, "");
    } catch (e) {
        console.log("Failed extractHostname", url, e)
        return null;
    }
}

export function updateUrlToAudioMap(website, audio){
    console.log("updateUrlToAudioMap ", urlToAudioMap, website, audio)
    urlToAudioMap[website] =  audio
}

export function getVibeFromUrlAndText(text, url){

    let audioTrack = null;

    const hostname = extractHostname(url)

    let matchedVibe = getVibeFromTabUrl(hostname)

    if (matchedVibe){
        audioTrack = getAudioFromVibe(matchedVibe)
    }else{
        let vibeSorter = {}
        let words = text.toLowerCase().trim().split(/\s+/).map(w => w.replace(/[^a-z0-9]/g, ""));;
        //console.log(words)
        for (let i = 0; i < words.length; i = i + 1 ) {
            // console.log(i, " ", words[i])
            for (const [key, value] of Object.entries(vibeToWordsMap)) {      
            // console.log(key, " ", value)
                if (value.includes(words[i])){
                    console.log("print ", words[i], "  ",  key, " " ,vibeToWordsMap[key])
                    if (!vibeSorter[key]){
                    vibeSorter[key] = 1
                    //console.log("No match found yet, set to 1: " + key + vibeSorter[key])
                    }else{
                    vibeSorter[key] = vibeSorter[key] + 1
                    //console.log("Match Found, increased value by 1 " + key + vibeSorter[key])
                    }
                }
            }
        }
        console.log("getVibeFromUrlAndText", vibeSorter)
        let maxVibe = getMaxVibe(vibeSorter)
        audioTrack = getAudioFromVibe(maxVibe)
    }    
    return audioTrack 
}

function getMaxVibe(vibeSorter){
  let bigKey
  let bigValue = 0
  for (const [key,value] of Object.entries(vibeSorter)) {
    if (bigValue < value){
      bigKey = key
      bigValue = value
    }
  }
  return bigKey
}

export function getAllVibes(url){
    let vibe = getVibeFromTabUrl(url)
    let vibes = Object.keys(vibeToAudioMap)

    if (vibe){
        const updatedVibes = vibes.filter(item => item !== 'vibe');
        updatedVibes.unshift(vibe)
        return updatedVibes
    }else{
        vibes.unshift("")
        return vibes
    }
}


export function getAudioFromVibe(vibe){
    if (vibe) {
        return vibeToAudioMap[vibe]
    } else {
        return DEFAULT_TRACK
    }    
}

function getVibeFromTabUrl(hostname){
    let matchedVibe = null
    for (const [key, value] of Object.entries(urlToAudioMap)) {
        if (hostname === key || hostname.endsWith("." + key)) {
            matchedVibe = value;
            console.log("getVibeFromTabUrl", hostname, matchedVibe)
            break;
        }
    }
    return matchedVibe
}