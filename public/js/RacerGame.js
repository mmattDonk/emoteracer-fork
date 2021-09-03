// #################################################################################
// ######################## GUESS THE EMOTE GAME (LOGIC) ###########################
// #################################################################################


function racerGame() {
  const emotes = getEmotes()

  let currentPage = "racer-game";

  // --Stats--
  // Speed
  let speed = 0;
  // Accuracy
  const alphabet = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
  let roundKeysTyped = 0;
  let totalKeysTyped = 0;
  let totalEmoteCharacters = 0;
  // Incorrect Guesses
  let incorrectGuesses = 0;
  // Game
  let emotesClone = JSON.parse(JSON.stringify(emotes))
  let currentScore = 0;
  let currentEmote = {};
  let gameStarted = false;
  // So we can PRELOAD Second Image
  let cycleBool = false;
  let currentEmoteFirst = {};
  let currentEmoteLast = {};
  let randomEmoteIndex = 0;
  let randomEmoteIndex2 = 0;

  function timer() {
    // Configutation for game
    startGameConfig()

    // Show timer
    racerGameTimerContainer.classList.remove("hide-fade");
    racerGameTimerContainer.style.display = ""
    
    // Timer logic
    let count = 60;
    let counter = setInterval(() => initBattleRoyaleTimer(), 1000); //10 will  run it every 100th of a second
    function initBattleRoyaleTimer() {
      count--;
      racerGameTimer.innerHTML=count + "s"; 
      if(count <= 0) {
        // When count hits 1, exec handleRoundEnd
        handleRoundEnd();
        clearInterval(counter)
        return;
      } 
    }
    initRound();
  }

  function startGameConfig() {
    gameStarted = true;
    gameInfoLabelContainer.style.display = "none"
    gameUpperContent.style.transition = "100ms"
    circleBox.classList.add("racer-timer-bar")

    // Generate For First slot
    randomEmoteIndex = Math.floor(Math.random() * emotesClone.length)
    currentEmoteFirst = emotesClone[randomEmoteIndex]
    emotesClone.splice(randomEmoteIndex, 1)
  }

  const initRound = () => {
    cycleBool = !cycleBool
    roundKeysTyped = 0;
    inputEmote.readOnly = false;
    inputEmote.focus(); // Automatically focus input text

    gameUpperContent.style.marginTop = "500px"
    setTimeout(() => gameUpperContent.style.transform = "", 50)
    setTimeout(() => gameUpperContent.style.clip = "", gameUpperContent.style.position = "", 100)


    if(emotesClone.length <= 0) emotesClone = JSON.parse(JSON.stringify(emotes))

    // SHOW FIRST SLOT
    slotVisibility(cycleBool);

    // Set opposite img depending on bool
    setImg(cycleBool);

    // GENERATE NEW FOR OTHER SLOT
    generateImg(cycleBool);


    setTimeout(() => initRoundDOM(), 100)
  }


  function slotVisibility(cycleBool) {
    let num1;
    let num2;
    if(cycleBool === true) num1 = 0, num2 = 1;
    if(cycleBool === false) num1 = 1, num2 = 0;

    emoteImg[num1].style.height = "";
    emoteImg[num1].style.width = "";
    emoteImg[num1].style.visibility = "visible";
    emoteImg[num2].style.visibility = "hidden";
    emoteImg[num2].style.height = "0";
    emoteImg[num2].style.width = "0";
  }

  function setImg(cycleBool) {
    if(cycleBool === true) {
      setEmoteFirst()
      currentEmote = currentEmoteFirst;
    } else {
      setEmoteLast();
      currentEmote = currentEmoteLast;
    }
  }

  function generateImg(cycleBool) {
    if(cycleBool === true) {
      randomEmoteIndex2 = Math.floor(Math.random() * emotesClone.length)
      currentEmoteLast = emotesClone[randomEmoteIndex2]

      setEmoteLast();

      emotesClone.splice(randomEmoteIndex2, 1)
    } else {
      randomEmoteIndex = Math.floor(Math.random() * emotesClone.length)
      currentEmoteFirst = emotesClone[randomEmoteIndex]
  
      setEmoteFirst();

      emotesClone.splice(randomEmoteIndex, 1)
    }
  }

  function setEmoteFirst() {
    if(currentEmoteFirst.provider === "twitch") emoteImg[0].src = `https://static-cdn.jtvnw.net/emoticons/v1/${currentEmoteFirst.id}/3.0`
    if(currentEmoteFirst.provider === "bttv") emoteImg[0].src = `https://cdn.betterttv.net/emote/${currentEmoteFirst.id}/3x`
    if(currentEmoteFirst.provider === "ffz") emoteImg[0].src = `https://cdn.frankerfacez.com/emoticon/${currentEmoteFirst.id}/4`
  }

  function setEmoteLast() {
    if(currentEmoteLast.provider === "twitch") emoteImg[1].src = `https://static-cdn.jtvnw.net/emoticons/v1/${currentEmoteLast.id}/3.0`
    if(currentEmoteLast.provider === "bttv") emoteImg[1].src = `https://cdn.betterttv.net/emote/${currentEmoteLast.id}/3x`
    if(currentEmoteLast.provider === "ffz") emoteImg[1].src = `https://cdn.frankerfacez.com/emoticon/${currentEmoteLast.id}/4`
  }


  const initRoundDOM = () => {
    gameUpperContent.style.marginTop = "0px"

    // SPEED TIMER
    setTimeout(function() {
      const speedInterval = setInterval(() => currentSpeed(), 10)
      function currentSpeed() {
        speed += 10;
      }
      this.stopSpeed = function() {
        clearInterval(speedInterval)
      }
    }, 90)
  }

  function guessListener(e) {
    if(gameStarted === false && e.key === "Enter") timer(); // <--- inits game
    if(gameStarted === true && e.key === "Enter") {
      if(inputEmote.value === "") return;
      const guess = inputEmote.value.toLowerCase();
      const emoteCode = currentEmote.name.toLowerCase();
      
      if(guess === emoteCode) {
        // STATS
        totalKeysTyped += roundKeysTyped; // GET TOTAL KEYS TYPED
        totalEmoteCharacters += currentEmote.name.length; // GET TOTAL EMOTE CHARACTERS
        stopSpeed(); // STOP SPEED TIMER

        handleRoundWin();
        inputEmote = document.querySelector(".inputEmote")
      } else {
        incorrectGuesses++; // Incorrect Guesses
        wrongGuessAnimation()
      }
      inputEmote.value = "";
    }

    // ADD ROUND KEYS TYPED
    if(alphabet.includes(e.key.toLowerCase())) {
      roundKeysTyped++;
    }
  }

  let skipBool = true;
  function skipListener(e) {
    if(skipBool) {
      skipBool = false;
 
      if(gameStarted === true && e.key === "ArrowUp") {
        inputEmote.value = ""
        gameUpperContent.style.transform = "scale(0)"
  
        setTimeout(function() {
          gameUpperContent.style.clip = "rect(0px,0px,0px,0px)", gameUpperContent.style.position = "absolute";
          initRound("skip");
        }, 100)
      } 
      
      setTimeout(() => skipBool = true, 400)
    }
  }


  // DOM MANIPULATION WHEN USER GUESS WRONG
  const wrongGuessAnimation = () => {
    inputEmote.classList.add("input-wrong");
    inputEmote.classList.add("animate__headShake");

    setTimeout(function() {
      inputEmote.classList.remove("animate__headShake")
      inputEmote.classList.remove("input-wrong");
    }, 400)
  }

  // HANDLE CORRECT GUESS
  const handleRoundWin = () => {
    // Add score
    currentScore++;
    for(let score of finalScore) score.innerText = currentScore;

    // Emote animation
    gameUpperContent.style.transform = "scale(0)"

    setTimeout(function() {
      gameUpperContent.style.clip = "rect(0px,0px,0px,0px)", gameUpperContent.style.position = "absolute";
      initRound()
    }, 100)

  }


  // HANDLE ROUND END
  const handleRoundEnd = () => {
    gameStarted = false;
    inputEmote.readOnly = true;
    inputEmote.value = "";
    gameResults.style.display = "block";
    gameResults.classList.add("racer-fade-output")
    gameUpperContent.style.marginTop = "500px";

    // CALCULATE STATS
    const avgSpeed = speed / currentScore;
    const avgSpeedText = `${Math.round(avgSpeed) / 1000}s`
    resultSpeedStats.innerText = avgSpeedText;

    const accuracy = (totalEmoteCharacters / totalKeysTyped) * 100;
    const accuracyText = `${Math.round((accuracy + Number.EPSILON) * 100) / 100}%`
    resultAccuracyStats.innerText = accuracyText;

    resultIncorrectStats.innerText = incorrectGuesses;

    // Remove event listeners
    document.removeEventListener("keypress", guessListener)
    document.removeEventListener("keydown", skipListener)

  }

  // Play again button execute
  const playAgainDomReset = () => {
    inputEmote.focus(); // Automatically focus input text
    for(let score of finalScore) score.innerText = currentScore; // Reset score
    gameUpperContent.style.clip = "rect(0px,0px,0px,0px)", gameUpperContent.style.position = "absolute";

    gameInfoLabelContainer.style.display = "block"
    circleBox.classList.remove("racer-timer-bar")

    // Reset Stats
    speed = 0;
    roundKeysTyped = 0;
    totalKeysTyped = 0;
    totalEmoteCharacters = 0;
    incorrectGuesses = 0;

    // Add event listener
    document.addEventListener("keypress", guessListener)
    document.addEventListener("keydown", skipListener)
  }


  // #################################################################################
  // ############### GUESS THE EMOTE GAME (DYNAMIC PAGE CREATION) ####################
  // #################################################################################


  this.racerGameHTML = function() {
    return (
      game.innerHTML =
      `
      <div class="original-game">
      <div class="game-results animate__animated animate__faster" style="display: none">
        <div class="new-personal-best hide">New Personal Best!</div>
        <h2>Your Score:</h2>
        <div class="final-score final-score-result">0</div>
        <div class="result-stats">
          <h3>STATS</h3>
          <div>Speed: <span class="result-speed-stats"></span></div>
          <div>Accuracy: <span class="result-accuracy-stats"></span></div>
          <div>Incorrect Guesses: <span class="result-incorrect-stats"></span></div>
        </div>
        <div class="game-results-nav">
          <button class="game-nav-btn play-again-btn">PLAY AGAIN</button>
          <button class="game-nav-btn main-lobby-btn">MAIN MENU</button>
        </div>
      </div>
      <div class="game-info-label-container">
        <h2>GUESS AS MANY EMOTES AS YOU CAN UNDER 60 SECONDS</h2>
        <h2 class="racer-start-game-label"> PRESS ENTER <img class="enter-key" src="imgs/EnterKey.svg"> TO START</h2>
        <button class="racer-start-game-label-btn" style="display: none;">PRESS TO START</button>
      </div>
      <div class="game-upper">
        <div class="racer-game-timer-container">
          <div class="racer-game-timer">60s</div>
          <svg class="circle-box" width="100%" height="100%">
            <circle cx="50%" cy="50%" r="47" stroke-width="6" fill="transparent"/>
          </svg>
        </div>
        <h2 class="final-score-game final-score-racer">SCORE: <span class="final-score">0</span></h2>
          <div class="game-upper-content-container">
          <div class="game-upper-content animate__animated animate__fast" style="margin-top: 500px">
            <div class="emote-img-container">
              <img class="emote-img" src="" alt="">
              <img class="emote-img" src="" alt="">
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
          autofocus
          readonly>
        </div>
        <div class="game-skip-container">
          <h2 class="game-skip-label">PRESS <img class="arrow-up-key"src="imgs/ArrowUp.svg"> TO SKIP</h2>
        </div>
      </div>
    </div>
      `
    )
  }
  let racerStartGameLabelBtn = null;
  let emoteImg = null;
  let gameResults = null;
  let emoteName = null;
  let gameUpperContent = null;
  let finalScore = null;
  let playAgainBtn = null;
  let mainLobbyBtn = null;
  let inputEmote = null;
  let waitLabel = null;
  let racerGameTimerContainer = null;
  let racerGameTimer = null;
  let gameInfoLabelContainer = null;
  let circleBox = null;
  // stats
  let resultSpeedStats = null;
  let resultAccuracyStats = null;
  let resultIncorrectStats = null;
  this.racerGameDOM = function() {
  racerStartGameLabelBtn = document.querySelector(".racer-start-game-label-btn");
  inputEmote = document.querySelector(".inputEmote");
  emoteImg = document.querySelectorAll(".emote-img");
  emoteName = document.querySelector(".emote-name");
  gameResults = document.querySelector(".game-results");
  gameUpperContent = document.querySelector(".game-upper-content");
  finalScore = document.querySelectorAll(".final-score");
  playAgainBtn = document.querySelector(".play-again-btn");
  mainLobbyBtn = document.querySelector(".main-lobby-btn");
  waitLabel = document.querySelector(".wait-label");
  racerGameTimerContainer = document.querySelector(".racer-game-timer-container");
  racerGameTimer = document.querySelector(".racer-game-timer");
  gameInfoLabelContainer = document.querySelector(".game-info-label-container")
  circleBox = document.querySelector(".circle-box")
  // stats
  resultSpeedStats = document.querySelector(".result-speed-stats")
  resultAccuracyStats = document.querySelector(".result-accuracy-stats")
  resultIncorrectStats = document.querySelector(".result-incorrect-stats")
  }


  this.racerGameEVENT = function() {
    // inputEmote.addEventListener("keypress", guessListener)
    document.addEventListener("keypress", guessListener)
    document.addEventListener("keydown", skipListener)

    // Play Again
    playAgainBtn.addEventListener("click", function() {
      racerGameRemoveEVENT();
      currentScore = 0;
      gameResults.style.display = "none"
      playAgainDomReset();
    });

    // Back To Main Page
    mainLobbyBtn.addEventListener("click", function() {
      racerGameRemoveEVENT();
      mainPage();
    });

    racerStartGameLabelBtn.addEventListener("click", function() {
      timer();
    })
    
  }

  this.racerGameRemoveEVENT = function() {
    // remove potential event listeners from last session
    if(typeof guessListener === "function") document.removeEventListener("keypress", guessListener)
    if(typeof skipListener === "function") document.removeEventListener("keydown", skipListener)
  }

  pageChangeDisplay("game")

  racerGameHTML(); // Loads html
  pageTransition("game"); // Page transition
  racerGameDOM(); // Inits dom wiring
  racerGameEVENT(); // Inits event listeners

  inputEmote.focus(); // Automatically focus input text
  gameUpperContent.style.clip = "rect(0px,0px,0px,0px)", gameUpperContent.style.position = "absolute";

  this.getCurrentPage = function() {
    return currentPage;
  }
}