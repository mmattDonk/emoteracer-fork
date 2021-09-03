// #################################################################################
// ######################## GUESS THE EMOTE GAME (LOGIC) ###########################
// #################################################################################


function originalGame() {
  const emotes = getEmotes()

  let emotesClone = JSON.parse(JSON.stringify(emotes))
  let currentScore = 0;
  let currentEmote = {};
  let lives = 3
  let waitSubmit = true;

  const initRound = () => {
    emoteImg.src = "";
    gameUpperContent.style.visibility = "hidden";
    inputEmote.readOnly = false;
    inputEmote.focus(); // Automatically focus input text
    
    if(emotesClone.length <= 0) emotesClone = JSON.parse(JSON.stringify(emotes))
    lives = 3;

    const randomEmoteIndex = Math.floor(Math.random() * emotesClone.length)
    currentEmote = emotesClone[randomEmoteIndex]
    if(currentEmote.provider === "twitch") emoteImg.src = `https://static-cdn.jtvnw.net/emoticons/v1/${emotesClone[randomEmoteIndex].id}/3.0`
    if(currentEmote.provider === "bttv") emoteImg.src = `https://cdn.betterttv.net/emote/${emotesClone[randomEmoteIndex].id}/3x`
    if(currentEmote.provider === "ffz") emoteImg.src = `https://cdn.frankerfacez.com/emoticon/${emotesClone[randomEmoteIndex].id}/4`
    if(currentEmote.provider === "7tv") emoteImg.src = `https://cdn.7tv.app/emote/${emotesClone[randomEmoteIndex].id}/3x`

    emotesClone.splice(randomEmoteIndex, 1)
    $('.game-upper-content').waitForImages(function() {
      setTimeout(initRoundDOM, 400)
    });
  }

  const initRoundDOM = () => {
    gameUpperContent.style.visibility = "visible";
    gameUpperContent.classList.add("back-in-up-animation")
    setTimeout(() => waitSubmit = false, 400)
  }

  function guessListener(e) {
    if(e.key === "Enter") {
      if(inputEmote.value === "") return;
      while(waitSubmit === true) {
        waitSubmitDom();
        return;
      } 

      const guess = inputEmote.value.toLowerCase();
      const emoteCode = currentEmote.name.toLowerCase();
      
      if(guess === emoteCode) {
        handleRoundWin();
        inputEmote = document.querySelector(".inputEmote")
      } else {
        lives--
        wrongGuessAnimation()
        if(lives <= 0) {
          handleRoundLose();
        } 
      }
      inputEmote.value = "";
    }
  }

  function waitSubmitDom() {
    waitLabel.classList.remove("wait-label-fade")
    setTimeout(() => waitLabel.classList.add("wait-label-fade"), 50)
    setTimeout(() => waitLabel.classList.remove("wait-label-fade"), 850)
  }

  // DOM MANIPULATION WHEN USER GUESS WRONG
  const wrongGuessAnimation = () => {
    gameHeart[lives].classList.remove("fas"), gameHeart[lives].classList.add("far")
    inputEmote.classList.add("input-wrong");
    inputEmote.classList.add("animate__headShake");

    // setTimeout(() => inputEmote.classList.remove("animate__headShake"), 400)
    setTimeout(function() {
      inputEmote.classList.remove("animate__headShake")
      inputEmote.classList.remove("input-wrong");
    }, 400)
  }

  // HANDLE CORRECT GUESS
  const handleRoundWin = () => {
    waitSubmit = true;
    currentScore++;
    emoteName.innerText = currentEmote.name;
    emoteName.classList.add("show-fade")

    for(let score of finalScore) score.innerText = currentScore;

    setTimeout(function() {
      nextEmoteUpperAnimation();
      setTimeout(initRound, 400);
    }, 1000)
  }


  // HANDLE ROUND LOSE
  const handleRoundLose = () => {
    waitSubmit = true;
    inputEmote.readOnly = true;
    inputEmote.value = "";
    emoteName.innerText = currentEmote.name;
    emoteName.classList.add("show-fade")
    gameResults.classList.add("animate__fadeIn")
    gameResults.classList.remove("hide")
  }

  // Play again button execute
  const playAgainDomReset = () => {
    inputEmote.focus(); // Automatically focus input text

    gameResults.classList.remove("animate__fadeIn") // Resets game results popup menu
    for(let score of finalScore) score.innerText = currentScore; // Reset score

    nextEmoteUpperAnimation();
    setTimeout(initRound, 400)
  }

  const nextEmoteUpperAnimation = () => {
    for(let heart of gameHeart) heart.classList.add("fas"), heart.classList.remove("far")
    
    gameUpperContent.classList.add("animate__backOutRight")
    setTimeout(function() {
      gameUpperContent.classList.remove("animate__backOutRight")
      // gameUpperContent.classList.add("animate__backInLeft")

      gameUpperContent.classList.remove("back-in-up-animation");

      emoteName.classList.remove("show-fade");
      emoteName.innerText = "";
    }, 800)
  }


  // #################################################################################
  // ############### GUESS THE EMOTE GAME (DYNAMIC PAGE CREATION) ####################
  // #################################################################################


  this.originalGameHTML = function() {
    return (
      game.innerHTML =
      `
      <div class="original-game">
      <div class="game-results animate__animated animate__faster hide">
        <div class="new-personal-best hide">New Personal Best!</div>
        <h2>Your Score:</h2>
        <div class="final-score final-score-result">0</div>
        <div class="share-container">
          <a class="share-btn twitter-share-btn" href="https://twitter.com/share" target="_blank">Tweet</a>
          <a class="share-btn facebook-share-btn" href="https://www.facebook.com/sharer/sharer.php?u=#url" target="_blank">Share</a>
        </div>
        <div class="game-results-nav">
          <button class="game-nav-btn play-again-btn">PLAY AGAIN</button>
          <button class="game-nav-btn main-lobby-btn">MAIN MENU</button>
        </div>
      </div>
        <div class="game-upper">
          <div class="heart-container">
            <i class="fas fa-heart game-heart"></i>
            <i class="fas fa-heart game-heart"></i>
            <i class="fas fa-heart game-heart"></i>
          </div> 
          <h2 class="final-score-game">SCORE: <span class="final-score">0</span></h2>
           <div class="game-upper-content-container">
            <div class="game-upper-content animate__animated animate__fast">
              <div class="emote-img-container">
                <img class="emote-img" src="" alt="">
                <h1 class="emote-name"></h1>
              </div>
            </div>
          </div>
        </div>
      <div class="game-lower">
        <div class="emote-container">
          <div class="wait-label">WAIT FOR NEXT EMOTE</div> 
          <input
          class="inputEmote animate__animated animate__faster"
          type="text"
          maxlength="30"
          placeholder="TYPE HERE"
          onfocus="this.placeholder = ''"
          onblur="this.placeholder = 'TYPE HERE'"
          autofocus>
        </div>
        <h2 class="game-lower-guess-the-name">GUESS THE NAME OF ABOVE EMOTE</h2>
      </div>
    </div>
      `
    )
  }

  let emoteImg = null;
  let gameResults = null;
  let emoteName = null;
  let gameUpperContent = null;
  let finalScore = null;
  let playAgainBtn = null;
  let mainLobbyBtn = null;
  let inputEmote = null;
  let gameHeart = null;
  let waitLabel = null;
  this.originalGameDOM = function() {
  gameHeart = document.querySelectorAll(".game-heart");
  inputEmote = document.querySelector(".inputEmote");
  emoteImg = document.querySelector(".emote-img");
  emoteName = document.querySelector(".emote-name");
  gameResults = document.querySelector(".game-results");
  gameUpperContent = document.querySelector(".game-upper-content");
  finalScore = document.querySelectorAll(".final-score");
  playAgainBtn = document.querySelector(".play-again-btn");
  mainLobbyBtn = document.querySelector(".main-lobby-btn");
  waitLabel = document.querySelector(".wait-label");
  }


  this.originalGameEVENT = function() {
    inputEmote.addEventListener("keypress", guessListener)

    // Play Again
    playAgainBtn.addEventListener("click", function() {
      currentScore = 0;
      gameResults.classList.add("hide")
      playAgainDomReset();
    });

    // Back To Main Page
    mainLobbyBtn.addEventListener("click", function() {
      mainPage();
    });
  }

  pageChangeDisplay("game")

  originalGameHTML(); // Loads html
  pageTransition(); // Page transition
  originalGameDOM(); // Inits dom wiring
  originalGameEVENT(); // Inits event listeners

  inputEmote.focus(); // Automatically focus input text
  gameUpperContent.style.visibility = "hidden";
  // setTimeout(initRound, 1000) // Start game script
  initRound()
}