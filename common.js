export const moodCreater = {
    store: ["shop", "cart", "checkout", "reviews", "price", "shipping", "payment", "sale", "discount", "product"],
    news: ["headline", "news", "article", "editor", "journalist", "media", "archive", "breaking", "report", "columnist"],
    socialMedia: ["likes", "comment", "follow", "feed", "share", "post", "hashtag", "story", "notification", "profile"],
    videoGame: ["game", "play", "wishlist", "offers", "leaderboard", "DLC", "achievement", "sale", "gameplay", "controller"],
    travel: ["travel", "itinerary", "booking", "hotel", "flight", "layover", "destination", "reservation", "passport", "excursion"],
    learning: ["course", "lesson", "curriculum", "quiz", "assignments", "score", "module", "progress", "certificate", "tutorial"],
    portfolio: ["resume", "gallery", "blog", "projects", "skills", "contact", "experience", "bio", "showcase", "testimonial"],
    finance: ["invoice", "balance", "portfolio", "stock", "budget", "transaction", "interest", "dividend", "credit", "expense"],
    health: ["symptom", "diagnosis", "prescription", "appointment", "wellness", "fitness", "nutrition", "therapy", "clinic", "vitals"],
    food: ["recipe", "ingredient", "menu", "cuisine", "restaurant", "delivery", "review", "nutrition", "cook", "flavor"]
};

export const audioTrackStorage = {
  store: "https://ice.somafm.com/poptron-128-mp3",
  news: "https://ice.somafm.com/sf1033-128-mp3",
  socialMedia: "https://ice.somafm.com/indiepop-128-mp3",
  videoGame: "https://ice.somafm.com/cliqhop-128-mp3",
  travel: "https://ice.somafm.com/suburbsofgoa-128-mp3",
  learning: "https://ice.somafm.com/dronezone-128-mp3",
  portfolio: "https://ice.somafm.com/secretagent-128-mp3",
  finance: "https://ice.somafm.com/illstreet-128-mp3",
  health: "https://ice.somafm.com/groovesalad-128-mp3",
  food: "https://ice.somafm.com/bossa-128-mp3",
};



export function getMood(text){

  let moodSorter = {}
  let words = text.toLowerCase().trim().split(/\s+/);
  //console.log(words)
  for (let i = 0; i < words.length; i = i + 1 ) {
    // console.log(i, " ", words[i])
    for (const [key, value] of Object.entries(moodCreater)) {      
      // console.log(key, " ", value)
      if (value.includes(words[i])){
        console.log("print ", words[i], "  ",  key, " " ,moodCreater[key])
        if (!moodSorter[key]){
          moodSorter[key] = 1
          //console.log("No match found yet, set to 1: " + key + moodSorter[key])
        }else{
          moodSorter[key] = moodSorter[key] + 1
          //console.log("Match Found, increased value by 1 " + key + moodSorter[key])
        }
      }
    }
  }

  console.log("moodSorter", moodSorter)
  let maxVibe = getMaxVibe(moodSorter)

  let audioTrack = vibeToTrack(maxVibe)
  return audioTrack
}

export function getMaxVibe(moodSorter){
  let bigKey
  let bigValue = 0
  for (const [key,value] of Object.entries(moodSorter)) {
    if (bigValue < value){
      bigKey = key
      bigValue = value
    }
  }
  return bigKey
}


export function vibeToTrack(vibe){
    let audioTrack = ""
    audioTrack = audioTrackStorage[vibe]
    return audioTrack; 
}