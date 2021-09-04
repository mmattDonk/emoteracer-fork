

// ############################## USERNAME,IMAGE,COLOR ####################################
// ############################## USERNAME,IMAGE,COLOR ####################################
// ############################## USERNAME,IMAGE,COLOR ####################################




// ####################################
// ############# COINS ################
// ####################################

const getCoins = () => {
  let coins = JSON.parse(localStorage.getItem("coins"));
  if(coins === null) coins = 1; // If user loads function for the first time

  return coins
}

const setCoins = (amount, code) => {
  if(typeof amount !== "number") return

  let coins = JSON.parse(localStorage.getItem("coins"));

  if(code === superSecretKeyToAccessUnlimitedAmountOfMoney.code) {
    coins += amount;
    localStorage.setItem("coins", JSON.stringify(coins))
  }

  // Google Tag Manager
  setCoinsTagManager(amount)

}

const clearCoins = (code) => {
  let coins = JSON.parse(localStorage.getItem("coins"));

  if(code === superSecretKeyToAccessUnlimitedAmountOfMoney.code) {
    coins = 0;
    localStorage.setItem("coins", JSON.stringify(coins))
  }
}


// ####################################
// ############# USERNAME #############
// ####################################

// GET USERNAME
const getUsername = () => {
  const username = localStorage.getItem("username");
  return username;
}

// SET USERNAME
const setUsername = (newName) => {
  if (newName === "Auro") {setUsernameColor("#FFD700"); setProfileImg('https://cdn.7tv.app/emote/60d3ffd0448b0762ffbd89e8/3x')}
  localStorage.setItem("username", newName);
}

// GET USERNAME COLOR
const getUsernameColor = () => {
  if (getUsername() === "Auro") {const usernameColor = "#FFD700"; return usernameColor}
  const usernameColor = localStorage.getItem("usernameColor");
  return usernameColor;
}

// SET USERNAME COLOR
const setUsernameColor = (newColor) => {
  localStorage.setItem("usernameColor", newColor);
}


// ####################################
// ########## PROFILE IMAGE ###########
// ####################################

// GET PROFILE IMG
const getProfileImg = () => {
  const profileImg = localStorage.getItem("profileImg")
  return profileImg
}

// SET PROFILE IMG
const setProfileImg = (newImg) => {
  if (newImg === "https://cdn.7tv.app/emote/60d3ffd0448b0762ffbd89e8/3x") {localStorage.setItem("profileImg", "https://cdn.7tv.app/emote/60d3ffd0448b0762ffbd89e8/3x");}
  const ownedAvatars = JSON.parse(localStorage.getItem("ownedAvatars"))
  // Find matching names and set new profile img
  for(let avatar of ownedAvatars) {
    if(avatar === newImg) {
      localStorage.setItem("profileImg", newImg)
    } 
  }
}


// #######################################
// ########## AVATARS / EMOTES ###########
// #######################################

// GET ALL AVATARS THAT THE USER OWNS
const getOwnedAvatars = () => {
  const ownedAvatars = JSON.parse(localStorage.getItem("ownedAvatars"))
  return ownedAvatars
}

// BUY AVATAR
const buyAvatar = (newImg, code) => {
  const ownedAvatars = JSON.parse(localStorage.getItem("ownedAvatars"))

  // Find matching names and set new profile img
  for(let emote of emoteAvatars) {
    if(emote.name === newImg && emote.code === code) {

      if(ownedAvatars.some(e => e === emote.url)) return // IF USER ALREADY OWNS THIS EMOTE, RETURN
      // Remove money from user
      setCoins(-emote.price, superSecretKeyToAccessUnlimitedAmountOfMoney.code)
      // Add avatar to owned avatars
      ownedAvatars.push(emote.url)
      localStorage.setItem("ownedAvatars", JSON.stringify(ownedAvatars))
      // Set avatar as new profile img
      setProfileImg(emote.url)

      // Google Tag Manager
      gtagBuyEmote(emote)
    } 
  }
}


// #######################################
// ############ NAME COLOR ###############
// #######################################

// GET ALL COLORS THAT THE USER OWNS
const getOwnedColors = () => {
  const ownedColors = JSON.parse(localStorage.getItem("ownedColors"))
  return ownedColors
}

// BUY COLOR
const buyColor = (newColor, code) => {
  const ownedColors = JSON.parse(localStorage.getItem("ownedColors"))

  // Find matching color and set new name color
  for(let color of nameColors) {
    if(color.name === newColor && color.code === code) {

      if(ownedColors.some(e => e === color.name)) return // IF USER ALREADY OWNS THIS EMOTE, RETURN
      // Remove money from user
      setCoins(-color.price, superSecretKeyToAccessUnlimitedAmountOfMoney.code)
      // Add avatar to owned avatars
      ownedColors.push(color.name)
      localStorage.setItem("ownedColors", JSON.stringify(ownedColors))
      // Set avatar as new profile img
      setUsernameColor(color.name)

      // Google Tag Manager
      gtagBuyColor(color)
    } 
  }
}


// SET USER PROFILE WHEN HE JOINS WEBSITE FOR THE FIRST TIME
// If he user has this profile img: https://static-cdn.jtvnw.net/emoticons/v1/1/3.0, reset localStorage, this is an old profile image for an older version for the game.

if(getCoins() === null) localStorage.setItem("coins", JSON.stringify(0));

if(getUsername() === null) localStorage.setItem("username", generateUsername());

if(getUsernameColor() === null) localStorage.setItem("usernameColor", "white");

if(getProfileImg() === null || getProfileImg() === "https://static-cdn.jtvnw.net/emoticons/v1/1/3.0") localStorage.setItem("profileImg", "https://cdn.frankerfacez.com/emoticon/418189/4");

const initOwnedAvatars = ["https://cdn.frankerfacez.com/emoticon/418189/4"]
if(getOwnedAvatars() === null || getOwnedAvatars().includes("https://static-cdn.jtvnw.net/emoticons/v1/1/3.0")) localStorage.setItem("ownedAvatars", JSON.stringify(initOwnedAvatars));

const initOwnedColors = ["white"] // Default refers to none
if(getOwnedColors() === null) localStorage.setItem("ownedColors", JSON.stringify(initOwnedColors));



// Username Generator

function generateUsername() {
  let id = "";
  let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let charactersLength = characters.length;
  for (var i = 0; i < 6; i++) {
    id += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return `Guest_${id}`;
}




// ############################## STATS ####################################
// ############################## STATS ####################################
// ############################## STATS ####################################


// #######################################
// ################ TOTAL ################
// #######################################

// GET TOTAL WINS
const getTotalWins = () => {
  const brWins = JSON.parse(localStorage.getItem("brWins"));
  const oneWins = JSON.parse(localStorage.getItem("oneWins"));

  const totalWins = brWins + oneWins

  return totalWins;
}

// GET TOTAL GAMES PLAYED
const getTotalGamesPlayed = () => {
  const brGamesPlayed = JSON.parse(localStorage.getItem("brGamesPlayed"));
  const oneGamesPlayed = JSON.parse(localStorage.getItem("oneGamesPlayed"));

  const totalGamesPlayed = brGamesPlayed + oneGamesPlayed

  return totalGamesPlayed;
}


// #######################################
// ############# BATTLE ROYALE ###########
// #######################################


const brGetWins = () => {
  const brWins = JSON.parse(localStorage.getItem("brWins"));
  return brWins
}
const brIncrementWins = () => {
  const brWins = JSON.parse(localStorage.getItem("brWins")) + 1;
  localStorage.setItem("brWins", JSON.stringify(brWins));
}

const brGetGamesPlayed = () => {
  const brGamesPlayed = JSON.parse(localStorage.getItem("brGamesPlayed"));
  return brGamesPlayed
}
const brIncrementGamesPlayed = () => {
  const brGamesPlayed = JSON.parse(localStorage.getItem("brGamesPlayed")) + 1;
  localStorage.setItem("brGamesPlayed", JSON.stringify(brGamesPlayed));
}

const brGetWinningStreak = () => {
  const brWinningStreak = JSON.parse(localStorage.getItem("brWinningStreak"));
  return brWinningStreak
}
const brIncrementWinningStreak = () => {
  const brWinningStreak = JSON.parse(localStorage.getItem("brWinningStreak")) + 1;
  localStorage.setItem("brWinningStreak", JSON.stringify(brWinningStreak));
}
const brResetWinningStreak = () => {
  localStorage.setItem("brWinningStreak", JSON.stringify(0));
}


if(brGetWins() === null) localStorage.setItem("brWins", JSON.stringify(0));
if(brGetGamesPlayed() === null) localStorage.setItem("brGamesPlayed", JSON.stringify(0));
if(brGetWinningStreak() === null) localStorage.setItem("brWinningStreak", JSON.stringify(0));


// #######################################
// ################ 1 VS 1 ###############
// #######################################

const oneGetWins = () => {
  const oneWins = JSON.parse(localStorage.getItem("oneWins"));
  return oneWins
}
const oneIncrementWins = () => {
  const oneWins = JSON.parse(localStorage.getItem("oneWins")) + 1;
  localStorage.setItem("oneWins", JSON.stringify(oneWins));
}

const oneGetGamesPlayed = () => {
  const oneGamesPlayed = JSON.parse(localStorage.getItem("oneGamesPlayed"));
  return oneGamesPlayed
}
const oneIncrementGamesPlayed = () => {
  const oneGamesPlayed = JSON.parse(localStorage.getItem("oneGamesPlayed")) + 1;
  localStorage.setItem("oneGamesPlayed", JSON.stringify(oneGamesPlayed));
}

const oneGetWinningStreak = () => {
  const oneWinningStreak = JSON.parse(localStorage.getItem("oneWinningStreak"));
  return oneWinningStreak
}
const oneIncrementWinningStreak = () => {
  const oneWinningStreak = JSON.parse(localStorage.getItem("oneWinningStreak")) + 1;
  localStorage.setItem("oneWinningStreak", JSON.stringify(oneWinningStreak));
}
const oneResetWinningStreak = () => {
  localStorage.setItem("oneWinningStreak", JSON.stringify(0));
}


if(oneGetWins() === null) localStorage.setItem("oneWins", JSON.stringify(0));
if(oneGetGamesPlayed() === null) localStorage.setItem("oneGamesPlayed", JSON.stringify(0));
if(oneGetWinningStreak() === null) localStorage.setItem("oneWinningStreak", JSON.stringify(0));



// ################################################
// ################ LIGHT/DARK MODE ###############
// ################################################

const getDarkMode = () => {
  const darkMode = localStorage.getItem("darkMode");
  return darkMode
}

const setDarkMode = (mode) => {
  if(mode === "dark") {
    localStorage.setItem("darkMode", "dark");
  } else {
    localStorage.setItem("darkMode", "light");
  }
}

if(getDarkMode() === null) localStorage.setItem("darkMode", "light");
