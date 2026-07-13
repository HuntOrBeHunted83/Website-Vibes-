// let moodCreater = {
//     store,  ["shop", "cart", "checkout", "reviews", "price", "shipping", "payment", "sale"],
//     news: ["headline", "news", "article", "editor", "journalist", "media", "archive"],
//     socialMedia: ["likes", "comment", "follow", "feed", "share", "post", "hashtag"], // Removed duplicate 'feed'
//     videoGame: ["game", "play", "wishlist", "offers", "leaderboard", "DLC", "achievement", "sale", "gameplay"], // Removed duplicate 'offers'
//     travel: ["travel", "itinerary", "booking", "hotel", "flight", "layover", "destination", "reservation"],
//     learning: ["course", "lesson", "curriculum", "quiz", "assignments", "score", "module", "progress"], // Fixed typos
//     portfolio: ["resume", "gallery", "blog", "projects", "skills", "contact", "experience", "bio"]
// };


// let musics = {
//     {storeMusic, ""},
// }


// function getMood(text){

//   let moodSorter = {}
//   let words = text.trim().split(/\s+/);
//   //console.log(words)
//   for (let i = 0; i < words.length; i = i + 1 ) {
//     // console.log(i, " ", words[i])
//     for (const [key, value] of Object.entries(moodCreater)) {      
//       // console.log(key, " ", value)
//       if (value.includes(words[i])){
//         console.log("print ", words[i], "  ",  key, " " ,moodCreater[key])
//         if (!moodSorter[key]){
//           moodSorter[key] = 1
//           //console.log("No match found yet, set to 1: " + key + moodSorter[key])
//         }else{
//           moodSorter[key] = moodSorter[key] + 1
//           //console.log("Match Found, increased value by 1 " + key + moodSorter[key])
//         }
//       }
//     }
//   }

//   console.log("moodSorter", moodSorter)
//   let maxVibe = getMaxVibe(moodSorter)
//   return maxVibe
// }

// function getMaxVibe(moodSorter){
//   let bigKey
//   let bigValue = 0
//   for (const [key,value] of Object.entries(moodSorter)) {
//     if (bigValue < value){
//       bigKey = key
//       bigValue = value
//     }
//   }
//   return bigKey
// }