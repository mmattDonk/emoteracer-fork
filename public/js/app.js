let socket;
initSocket = function() {
  return socket = io();
}
// #################################################################################
// ############################### DOM DECLARATION #################################
// #################################################################################

// ICONS (So we can load images when page switches)
const asideIcon1 = document.querySelector(".aside-icon-1")
const asideIcon2 = document.querySelector(".aside-icon-2")
const asideIcon3 = document.querySelector(".aside-icon-3")
const asideIcon4 = document.querySelector(".aside-icon-4")

// Header and Aside nav.
const navLogo = document.querySelector("#nav-logo");
const navAside = document.querySelector(".nav-aside");
const infoAside = document.querySelector(".info-aside-container");
const playerAside = document.querySelectorAll(".player-aside");
const battleRoyaleAside = document.querySelector(".battle-royale-aside");
const battleRoyaleBtn = document.querySelector(".battle-royale-btn");
const soloBtn = document.querySelector(".solo-btn");
const oneVsOneBtn = document.querySelector(".one-vs-one-btn");
const myProfileBtn = document.querySelector(".my-profile-btn");
const dropdownBtn = document.querySelector(".dropdown-btn");
let dropdownBool = true // bool to toggle dropdown on and off

// HTML APPEND ELEMENT´S
const mainContainer = document.querySelector(".main-container");
const main = document.querySelector(".main");
const loadingBox = document.querySelector(".loading-box")
// const mainFull = document.querySelector(".main-full");
const game = document.querySelector(".game");
let mainLower = null;

// Right Aside
let yepCoins = document.querySelectorAll(".yep-coins")
let profileImgAside = document.querySelector(".profile-img-aside")
const yepCoinLogoAside = document.querySelector(".yep-coin-logo-aside")
const totalWinsNum = document.querySelector(".total-wins-num");
const totalGamesNum = document.querySelector(".total-games-num");

const brWinsNum = document.querySelector(".br-wins-num");
const brStreakNum = document.querySelector(".br-streak-num");
const brGamesNum = document.querySelector(".br-games-num");

const oneWinsNum = document.querySelector(".one-wins-num");
const oneStreakNum = document.querySelector(".one-streak-num");
const oneGamesNum = document.querySelector(".one-games-num");


// Extras
const adminMessage = document.querySelector(".admin-message")

// #################################################################################
// ############################### PAGE INITIALIZATION #############################
// #################################################################################


// INIT PAGE
let transition = false // <-- we dont want to have a transition when page loads
window.onload = () => transition = true;

// Choose what page to load depending on the URL
if(window.location.pathname === "/") {
  mainPage();
} else if(window.location.pathname === "/battle-royale") {
  battleRoyalePage();
} else if(location.pathname === "/battle-royale/" && location.search.length > 0) { // I.E. if a battle royale link
  initSocket();
  initBattleRoyale("joinByLink"); // Initialize socket connection & Battle Royale Game
  document.title = "EmoteRacer 2: Battle Royale"
} else if(location.pathname === "/1v1/" && location.search.length > 0) {
  initSocket();
  racerGameBattle("joinByLink") // Initialize socket connection & 1v1 Game
  document.title = "EmoteRacer 2: 1 VS 1"
} else if(window.location.pathname === "/solo") {
  soloPage();
} else if(window.location.pathname === "/1v1") {
  onePage();
} else if(window.location.pathname === "/profile") {
  profilePage();
}

// #################################################################################
// ############################## MAIN PAGE NAVIGATION #############################
// #################################################################################


navLogo.addEventListener("click", function() {
  let page;
  if(typeof getCurrentPage === "function") page = getCurrentPage();
  pageChange(page);
  mainPage();
});

battleRoyaleBtn.addEventListener("click", function() {
  battleRoyalePage();
});

soloBtn.addEventListener("click", function() {
  soloPage();
});

oneVsOneBtn.addEventListener("click", function() {
  onePage();
});

myProfileBtn.addEventListener("click", function() {
  profilePage();
});

// #################################################################################
// ############################### MAIN PAGE #######################################
// #################################################################################


function mainPage() {

  // CONFIG
  mainPageReset()
  battleRoyaleAside.style.display = "none";
  document.title = "EmoteRacer 2: Free Multiplayer Twitch Emote Guessing Game"
  history.pushState({urlPath:'/'},"",'/')
  main.style.visibility = "hidden";
  navAside.style.visibility = "hidden";
  loadingBox.style.display = "flex";

  // STATS
  setAsideStatsAndCoins()


  loadMainImgs();

  this.mainPageHTML = function() {
    return (
      main.innerHTML =
      `
      <div class="landing-container">
        <div class="title-container">
          <img class="landing-logo" src="imgs/EmoteRacer_Logo.png">
        </div>
        <div class="games-container main-lower">
          <div class="game-box">
            <img class="game-box-background-img" src="https://cdn.7tv.app/emote/60c29a6ff922dd0b5674b11d/3x">
            <div class="play-box">
              <h1>Battle Royale</h1>
              <button class="play-btn br-play-btn">Play</button>
            </div>
            <div>
              <p>Last man standing with up to 12 players. Match up against random players or challenge your friends.</p>
            </div>
            <div class="game-icon"><img class="main-br-img main-game-icon" src="imgs/crown-fill.svg"></div>
          </div>
          <div class="game-box">
            <img class="game-box-background-img" src="https://static-cdn.jtvnw.net/emoticons/v2/306852246/default/dark/3.0">
            <div class="play-box">
              <h1>1 VS 1</h1>
              <button class="play-btn one-play-btn">Play</button>
            </div>
            <div>
              <p>Match up against another player or challenge your friend.</p>
            </div>
            <div class="game-icon"><img class="main-one-img main-game-icon" src="imgs/1v1-swords-fill.svg"></div>
          </div>
          <div class="game-box">
            <img class="game-box-background-img" src="https://cdn.7tv.app/emote/60d3ffd0448b0762ffbd89e8/3x">
            <div class="play-box">
              <h1>Practice Solo</h1>            
              <button class="play-btn solo-play-btn">Play</button>
            </div>            
            <div>
              <p>Practice by yourself, imporve your emote typing skills.</p>
            </div>
            <div class="game-icon"><img class="main-solo-img main-game-icon" src="imgs/solo-fill.svg"></div>
          </div>
        </div>
      </div>
      
      `
    )
  }
  
  let playBtn = null;
  let saveProfileBtn = null;
  let profileNameInput = null;
  let roomIsFullLabel = null;
  let brPlayBtn = null;
  let onePlayBtn = null;
  let soloPlayBtn = null;

  let mainBrImg = null;
  let mainOneImg = null;
  let mainSoloImg = null;
  let mainGameIcon = null;
  this.mainPageDOM = function() {
    saveProfileBtn = document.querySelector(".save-profile-btn");
    profileNameInput = document.querySelector("#profile-name");
    roomIsFullLabel = document.querySelector(".room-is-full-label");
    playBtn = document.querySelectorAll(".play-btn")
    mainBrImg = document.querySelector(".main-br-img")
    mainOneImg = document.querySelector(".main-one-img")
    mainSoloImg = document.querySelector(".main-solo-img")
    mainGameIcon = document.querySelectorAll(".main-game-icon")
    brPlayBtn = document.querySelector(".br-play-btn")
    onePlayBtn = document.querySelector(".one-play-btn")
    soloPlayBtn = document.querySelector(".solo-play-btn")
    mainLower = document.querySelector(".main-lower");
  }
  
  this.mainPageEVENT = function() {
    // saveProfileBtn.addEventListener("click", profileSettings);
    for(let i = 0; i < playBtn.length; i++) {
      playBtn[i].addEventListener("mouseover", function() {
        mainGameIcon[i].classList.add("grayscale-zero")
      })
      playBtn[i].addEventListener("mouseleave", function() {
        mainGameIcon[i].classList.remove("grayscale-zero")
      })
    }

    brPlayBtn.addEventListener("click", function() {
      battleRoyalePage();
    });
    
    onePlayBtn.addEventListener("click", function() {
      onePage();
      
    });
    
    soloPlayBtn.addEventListener("click", function() {
      soloPage();
    });
    

  }

  pageChangeDisplay("main")

  mainPageHTML(); // Loads html
  mainPageDOM(); // Inits dom wiring
  if(transition === true) pageTransitionTop("main"); // Page transition
  mainPageEVENT(); // Inits event listeners

  // When all IMAGES are loaded show HTML
  $('.main').waitForImages(function() {
    loadingBox.style.display = "none";
    main.style.visibility = "visible";
  });
  $('.nav-aside').waitForImages(function() {
    navAside.style.visibility = "visible";
  });
}

function loadMainImgs() {
  asideIcon1.src = "imgs/crown.svg"
  asideIcon2.src = "imgs/1v1-swords.svg"
  asideIcon3.src = "imgs/solo.svg"
  asideIcon4.src = "imgs/user.svg"
  yepCoinLogoAside.src = "imgs/YEP_COIN.svg"
}

{/* <div class="profile-name-container">
<label for="profile-name">USERNAME</label>
<input id="profile-name" type="text">
<button class="save-profile-btn">SAVE</button>
</div> */}

// #################################################################################
// ############################### BATTLE ROYALE PAGE ##############################
// #################################################################################


function battleRoyalePage() {

  // CONFIG
  document.title = "EmoteRacer 2: Battle Royale"
  history.pushState({urlPath:'/battle-royale'},"",'/battle-royale')
  main.style.visibility = "hidden";
  loadingBox.style.display = "flex";

  this.battleRoyaleHTML = function() {
    return (
      main.innerHTML =
      `
      <div class="landing-container">
        <div class="title-container">
          <h1><img class="title-icon br-crown-icon" src="imgs/crown-fill.svg">BATTLE ROYALE<img class="title-icon br-crown-icon" src="imgs/crown-fill.svg"></h1>
        </div>
        <div class="buttons-play-container main-lower">
          <button class="button-card-box quick-play-btn">
            <div class="button-card-label">Quick Play</div>
            <i class="fas fa-random play-icon"></i>
          </button>
          <button class="button-card-box private-lobby-btn">
            <div class="button-card-label">Private Lobby</div>
            <i class="fas fa-users play-icon"></i>
          </button>
        </div>
      </div>

      `
    )
  }

  let quickPlayBtn = null;
  let privateLobbyBtn = null;
  this.battleRoyaleDOM = function() {
    quickPlayBtn = document.querySelector(".quick-play-btn")
    privateLobbyBtn = document.querySelector(".private-lobby-btn")
    mainLower = document.querySelector(".main-lower");
  }

  let clicked = false; // to prevent user from clicking buttons multiple times
  this.battleRoyaleEVENT = function() {
    quickPlayBtn.addEventListener("click", () => {
      if(clicked === true) return;
      clicked = true;
      // DOM
      loadingBox.style.display = "flex";
      main.style.visibility = "hidden";
      initSocket();
      initBattleRoyale("public")
    },{once : true});
    privateLobbyBtn.addEventListener("click", () => {
      if(clicked === true) return;
      clicked = true;
      // DOM
      loadingBox.style.display = "flex";
      main.style.visibility = "hidden";
      initSocket();
      initBattleRoyale("private")
    },{once : true});
  }

  pageChangeDisplay("main")

  battleRoyaleHTML(); // Loads html
  battleRoyaleDOM(); // Inits dom wiring
  if(transition === true) pageTransitionTop("main"); // Page transition
  battleRoyaleEVENT(); // Inits event listeners

  // When all IMAGES are loaded show HTML
  $('.main').waitForImages(function() {
    loadingBox.style.display = "none";
    main.style.visibility = "visible";
  });
}


// #################################################################################
// ############################### BATTLE ROYALE PAGE ##############################
// #################################################################################


function onePage() {
  // CONFIG
  document.title = "EmoteRacer 2: 1 VS 1"
  history.pushState({urlPath:'/1v1'},"",'/1v1')
  main.style.visibility = "hidden";
  loadingBox.style.display = "flex";

  this.oneHTML = function() {
    return (
      main.innerHTML =
      `
      <div class="landing-container">
        <div class="title-container">
          <h1><img class="title-icon" src="imgs/1v1-swords-fill.svg">1 VS 1<img class="title-icon" src="imgs/1v1-swords-fill.svg"></h1>
        </div>
        <div class="buttons-play-container main-lower">
          <button class="button-card-box play-1v1-btn">
            <div class="button-card-label">Quick Play</div>
            <i class="fas fa-random play-icon"></i>
          </button>
          <button class="button-card-box play-1v1-private-btn">
            <div class="button-card-label button-card-label-friend">Challenge a Friend</div>
            <div class="button-card-label-min button-card-label" style="display: none;">Challenge Friend</div>
            <i class="fas fa-user-plus play-icon"></i>
          </button>
        </div>
      </div>
      `
    )
  }

  let play1v1Btn = null;
  let play1v1PrivateBtn = null;
  this.oneDOM = function() {
    play1v1Btn = document.querySelector(".play-1v1-btn");
    play1v1PrivateBtn = document.querySelector(".play-1v1-private-btn");
    mainLower = document.querySelector(".main-lower");
  }

  let clicked = false; // to prevent user from clicking buttons multiple times
  this.oneEVENT = function() {
    play1v1Btn.addEventListener("click", function() {
      if(clicked === true) return;
      clicked = true;
      // DOM
      loadingBox.style.display = "flex";
      main.style.visibility = "hidden";
      initSocket();
      racerGameBattle("public");
    },{once : true});
    play1v1PrivateBtn.addEventListener("click", function() {
      if(clicked === true) return;
      clicked = true;
      // DOM
      loadingBox.style.display = "flex";
      main.style.visibility = "hidden";
      initSocket();
      racerGameBattle("private");
    },{once : true});
  }

  pageChangeDisplay("main")

  oneHTML(); // Loads html
  oneDOM(); // Inits dom wiring
  if(transition === true) pageTransitionTop("main"); // Page transition
  oneEVENT(); // Inits event listeners


  // When all IMAGES are loaded show HTML
  $('.main').waitForImages(function() {
    loadingBox.style.display = "none";
    main.style.visibility = "visible";
  });
}

// #################################################################################
// ############################ GUESS THE EMOTE PAGE ###############################
// #################################################################################


function soloPage() {

  // CONFIG
  document.title = "EmoteRacer 2: Practice Solo"
  history.pushState({urlPath:'/solo'},"",'/solo')
  main.style.visibility = "hidden";
  loadingBox.style.display = "flex";

  this.soloHTML = function() {
    return (
      main.innerHTML =
      `
      <div class="landing-container">
        <div class="title-container">
          <h1><img class="title-icon" src="imgs/solo-fill.svg">PRACTICE SOLO<img class="title-icon" src="imgs/solo-fill.svg"></h1>
        </div>
        <div class="buttons-play-container main-lower">
          <button class="button-card-box play-racer-solo-btn">
            <div class="button-card-label">Racer Mode</div>
            <i class="fas fa-tachometer-alt play-icon"></i>
          </button>
          <button class="button-card-box play-original-solo-btn">
            <div class="button-card-label">Classic Mode</div>
            <i class="fas fa-angle-double-right play-icon"></i>
          </button>
        </div>
      </div>
      `
    )
  }

  let playOriginalSoloBtn = null;
  let playRacerSoloBtn = null;
  this.soloDOM = function() {
    playOriginalSoloBtn = document.querySelector(".play-original-solo-btn");
    playRacerSoloBtn = document.querySelector(".play-racer-solo-btn");
    mainLower = document.querySelector(".main-lower");
  }

  let clicked = false; // to prevent user from clicking buttons multiple times
  this.soloEVENT = function() {
    playOriginalSoloBtn.addEventListener("click", function() {
      if(clicked === true) return;
      clicked = true;
      
      navAside.style.display = "none";
      originalGame();
    },{once : true});
    playRacerSoloBtn.addEventListener("click", function() {
      if(clicked === true) return;
      clicked = true;

      navAside.style.display = "none";
      racerGame();
    },{once : true});
  }

  pageChangeDisplay("main")

  soloHTML(); // Loads html
  soloDOM(); // Inits dom wiring
  if(transition === true) pageTransitionTop("main"); // Page transition
  soloEVENT(); // Inits event listeners


  // When all IMAGES are loaded show HTML
  $('.main').waitForImages(function() {
    loadingBox.style.display = "none";
    main.style.visibility = "visible";
  });
}

// #################################################################################
// ################################ PROFILE PAGE ###################################
// #################################################################################

function profilePage() {
  // CONFIG
  document.title = "EmoteRacer 2: My Profile"
  history.pushState({urlPath:'/profile'},"",'/profile')
  main.style.visibility = "hidden";
  loadingBox.style.display = "flex";

  function configuration() {
    setYepCoinsDom(yepCoins);
    profileImg.src = getProfileImg();
    profileName.value = getUsername();
    profileName.style.color = getUsernameColorV2()
    nameColorOwned[0].innerText = getUsername();

    // Color name to username
    setUsernameColorBox()

    // Set Owned Avatars
    for(let i = 0; i < emoteBoxUrl.length; i++) {
      for(let a = 1; a < getOwnedAvatars().length; a++) { // Start loop at 1, because First emote is already owned

        if(getOwnedAvatars()[a] === emoteBoxUrl[i].src) {
          // Set dom wiring
          setDomWiring(i)
          buyEmoteBtn[i].className = "select-emote-btn"
        }
      }
    }
    selectEmoteBtn = document.querySelectorAll(".select-emote-btn") // Set select-emote-btn

    // Set Owned Colors
    for(let i = 0; i < nameColor.length; i++) {
      for(let a = 1; a < getOwnedColors().length; a++) { // Start loop at 1, because First emote is already owned

        if(getOwnedColors()[a] === nameColor[i].style.color) {
          // Set dom wiring
          setDomWiringColor(i)
          buyColorBtn[i].className = "select-color-btn"
        }
      }
    }
    selectColorBtn = document.querySelectorAll(".select-color-btn") // Set select-emote-btn

    // Reset Button Styling
    for(let btn of selectEmoteBtn) {
      btn.innerHTML = "OWNED"
    }

    // Reset Color Button Styling
    for(let btn of selectColorBtn) {
      btn.innerHTML = "OWNED"
    }



    // Highlight current profileImg
    this.highlightCurrentEmote = function() {
      for(let i = 0; i < emoteBoxOwned.length; i++) {
        if(getProfileImg() === emoteBoxOwnedUrl[i].src) {
          emoteBoxOwned[i].classList.add("highlight-box")
          selectEmoteBtn[i].innerText = "SELECTED"
        } 
      }
    }
    highlightCurrentEmote()


    // Highlight current color
    this.highlightCurrentColor = function() {
      for(let i = 0; i < colorBoxOwned.length; i++) {
        if(getUsernameColor() === nameColorOwned[i].style.color) {
          colorBoxOwned[i].classList.add("highlight-box-color")
          selectColorBtn[i].innerText = "SELECTED"
        } 
      }
    }
    highlightCurrentColor();

  }

  function setUsernameColorBox() {
    for(let name of nameColorText) {
      name.innerText = profileName.value
    }
  }


  // Change dom when user buys an emote
  function setBuyEmoteDom(i) {
    confetti();
    setDomWiring(i)

    // Clear highlight
    clearEmoteBoxOwnedHighlight()

    highlightCurrentEmote(); // Highlight new emote

    // Set Profile Img DOM
    profileImg.src = getProfileImg();
    profileImgAside.src = getProfileImg();

    setYepCoinsDom(); // Set coins Dom

    // Event listeners
    setTimeout(() => {
      selectEmoteRemove()
      selectEmoteAdd()
    }, 50)
  }

  // Change dom when user buys an color
  function setBuyColorDom(i) {
    confetti();
    setDomWiringColor(i)

    // Clear highlight
    clearColorBoxOwnedHighlight()

    highlightCurrentColor(); // Highlight new emote

    // Set Profile Img DOM
    profileName.style.color = getUsernameColorV2();

    setYepCoinsDom();

    // Event listeners
    setTimeout(() => {
      selectColorRemove()
      selectColorAdd()
    }, 50)
  }  


  function setDomWiring(i) {

    emoteBox[i+1].classList.add("emote-box-owned") // +1 because first emote is always owned
    emoteBoxOwned = document.querySelectorAll(".emote-box-owned")

    emoteBoxUrl[i].classList.add("emote-box-owned-url")
    emoteBoxOwnedUrl = document.querySelectorAll(".emote-box-owned-url")

    emoteBoxUrl = document.querySelectorAll(".emote-box-url")
  }

  function setDomWiringColor(i) {
    colorBox[i+1].classList.add("color-box-owned") // +1 because first emote is always owned
    colorBoxOwned = document.querySelectorAll(".color-box-owned")

    nameColor[i].classList.add("name-color-owned")
    nameColorOwned = document.querySelectorAll(".name-color-owned")

    nameColor = document.querySelectorAll(".name-color")
  }


  this.profileHTML = function() {
    return (
      main.innerHTML =
      `
      <div class="landing-container">
        <div class="profile-label-container">
          <h1>My Profile</h1>
        </div>
        <div class="profile-card-box">
          <div class="profile-container">
            <div class="profile-img-box">
              <img class="profile-img" src="">
            </div>
            <div class="profile-name-box">
              <input type="text" class="profile-name" value="" maxlength="16" readonly>
              <button class="profile-edit-btn">EDIT</button>
            </div>
          </div>
          <div class="customize-label-container">
            <div>Name Colors</div>
            <div>Profile Images</div>
          </div>
          <div class="customize-container">
            <div class="custom-text-color-container">
              <div class="customize-column">
                <div class="color-box color-box-owned animate__animated animate__faster">
                  <div class="cosmetic-box-label">Black/White</div>
                  <div class="name-color-owned name-color-text" style="color: white;"></div>
                  <button class="select-color-btn" data-name="white">100</button>
                </div>
                <div class="color-box animate__animated animate__faster">
                  <div class="cosmetic-box-label">Limegreen</div>
                  <div class="name-color name-color-text" style="color: limegreen;"></div>
                  <button class="buy-color-btn" data-value="100" data-name="limegreen">100<img src="imgs/YEP_COIN.svg"></button>
                </div>
                <div class="color-box animate__animated animate__faster">
                  <div class="cosmetic-box-label">Red</div>
                  <div class="name-color name-color-text" style="color: red;"></div>
                  <button class="buy-color-btn" data-value="100" data-name="red">100<img src="imgs/YEP_COIN.svg"></button>
                </div>
                <div class="color-box animate__animated animate__faster">
                  <div class="cosmetic-box-label">Gold</div>
                  <div class="name-color name-color-text" style="color: gold;"></div>
                  <button class="buy-color-btn" data-value="200" data-name="gold">200<img src="imgs/YEP_COIN.svg"></button>
                </div>                 
              </div>
              <div class="customize-column">
                <div class="color-box animate__animated animate__faster">
                  <div class="cosmetic-box-label">Mediumpurple</div>
                  <div class="name-color name-color-text" style="color: mediumpurple;"></div>
                  <button class="buy-color-btn" data-value="50" data-name="mediumpurple">50<img src="imgs/YEP_COIN.svg"></button>
                </div>
                <div class="color-box animate__animated animate__faster">
                  <div class="cosmetic-box-label">Dodgerblue</div>
                  <div class="name-color name-color-text" style="color: dodgerblue;"></div>
                  <button class="buy-color-btn" data-value="100" data-name="dodgerblue">100<img src="imgs/YEP_COIN.svg"></button>
                </div>
                <div class="color-box animate__animated animate__faster">
                  <div class="cosmetic-box-label">Fuchsia</div>
                  <div class="name-color name-color-text" style="color: fuchsia;"></div>
                  <button class="buy-color-btn" data-value="200" data-name="fuchsia">200<img src="imgs/YEP_COIN.svg"></button>
                </div>                                
                <div class="color-box animate__animated animate__faster">
                  <div class="cosmetic-box-label">Cyan</div>
                  <div class="name-color name-color-text" style="color: cyan;"></div>
                  <button class="buy-color-btn" data-value="300" data-name="cyan">300<img src="imgs/YEP_COIN.svg"></button>
                </div>
              </div>
            </div>
            <div class="custom-emote-img-container">
              <div class="customize-column">
                <div class="emote-box emote-box-owned animate__animated animate__faster">
                  <div class="cosmetic-box-label">forsenE</div>
                  <div class="emote-box-img">
                    <img class="emote-box-owned-url" src="https://static-cdn.jtvnw.net/emoticons/v2/521050/default/dark/3.0">
                  </div>
                  <button class="select-emote-btn">SELECT</button>
                </div>
                <div class="emote-box animate__animated animate__faster">
                <div class="cosmetic-box-label">WHAAT</div>
                <div class="emote-box-img">
                <img class="emote-box-url" src="https://cdn.7tv.app/emote/60c29a6ff922dd0b5674b11d/3x">
                </div>
                <button class="buy-emote-btn" data-value="50" data-name="WHAAT">50<img src="imgs/YEP_COIN.svg"></button>
                </div>
                <div class="emote-box animate__animated animate__faster">
                <div class="cosmetic-box-label">5Head</div>
                <div class="emote-box-img">
                <img class="emote-box-url" src="https://cdn.betterttv.net/emote/5d6096974932b21d9c332904/3x">
                </div>
                <button class="buy-emote-btn" data-value="100" data-name="5Head">100<img src="imgs/YEP_COIN.svg"></button>
                </div>
                <div class="emote-box animate__animated animate__faster">
                <div class="cosmetic-box-label">EZ</div>
                <div class="emote-box-img">
                <img class="emote-box-url" src="https://cdn.betterttv.net/emote/5590b223b344e2c42a9e28e3/3x">
                </div>
                <button class="buy-emote-btn" data-value="300" data-name="EZ">300<img src="imgs/YEP_COIN.svg"></button>
                </div>
                <div class="emote-box animate__animated animate__faster">
                <div class="cosmetic-box-label">MEGALUL</div>
                <div class="emote-box-img">
                <img class="emote-box-url" src="https://cdn.frankerfacez.com/emoticon/419215/4">
                </div>
                <button class="buy-emote-btn" data-value="500" data-name="MEGALUL">500<img src="imgs/YEP_COIN.svg"></button>
                </div>                   
                </div>
                <div class="customize-column">
                <div class="emote-box animate__animated animate__faster">
                <div class="cosmetic-box-label">POGGERS</div>
                <div class="emote-box-img">
                <img class="emote-box-url" src="https://cdn.betterttv.net/emote/58ae8407ff7b7276f8e594f2/3x">
                </div>
                <button class="buy-emote-btn" data-value="50" data-name="POGGERS">50<img src="imgs/YEP_COIN.svg"></button>
                </div>
                <div class="emote-box animate__animated animate__faster">
                <div class="cosmetic-box-label">Pepega</div>
                <div class="emote-box-img">
                <img class="emote-box-url" src="https://cdn.betterttv.net/emote/5aca62163e290877a25481ad/3x">
                </div>
                <button class="buy-emote-btn" data-value="200" data-name="Pepega">200<img src="imgs/YEP_COIN.svg"></button>
                </div>                
                <div class="emote-box animate__animated animate__faster">
                <div class="cosmetic-box-label">OMEGALUL</div>
                <div class="emote-box-img">
                <img class="emote-box-url" src="https://cdn.betterttv.net/emote/583089f4737a8e61abb0186b/3x">
                </div>
                <button class="buy-emote-btn" data-value="400" data-name="OMEGALUL">400<img src="imgs/YEP_COIN.svg"></button>
                </div>             
                <div class="emote-box animate__animated animate__faster">
                  <div class="cosmetic-box-label">Auro</div>
                  <div class="emote-box-img">
                    <img class="emote-box-url" src="https://cdn.7tv.app/emote/60d3ffd0448b0762ffbd89e8/3x">
                  </div>
                  <button class="buy-emote-btn" data-value="1000" data-name="Auro">1000<img src="imgs/YEP_COIN.svg"></button>
                </div>
                <div class="emote-box animate__animated animate__faster">
                  <div class="cosmetic-box-label">mmattDonk</div>
                  <div class="emote-box-img">
                    <img class="emote-box-url" src="https://static-cdn.jtvnw.net/emoticons/v2/306852246/default/dark/3.0">
                  </div>
                  <button class="buy-emote-btn" data-value="1000" data-name="mmattDonk">1000<img src="imgs/YEP_COIN.svg"></button>
                </div>
                <div class="emote-box animate__animated animate__faster">
                  <div class="cosmetic-box-label">ActuallyWicked</div>
                  <div class="emote-box-img">
                    <img class="emote-box-url" src="https://cdn.7tv.app/emote/60de6a589236aff3225a7682/3x">
                  </div>
                  <button class="buy-emote-btn" data-value="1000" data-name="ActuallyWicked">1000<img src="imgs/YEP_COIN.svg"></button>
                </div>
                <div class="emote-box animate__animated animate__faster">
                  <div class="cosmetic-box-label">elpwsQC</div>
                  <div class="emote-box-img">
                    <img class="emote-box-url" src="https://static-cdn.jtvnw.net/emoticons/v2/305641614/default/dark/3.0">
                  </div>
                  <button class="buy-emote-btn" data-value="1000" data-name="elpwsQC">1000<img src="imgs/YEP_COIN.svg"></button>
                </div>
                <div class="emote-box animate__animated animate__faster">
                  <div class="cosmetic-box-label">pepeD</div>
                  <div class="emote-box-img">
                    <img class="emote-box-url" src="https://cdn.betterttv.net/emote/5b1740221c5a6065a7bad4b5/3x">
                  </div>
                  <button class="buy-emote-btn" data-value="2000" data-name="pepeD">2000<img src="imgs/YEP_COIN.svg"></button>
                </div>
                <div class="emote-box animate__animated animate__faster">
                <div class="cosmetic-box-label">forsenE (if you can't equip the one at the top)</div>
                <div class="emote-box-img">
                  <img class="emote-box-url" src="https://static-cdn.jtvnw.net/emoticons/v2/521050/default/dark/3.0">
                </div>
                <button class="buy-emote-btn" data-value="0" data-name="forsenE">FREE</button>
              </div>
              </div>                                        
            </div>
          </div>
        </div>
      </div>
      `
    )
  }

  let profileImg = null;
  let profileName = null;
  // 
  let profileEditBtn = null;
  let profileNameBox = null;
  let emoteBox = null;
  let emoteBoxOwned = null;
  let emoteBoxOwnedUrl = null;
  let selectEmoteBtn = null;
  let emoteSelected = null;
  let buyEmoteBtn = null;
  let emoteBoxUrl = null;
  // 
  let colorBox = null;
  let nameColor = null;
  let buyColorBtn = null;
  let selectColorBtn = null;
  let colorBoxOwned = null;
  let nameColorText = null;


  this.profileDOM = function() {
    profileImg = document.querySelector(".profile-img")
    profileName = document.querySelector(".profile-name")
    profileEditBtn = document.querySelector(".profile-edit-btn")
    profileNameBox = document.querySelector(".profile-name-box")
    emoteBox = document.querySelectorAll(".emote-box")
    emoteBoxOwned = document.querySelectorAll(".emote-box-owned")
    emoteBoxOwnedUrl = document.querySelectorAll(".emote-box-owned-url")
    selectEmoteBtn = document.querySelectorAll(".select-emote-btn")
    emoteSelected = document.querySelectorAll(".emote-selected")
    buyEmoteBtn = document.querySelectorAll(".buy-emote-btn")
    emoteBoxUrl = document.querySelectorAll(".emote-box-url")
    // 
    nameColor = document.querySelectorAll(".name-color")
    nameColorOwned = document.querySelectorAll(".name-color-owned")
    buyColorBtn = document.querySelectorAll(".buy-color-btn")
    colorBox = document.querySelectorAll(".color-box")
    selectColorBtn = document.querySelectorAll(".select-color-btn")
    colorBoxOwned = document.querySelectorAll(".color-box-owned")
    nameColorText = document.querySelectorAll(".name-color-text")
    // 
    yepCoins = document.querySelectorAll(".yep-coins")

  }

  this.profileEVENT = function() {
    // HANDLE PROFILE USERNAME
    let bool = true;
    profileEditBtn.addEventListener("click", function() {
      if(bool === true) {
        bool = !bool;
        profileName.focus();
        profileName.readOnly = false;

        // Styling
        profileEditBtn.innerText = "SAVE"
        profileName.style.cursor = "auto";
        profileNameBox.style.border = "2px solid var(--text)";
        profileNameBox.style.borderRadius = "6px";

      } else {
        if(profileName.value === "") return
        bool = !bool;
        setUsername(profileName.value) // Set new username in localStorage
        profileName.readOnly = true;

         // Styling
        profileEditBtn.innerText = "EDIT"
        profileName.style.cursor = "";
        profileNameBox.style.border = "";
        profileNameBox.style.borderRadius = "";

        // Color name to username
        setUsernameColorBox()

      }
    });
  }

   // AVATAR

  function buyEmoteBtnListener(e) {
    const btn = e.target

    for(let i = 0; i < emoteAvatars.length; i++) {
      // Check if DOM matches the code
      if(btn.dataset.name === emoteAvatars[i].name && btn.dataset.value === emoteAvatars[i].price.toString()){
        
        // Buy Avatar if he has enough coins
        if(getCoins() >= emoteAvatars[i].price) {
          buyEmoteBtnRemove(); // Remove buyEmoteBtn Listener, so we cant buy the same emote twice

          buyAvatar(emoteAvatars[i].name, emoteAvatars[i].code) // Buy the emote

          // SET DOM WIRING
          btn.className = "select-emote-btn" // Set the bought emote to select-emote-btn, because he now owns the emote
          selectEmoteBtn = document.querySelectorAll(".select-emote-btn") // Set select-emote-btn
          setBuyEmoteDom(i);

          buyEmoteBtnAdd(); // Add buyEmoteBtnListener, so we can buy emotes.
        } else {
          if(btn.className === "select-emote-btn") return

          emoteBox[i+1].classList.add("input-wrong");
          emoteBox[i+1].classList.add("animate__headShake");
          setTimeout(() => {
            emoteBox[i+1].classList.remove("input-wrong");
            emoteBox[i+1].classList.remove("animate__headShake");
          }, 300)
        }

      }
    }
  }

  function selectedEmoteListener(e) {
    const box = e.target;
    const button = box.getElementsByClassName("select-emote-btn")[0]
    const imgSrc = box.getElementsByClassName("emote-box-owned-url")[0]

    clearEmoteBoxOwnedHighlight()

    box.classList.add("highlight-box");
    button.innerText = "SELECTED";

    // Set Profile Img
    setProfileImg(imgSrc.src)

    // Set Profile Img DOM
    profileImg.src = getProfileImg();
    profileImgAside.src = getProfileImg();
  }
  function clearEmoteBoxOwnedHighlight() {
    for(let x = 0; x < emoteBoxOwned.length; x++) {
      emoteBoxOwned[x].classList.remove("highlight-box") 
      selectEmoteBtn[x].innerText = "OWNED"
    }
  }



  // COLOR

  function buyColorBtnListener(e) {
    const btn = e.target
    for(let i = 0; i < nameColors.length; i++) {
      // Check if DOM matches the code
      if(btn.dataset.name === nameColors[i].name && btn.dataset.value === nameColors[i].price.toString()){
        
        // Buy Avatar if he has enough coins
        if(getCoins() >= nameColors[i].price) {
          buyColorBtnRemove(); // Remove buyColorBtn Listener, so we cant buy the same emote twice

          buyColor(nameColors[i].name, nameColors[i].code)

          btn.className = "select-color-btn"
          selectColorBtn = document.querySelectorAll(".select-color-btn")
          setBuyColorDom(i);

          buyColorBtnAdd(); // Add buyColorBtnListener, so we can buy emotes.
        } else {
          if(btn.className === "select-color-btn") return

          colorBox[i+1].classList.add("input-wrong");
          colorBox[i+1].classList.add("animate__headShake");
          setTimeout(() => {
            colorBox[i+1].classList.remove("input-wrong");
            colorBox[i+1].classList.remove("animate__headShake");
          }, 300)
        }

      }
    }
  } 

  function selectedColorListener(e) {
    const box = e.target;
    const button = box.getElementsByClassName("select-color-btn")[0]
    const colorStyle = box.getElementsByClassName("name-color-owned")[0]

    clearColorBoxOwnedHighlight()

    // Set New highlight
    box.classList.add("highlight-box-color")
    button.innerText = "SELECTED"

    // Set Profile Img
    setUsernameColor(button.dataset.name);

    // Set Profile Img DOM
    profileName.style.color = getUsernameColorV2();
  }
  function clearColorBoxOwnedHighlight() {
    for(let x = 0; x < colorBoxOwned.length; x++) {
      colorBoxOwned[x].classList.remove("highlight-box-color") 
      selectColorBtn[x].innerText = "OWNED"
    }
  }

  // INIT FUNCITONS

  pageChangeDisplay("main")

  profileHTML(); // Loads html
  profileDOM(); // Inits dom wiring
  // if(transition === true) pageTransitionTop("main"); // Page transition
  profileEVENT(); // Inits event listeners´

  configuration();



  // ##########################################EVENT LISTENERS##################################################

  // selectedEmoteListener
  selectEmoteAdd() 
  function selectEmoteAdd() {
    emoteBoxOwned = document.querySelectorAll(".emote-box-owned")
    for(let btn of emoteBoxOwned) {
      btn.addEventListener("click", selectedEmoteListener)
    }
  }
  function selectEmoteRemove() {
    emoteBoxOwned = document.querySelectorAll(".emote-box-owned")
    for(let btn of emoteBoxOwned) {
      btn.removeEventListener("click", selectedEmoteListener)
    }
  }

  // buyEmoteListener
  buyEmoteBtnAdd()
  function buyEmoteBtnAdd() {
    buyEmoteBtn = document.querySelectorAll(".buy-emote-btn")
    for(let btn of buyEmoteBtn) {
      btn.addEventListener("click", buyEmoteBtnListener)
    }
  }
  function buyEmoteBtnRemove() {
    buyEmoteBtn = document.querySelectorAll(".buy-emote-btn")
    for(let btn of buyEmoteBtn) {
      btn.removeEventListener("click", buyEmoteBtnListener)
    }
  }


  // buyEmoteListener
  selectColorAdd()
  function selectColorAdd() {
    colorBoxOwned = document.querySelectorAll(".color-box-owned")
    for(let btn of colorBoxOwned) {
      btn.addEventListener("click", selectedColorListener)
    }
  }
  function selectColorRemove() {
    colorBoxOwned = document.querySelectorAll(".color-box-owned")
    for(let btn of colorBoxOwned) {
      btn.removeEventListener("click", selectedColorListener)
    }
  }

  buyColorBtnAdd()
  function buyColorBtnAdd() {
    buyColorBtn = document.querySelectorAll(".buy-color-btn")
    for(let btn of buyColorBtn) {
      btn.addEventListener("click", buyColorBtnListener)
    }
  }
  function buyColorBtnRemove() {
    buyColorBtn = document.querySelectorAll(".buy-color-btn")
    for(let btn of buyColorBtn) {
      btn.removeEventListener("click", buyColorBtnListener)
    }
  }


  // // When all IMAGES are loaded show HTML
  $('.main').waitForImages(function() {
    loadingBox.style.display = "none";
    main.style.visibility = "visible";
  });

}


// #################################################################################
// ################################# EXTRAS ########################################
// #################################################################################

setAsideStatsAndCoins()
function setAsideStatsAndCoins() {
  // COINS 
  setYepCoinsDom();

  // STATS
  totalWinsNum.innerText = getTotalWins();
  totalGamesNum.innerText = getTotalGamesPlayed();

  brWinsNum.innerText = brGetWins();
  brStreakNum.innerText = brGetWinningStreak();
  brGamesNum.innerText = brGetGamesPlayed();

  oneWinsNum.innerText = oneGetWins();
  oneStreakNum.innerText = oneGetWinningStreak();
  oneGamesNum.innerText = oneGetGamesPlayed();
}


dropdownBtn.addEventListener("click", function() {
  if(dropdownBool === true) {
    dropdownBool = !dropdownBool

    navAside.style.cssText += 'display:block !important';
    // navAside.style.display = "block"
    setTimeout(() => navAside.style.right = "0%", 50)

  } else {
    dropdownBool = !dropdownBool

    navAside.style.display = "block"
    navAside.style.right = ""

  }

})


// When Nav-Logo is clicked
function mainPageReset() {
  for(let e of playerAside) e.style.backgroundColor = "";
  navAside.style.display = "block";
  infoAside.style.display = "block";
}

function pageChange(page) {
  if(page === "battle-royale") {
    socket.disconnect();
    if(typeof stopInitTimer === "function") stopInitTimer();
    if(typeof stopProgressBar === "function") stopProgressBar();
    if(typeof stopNextRoundTimer === "function") stopNextRoundTimer();
  }
  if(page === "lobby-page") {
    socket.disconnect();
  }
  if(page === "1v1") {
    socket.disconnect();
    if(typeof stopInitTimer === "function") stopInitTimer();
    if(typeof stop1v1Timer === "function") stop1v1Timer();
    // Remove event listeners
    racerGameBattleRemoveEVENT();
  }
  if(page === "racer-game") {
    // Remove event listeners
    racerGameRemoveEVENT();
  }
}

function pageChangeDisplay(page) {
  battleRoyaleAside.style.display = "none";
  if(page === "main") {
    game.style.display = "none";
    mainContainer.style.display = "flex";
    navAside.style.display = "block";
    navAside.style.right = "";
    dropdownBool = true;
    dropdownBtn.style.display = "flex";
  }
  if(page === "game") {
    game.style.display = "block";
    mainContainer.style.display = "none";
    navAside.style.display = "none";
    dropdownBtn.style.cssText = 'display:none !important';
  }
}

function pageTransition(page) {
  if(page === "main") {
    main.classList.remove("page-transition-top")
    main.classList.add("page-transition")
    main.style.animation = "none";
    main.offsetHeight; // Trigger reflow
    main.style.animation = null;
  }
  if(page === "game") {
    game.classList.remove("page-transition-top")
    game.classList.add("page-transition")
    game.style.animation = "none";
    game.offsetHeight; // Trigger reflow
    game.style.animation = null;
  }
}

function pageTransitionTop(page) {
  if(page === "main") {
    mainLower.classList.add("page-transition")
    mainLower.classList.add("page-transition-top")
    mainLower.style.animation = "none";
    mainLower.offsetHeight; // Trigger reflow
    mainLower.style.animation = null;
  }
  if(page === "game") {
    game.classList.add("page-transition")
    game.classList.add("page-transition-top")
    game.style.animation = "none";
    game.offsetHeight; // Trigger reflow
    game.style.animation = null;
  }

}

// LOCALSTORAGE STUFF

function getUsernameColorV2() {
  let color = getUsernameColor();

  if(color === "white") color = "";
  
  return color
}

setYepCoinsDom()
function setYepCoinsDom() {
  for(yep of yepCoins) {
    yep.innerText = getCoins();
  }
}


// INIT ASIDE IMAGE
profileImgAside.src = getProfileImg();

// Handle Dark Mode
const darkModeBtn = document.querySelector(".toggle__input");
const lightDarkLabel = document.querySelector(".light-dark-label")
const root = document.documentElement
darkModeBtn.addEventListener("click", function() {
  if(darkModeBtn.checked) {
    root.className = "dark"
    lightDarkLabel.innerText = "Dark"
    setDarkMode("dark") // Save to local storage
  } else {
    root.className = "light"
    lightDarkLabel.innerText = "Light"
    setDarkMode("light") // Save to local storage
  }
})

// LOAD DARK MODE WHEN USER LOADS PAGE, IF HE HAS DARK MODE SAVED IN STORAGE.
if(getDarkMode() === "dark") {
  darkModeBtn.checked = true;
  lightDarkLabel.innerText = "Dark"
  root.className = "dark"
}

// Display HTML elements when page loads, WHEN all images for that html has loaded 
$('.info-aside-container').waitForImages(function() {
  infoAside.style.visibility = "visible";
});




