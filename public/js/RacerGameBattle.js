

function racerGameBattle(mode) {
  // USER CONFIG
  const profileImg = getProfileImg();
  const username = getUsername();
  const nameColor = getUsernameColorV2();

  // ROOM CONFIG
  let roomId = "";
  let currentPage = "1v1";

  // GAME CONFIG
  let localUsers = [];

  // GENERAL CONFIG
  function configuration() {
    inputEmote.focus(); // Automatically focus input text
    gameUpperContent.style.clip = "rect(0px,0px,0px,0px)", gameUpperContent.style.position = "absolute";
    if(mode === "public") racerStartGameLabel.style.display = "none"
    navAside.style.display = "none";
    infoAside.style.display = "none";
  }

  adminMessages();

  // Quickplay or Private lobby with friends
  if(mode === "public") socket.emit("quickPlay1v1", username, nameColor , profileImg);
  if(mode === "private") socket.emit("createPrivateLobby1v1", username, nameColor, profileImg);

  // Request join room by url
  if(mode === "joinByLink") {
    // DOM
    loadingBox.style.display = "flex";
    loadingBox.style.marginLeft = "0px";
    main.style.visibility = "hidden";
    infoAside.style.display = "none";
    

    roomId = location.search.substring(1); // Get room id from url
    socket.emit("requestJoin1v1", roomId, username, nameColor, profileImg);
  } 

  socket.on("roomIsFull", () => {
    mainPage(); // Send user to mainPage
    roomIsFullLabel(); // Send user message that room is full
  });


  // Init Private Lobby
  socket.on("initPrivateLobby1v1", (room) => {
    initPage()
    // Set INVITE LINK
    inviteLinkBox.style.display = "block";
    // history.pushState({urlPath: `/1v1/?${room.id}`},"",`/1v1/?${room.id}`)
    inviteLinkInput.value = location.origin + `/1v1/?${room.id}`;

    // DOM
    firstPlayerDom();
    waitingForOtherPlayersHIDE()

    // Set configurations
    roomId = room.id;

  });


  // Init Private Lobby
  socket.on("initPublicLobby1v1", (room) => {
    initPage()
    // DOM
    firstPlayerDom();
    waitingForOtherPlayersSHOW()

    // Set configurations
    roomId = room.id;
  });


  // Join Public Lobby
  socket.on("joinPublicLobby1v1", (users, room, userSocketId) => {
    if(userSocketId === socket.id) initPage();

    if(users.length === 1) {

    // DOM
    firstPlayerDom();
    waitingForOtherPlayersSHOW()

    } else {

      // So both users have their position at [0]
      reverseRespectiveUsers(users)

      // DOM
      bothPlayersDom(room);
      waitingForOtherPlayersHIDE();
      gameInfoLabelContainer.classList.add("hide-fade")
      setTimeout(() => gameInfoLabelContainer.style.display = "none", 200)

      // add isReady & score for localUsers
      localUsersConfig();

      // START GAME
      if(users[0].id === socket.id) { // Isolate so only one player starts game
        setTimeout(() => requestStartGamePublic1v1(), 400)
      }
    }

    // Set configurations
    roomId = room.id;
    
  });


  // Join Private Lobby
  socket.on("joinPrivateLobby1v1", (users, room, userSocketId) => {
    if(userSocketId === socket.id) {
      loadingBox.style.marginLeft = "";
      initPage();
    } 

    // We need to set these icons because when pathname/link is not the origin we get an error and imgs wont load
    enterKey.src = `${window.location.origin}/imgs/EnterKey.svg`
    arrowUpKey.src = `${window.location.origin}/imgs/ArrowUp.svg`

    // DOM
    waitingForOtherPlayersHIDE();


    if(users.length === 1) {

    // Set INVITE LINK
    inviteLinkBox.style.display = "block";
    inviteLinkInput.value = location.href;

    // SET PLAYER DOM
    firstPlayerDom();

    } else {

      // so both users have their position at [0]
      reverseRespectiveUsers(users);

      // DOM
      bothPlayersDom(room);
      racerStartGameLabel.classList.remove("hide-fade")

      // add isReady & score for localUsers
      localUsersConfig();

    }

    // Set configurations
    roomId = room.id;

  });


  function playAgainPrivate() {
    // Event Listener
    document.addEventListener("keypress", guessListener)
    document.addEventListener("keydown", skipListener)
    
    // Reset DOM
    circleBox.classList.remove("racer-timer-bar")
    gameResults.style.display = "none";

    inviteCopyBtn.innerText = "COPY"
    inviteCopyBtn.classList.remove("copied-animation")
    gameInfoLabelContainer.style.display = "block";

    // Reset users
    for(let i = 0; i < localUsers.length; i++) {
      localUsers[i].score = 0;
      battlePlayerReady[i].innerText = "NOT READY"
    } 
    for(let i = 0; i < 2; i++) {
      battlePlayerScore[i].innerText = ""; 
      battlePlayerImg[i].classList.remove("fade-scale-animation")
      battlePlayerName[i].classList.remove("fade-scale-animation")
    }

    // RESET VARIABLES
    roundKeysTyped = 0;
    totalKeysTyped = 0;
    totalEmoteCharacters = 0;
    // Incorrect Guesses
    incorrectGuesses = 0;

    currentScore = 0;
    currentEmote = {};
    gameStarted = false;
    // So we can PRELOAD Second Image
    cycleBool = false;
    currentEmoteFirst = {};
    currentEmoteLast = {};
  }



  function firstPlayerDom() {
    battlePlayerImg[0].src = profileImg
    battlePlayerName[0].innerText = username;
    battlePlayerName[0].style.color = nameColor;
  }

  function bothPlayersDom(room) {
    for(let i = 0; i < 2; i++) {
      battlePlayerImg[i].src = localUsers[i].profileImg
      battlePlayerName[i].innerText = localUsers[i].username
      battlePlayerName[i].style.color = localUsers[i].nameColor
      if(room.isPrivate === true) {
        battlePlayerReady[i].innerText = "NOT READY"
        battlePlayerReady[i].classList.remove("color-green") // Reset classname for player [0]
      }
    }
    battlePlayerImg[1].classList.add("fade-scale-animation")
    battlePlayerName[1].classList.add("fade-scale-animation")
  }

  function reverseRespectiveUsers(users) {
    if(socket.id === users[0].id) {
      localUsers = users;
    } else {
      localUsers =  [...users].reverse();
    }
  }

  function localUsersConfig() {
    localUsers[0].isReady = false;
    localUsers[1].isReady = false;

    localUsers[0].score = 0;
    localUsers[1].score = 0;
  }


  // User Leave
  socket.on("userLeave1v1", (userSocketId, users, mode) => {
    // Set INVITE LINK
    if(mode === "private" && inviteLinkInput === null || inviteLinkInput === undefined) {
      inviteLinkBox.style.display = "block";
      inviteLinkInput.value = location.href;
    }

    // DOM
    battlePlayerImg[1].src = "";
    battlePlayerName[1].innerText = "";
    battlePlayerReady[1].innerText = "";
    battlePlayerImg[1].classList.remove("fade-scale-animation")
    battlePlayerName[1].classList.remove("fade-scale-animation")
    if(mode === "public") {
      waitingForOtherPlayersSHOW()
    }

    // Splice user
    const index = users.findIndex(e => e.id === userSocketId);
    localUsers.splice(index, 1)

    // Stop TIMER & Force WIN!
    if(gameStarted === true) {
      if(typeof stop1v1Timer === "function") stop1v1Timer();
      if(typeof stopInitTimer === "function") stopInitTimer();
      forceWin();
    }

  });


  // Listen for Lobby leader to start game
  this.requestStartGamePrivate1v1 = function() {
    socket.emit("requestStartGamePrivate1v1", roomId)
  }

  // Start automatically when 2 players are in a room
  this.requestStartGamePublic1v1 = function() {
    socket.emit("requestStartGamePublic1v1", roomId)
  }


  socket.on("startGame1v1", (emotesServer, randomEmoteIndexArr) => {

    // Set game configuration
    localEmotes = emotesServer;
    localRandomEmoteIndexArr = randomEmoteIndexArr;
    gameStarted = true;

    // DOM
    gameInfoLabelContainer.style.display = "none"
    for(let rdy of battlePlayerReady) {
      rdy.classList.remove("color-green")
      rdy.innerText = ""
    }

    // Init countdown
    startCountdown()

    // Google Tag Manager
    gtagOneStartGame(localUsers[0].room.isPrivate) // <-- pass in a boolean, I know its ugly

  });

  socket.on("toggleReady1v1", (userSocketId) => {

    // Toggle Ready for player
    for(let i = 0; i < localUsers.length; i++) {
      if(userSocketId === localUsers[i].id) {
        localUsers[i].isReady = !localUsers[i].isReady;

        if(localUsers[i].isReady) {
          battlePlayerReady[i].classList.remove("color-red")
          battlePlayerReady[i].classList.add("color-green")
          battlePlayerReady[i].innerText = "READY"
        } else {
          battlePlayerReady[i].classList.remove("color-green")
          battlePlayerReady[i].classList.add("color-red")
          battlePlayerReady[i].innerText = "NOT READY"
        }
      } 

    }

    // Start game!
    if(userSocketId === socket.id) { // Isolate so only one player starts game
      if(localUsers.every(e => e.isReady)) {
        requestStartGamePrivate1v1();
      } 
    }

  });


  // ####################################
  // ########## GAME LOGIC ##############
  // ####################################

  // ##### STATS #####
  // Speed
  let speed = 0;
  // Accuracy
  const alphabet = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
  let roundKeysTyped = 0;
  let totalKeysTyped = 0;
  let totalEmoteCharacters = 0;
  // Incorrect Guesses
  let incorrectGuesses = 0;


  // ##### GAME #####

  
  let currentScore = 0;
  let currentEmote = {};
  let gameStarted = false;
  // So we can PRELOAD Second Image
  let cycleBool = false;
  let currentEmoteFirst = {};
  let currentEmoteLast = {};


  function startCountdown() {
    // If user leaves page by clicking on the navLogo we need to clear timer so we dont get any errors
    this.stopInitTimer = function() {
      myWorker.postMessage("clearCountdown")
      clearInterval(countdown);
    }

    // Start countdown timer in worker.js
    myWorker.postMessage("startCountdown")

    // Update countdown timer in worker.js on window.onfocus (i.e if user switches tab and comes back)
    window.onfocus = function() {
      myWorker.postMessage("updateCountdown")
    };

    myWorker.onmessage = (e) => {
      if(e.data.name === "updateCountdown") {
        count = e.data.message
        // document.querySelector(".game-starting-in-time").innerHTML=count /10+ " ..."; 
      }

      if(e.data === "stopCountdown") {
        if(typeof stopTimerInit1v1 === "function") stopTimerInit1v1()
      }

    }

    function stopTimerInit1v1() {
      clearInterval(countdown);
      document.querySelector(".game-starting-in-time").innerHTML=count /10+ " ...";
      gameStartingInContainer.classList.add("hide-fade");

      setTimeout(function() {
        gameStartingInContainer.style.display = "none"
      }, 200)

      timer();
    }

  
    // Show timer
    gameStartingInContainer.style.display = ""
    setTimeout(() => gameStartingInContainer.classList.remove("hide-fade"), 10)
    
    let count = 50;
    let countdown = setInterval(() => init1v1Countdown(), 100); //10 will  run it every 100th of a second
    function init1v1Countdown() {
      if(count <= 0) return;
      count--;

      if(count%10 === 0) {
        gameStartingIn.innerHTML=count /10+ ".0" + " ...";
      } else {
        gameStartingIn.innerHTML=count /10+ " ...";
      }
    }
  }

  function timer() {
    // Configutation for game
    startGameConfig()

    // WORKERS
    myWorker.postMessage("startCountdown1v1")

    this.stop1v1Timer = function() {
      myWorker.postMessage("clearCountdown1v1")
      clearInterval(counter);
    }

    window.onfocus = function() {
      if(main.dataset.page === "1v1") myWorker.postMessage("updateCountdown1v1")
    };

    myWorker.onmessage = (e) => {
      if(e.data.name === "updateCountdown1v1") {
        count = e.data.message
      }
      if(e.data === "stopCountdown1v1") {
        clearInterval(counter)
      }
    }



    // Show timer
    racerGameTimerContainer.classList.remove("hide-fade");
    racerGameTimerContainer.style.display = ""
    
    // Timer logic
    let count = 60;
    let counter = setInterval(() => init1v1Timer(), 1000); //10 will  run it every 100th of a second
    function init1v1Timer() {
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
    inputEmote.readOnly = false;
    gameUpperContent.style.transition = "100ms"
    circleBox.classList.add("racer-timer-bar")
    document.addEventListener("keydown", skipListener)

    // Generate For First slot
    currentEmoteFirst = localEmotes[localRandomEmoteIndexArr[0]]
    localRandomEmoteIndexArr.splice(0, 1)
  }

  const initRound = (data) => {
    cycleBool = !cycleBool
    roundKeysTyped = 0;
    inputEmote.focus(); // Automatically focus input text

    gameUpperContent.style.marginTop = "500px"
    setTimeout(() => gameUpperContent.style.transform = "", 50)
    setTimeout(() => gameUpperContent.style.clip = "", gameUpperContent.style.position = "", 100)


    // This should never happen, but IF player has guessed all emotes, return
    if(localRandomEmoteIndexArr.length <= 0) return;
    // if(emotesClone.length <= 0) emotesClone = JSON.parse(JSON.stringify(emotes))

    // SHOW FIRST SLOT
    slotVisibility(cycleBool);

    // Set opposite img depending on bool
    setImg(cycleBool);

    // GENERATE NEW FOR OTHER SLOT
    generateImg(cycleBool, data);


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
      setEmoteFirst();
      currentEmote = currentEmoteFirst;
    } else {
      setEmoteLast();
      currentEmote = currentEmoteLast;
    }
  }

  function generateImg(cycleBool, data) {

    if(cycleBool === true) {

      currentEmoteLast = localEmotes[localRandomEmoteIndexArr[0]]

      setEmoteLast();

      dataSkipSplice(data);
    } else {
      currentEmoteFirst = localEmotes[localRandomEmoteIndexArr[0]]
  
      setEmoteFirst();
  
      dataSkipSplice(data);
    }
  }

  function setEmoteFirst() {
    if(currentEmoteFirst.provider === "twitch") emoteImg[0].src = `https://static-cdn.jtvnw.net/emoticons/v1/${currentEmoteFirst.id}/3.0`
    if(currentEmoteFirst.provider === "bttv") emoteImg[0].src = `https://cdn.betterttv.net/emote/${currentEmoteFirst.id}/3x`
    if(currentEmoteFirst.provider === "ffz") emoteImg[0].src = `https://cdn.frankerfacez.com/emoticon/${currentEmoteFirst.id}/4`
    if(currentEmoteFirst.provider === "7tv") emoteImg[0].src = `https://cdn.7tv.app/emote/${currentEmoteFirst.id}/3x`
  }

  function setEmoteLast() {
    if(currentEmoteLast.provider === "twitch") emoteImg[1].src = `https://static-cdn.jtvnw.net/emoticons/v1/${currentEmoteLast.id}/3.0`
    if(currentEmoteLast.provider === "bttv") emoteImg[1].src = `https://cdn.betterttv.net/emote/${currentEmoteLast.id}/3x`
    if(currentEmoteLast.provider === "ffz") emoteImg[1].src = `https://cdn.frankerfacez.com/emoticon/${currentEmoteLast.id}/4`
    if(currentEmoteFirst.provider === "7tv") emoteImg[1].src = `https://cdn.7tv.app/emote/${currentEmoteFirst.id}/3x`
  }

  function dataSkipSplice(data) {
    if(data === "skip") {
      const element = localRandomEmoteIndexArr[0]; // save element
      localRandomEmoteIndexArr.splice(0, 1); // remove element
      localRandomEmoteIndexArr.push(element); // put it back at end of array
    } else {
      localRandomEmoteIndexArr.splice(0, 1)
    }
  }

  const initRoundDOM = () => {
    gameUpperContent.style.marginTop = "80px"

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
    if(localUsers.length === 0) return // If a player has not joined yet, return
    if(localUsers[0].room.isPrivate === true) togglePlayerReady(e); // Toggle player ready, when both players are ready, game will start
    if(gameStarted === true && e.key === "Enter") {
      if(inputEmote.value === "") return;
      const guess = inputEmote.value.toLowerCase();
      const emoteCode = currentEmote.name.toLowerCase();
      
      if(guess === emoteCode) {
        // STATS
        totalKeysTyped += roundKeysTyped; // GET TOTAL KEYS TYPED
        totalEmoteCharacters += currentEmote.name.length; // GET TOTAL EMOTE CHARACTERS
        stopSpeed(); // STOP SPEED TIMER

        socket.emit("userCorrect1v1", roomId, socket.id) // Socket
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

  let toggleReadyBool = true;
  function togglePlayerReady(e) {
    if(gameStarted === false && e.key === "Enter") {
      // If there are 2 players in room
      if(toggleReadyBool && localUsers.filter(e => { return e.id }).length === 2) {
        toggleReadyBool = false;
        socket.emit("toggleReady1v1", roomId)
        setTimeout(() => toggleReadyBool = true, 1000)
      }
    }
  }

  // ###############################################
  // ################## SOCKET #####################
  // ###############################################

  socket.on("userCorrect1v1", (userSocketId) => {

    for(let i = 0; i < localUsers.length; i++) {
      
      if(localUsers[i].id === userSocketId) {

        localUsers[i].score = localUsers[i].score + 1;

        battlePlayerScore[i].innerText = localUsers[i].score.toString();


        battlePlayerScoreFx[i].classList.remove("score-fx")
        setTimeout(() => battlePlayerScoreFx[i].classList.add("score-fx"), 50)

      }

    }
  });



  // ###############################################
  // ################## GAME LOCIG #################
  // ###############################################

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
  const handleRoundEnd = (message) => {
    if(message === undefined) handleRoundEndSocket();

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

    // Ready = FALSE
    for(let i = 0; i < localUsers.length; i++) localUsers[i].isReady = false;

    // Remove event listeners
    document.removeEventListener("keypress", guessListener)
    document.removeEventListener("keydown", skipListener)

  }

  function handleRoundEndSocket() {
    // Sort users by score
    const usersSorted = localUsers.sort((a,b) => b.score - a.score);
    if(usersSorted[0].score === usersSorted[1].score) {

      resultsTableDOM(usersSorted)

      gameResults.classList.remove("game-results-win")
      gameResults.classList.remove("game-results-lose")
      gameResults.classList.add("game-results-draw")
      winLoseLabel1v1.innerText = "DRAW"

    } else {

      // Set global DOM
      resultsTableDOM(usersSorted)

      // Set local DOM
      if(usersSorted[0].id === socket.id) {
        winLoseLabel1v1.innerText = "YOU WIN"
        gameResults.classList.add("game-results-win")

        // If room is Public, give coins
        if(!localUsers[0].room.isPrivate) {
          // Yep coins
          outputCoinsContent.style.display = "flex";
          outputCoins.innerText = "10";
          setCoins(10, superSecretKeyToAccessUnlimitedAmountOfMoney.code)
        }
        oneIncrementWins();
        oneIncrementWinningStreak();
        oneIncrementGamesPlayed();
      } else {
        winLoseLabel1v1.innerText = "YOU LOSE"
        gameResults.classList.add("game-results-lose")
        oneResetWinningStreak();
        oneIncrementGamesPlayed();
      }
    }

    // SCORE
    for(let i = 0; i < 2; i++) {
      battlePlayerScoreBoard[i].innerText = usersSorted[i].score
    }

  }

  function resultsTableDOM(usersSorted) {
    // Set global DOM
    boardImg1v1[0].src = usersSorted[0].profileImg;
    boardImg1v1[1].src = usersSorted[1].profileImg;
    battlePlayerNameBoard[0].innerText = usersSorted[0].username;
    battlePlayerNameBoard[0].style.color = usersSorted[0].nameColor;
    battlePlayerNameBoard[1].innerText = usersSorted[1].username;
    battlePlayerNameBoard[1].style.color = usersSorted[1].nameColor;
  }

  function forceWin() {
    gameStartingInContainer.classList.add("hide-fade")
    setTimeout(() => gameStartingInContainer.style.display = "none")
    handleRoundEnd("force-win");

    boardImg1v1[0].src = localUsers[0].profileImg;
    battlePlayerNameBoard[0].innerText = localUsers[0].username;
    battlePlayerNameBoard[0].style.color = localUsers[0].nameColor;

    winLoseLabel1v1.innerText = "YOU WIN"
    gameResults.classList.add("game-results-win")

    circleBox.classList.remove("racer-timer-bar")

    // Ready = FALSE
    for(let i = 0; i < localUsers.length; i++) localUsers[i].isReady = false;

    // If room is Public, give coins
    if(!localUsers[0].room.isPrivate) {
      // Yep coins
      outputCoinsContent.style.display = "flex";
      outputCoins.innerText = "5";
      setCoins(5, superSecretKeyToAccessUnlimitedAmountOfMoney.code)
    }

    oneIncrementWins();
    oneIncrementWinningStreak();
    oneIncrementGamesPlayed();
  }

  // #################################################################################
  // ############### GUESS THE EMOTE GAME (DYNAMIC PAGE CREATION) ####################
  // #################################################################################


  this.racerGameBattleHTML = function() {
    return (
      game.innerHTML =
      `
      <div class="original-game">
      <div class="game-results animate__animated animate__faster" style="display: none">
        <h1 class="win-lose-label-1v1"></h1>
        <div class="output-coins-box"><span class="output-coins-content" style="display: none">+<span class="output-coins"></span><img class="output-yep-coin" src="/imgs/YEP_COIN.svg"></span></div>
        <div class="scoreboard-1v1">
          <div class="board-score-label">SCORE:</div>
          <div class="scoreboard-1 scoreboard-board-1v1">
            <h1 class="board-ranking-1v1">1</h1>
            <div class="battle-player-img-box"><img class="board-img-1v1" src="" alt=""></div>
            <div class="battle-player-name-board"></div>
            <div class="battle-player-score-board battle-player-score1">0</div>
          </div>
          <div class="scoreboard-2 scoreboard-board-1v1">
            <h1 class="board-ranking-1v1">2</h1>
            <div class="battle-player-img-box"><img class="board-img-1v1" src="" alt=""></div>
            <div class="battle-player-name-board"></div>
            <div class="battle-player-score-board battle-player-score1">0</div>
          </div>
        </div>
        <div class="result-stats">
          <h3>STATS</h3>
          <div>Speed: <span class="result-speed-stats"></span></div>
          <div>Accuracy: <span class="result-accuracy-stats"></span></div>
          <div>Incorrect Guesses: <span class="result-incorrect-stats"></span></div>
        </div>
        <div class="game-results-nav">
          <button class="game-nav-btn game-nav-btn-multiplayer play-again-btn">PLAY AGAIN</button>
          <button class="game-nav-btn game-nav-btn-multiplayer main-lobby-btn">MAIN MENU</button>
        </div>
      </div>
      <div class="game-info-label-container-1v1">
        <h1 class="waiting-for-other-players">Searching for players <span class="mini-dot-1">.</span><span class="mini-dot-2">.</span><span class="mini-dot-3">.</span></h1>
        <h2 class="racer-start-game-label hide-fade"> PRESS ENTER <img class="enter-key" src="imgs/EnterKey.svg"> TO READY UP</h2>
        <div class="invite-link-box" style="display: none;">
          <div class="invite-link-first">
            <div class="invite-link-label">HOVER TO SEE INVITE LINK</div>
            <input class="invite-link-input" type="text" value="LINK HERE">
          </div>
          <div class="invite-link-second">
            <button class="invite-copy-btn">COPY</button>
          </div>
        </div>
      </div>
      <div class="game-upper game-upper2">
        <div class="racer-game-timer-container">
          <div class="racer-game-timer">60s</div>
          <svg class="circle-box" width="100%" height="100%">
            <circle cx="50%" cy="50%" r="47" stroke-width="6" fill="transparent"/>
          </svg>
        </div>
        <div class="battle-container-1v1">
          <div class="battle-player-box">
            <div class="battle-player-score-fx battle-player-score-fx1">+1</div>
            <div class="battle-player-score battle-player-score1"></div>
            <div class="battle-player-img-box"><img class="battle-player-img" src="" alt=""></div>
            <div class="battle-player-name"></div>
            <div class="battle-player-ready"></div>
          </div>
          <img class="battle-icon-1v1" src="/imgs/SwordsGlow.png" alt="">
          <div class="battle-player-box">
            <div class="battle-player-score-fx battle-player-score-fx2">+1</div>
            <div class="battle-player-score battle-player-score2"></div>
            <div class="battle-player-img-box"><img class="battle-player-img" src="" alt=""></div>
            <div class="battle-player-name"></div>
            <div class="battle-player-ready"></div>
          </div>
        </div>
          <div class="game-upper-content-container">
          <div class="game-upper-content animate__animated animate__fast" style="margin-top: 500px">
            <div class="emote-img-container">
              <img class="emote-img" src="" alt="">
              <img class="emote-img" src="" alt="">
            </div>
          </div>
        </div>
      </div>
      <div class="game-starting-in-container hide-fade" style="display: none;">
        <div class="game-starting-in-box">
          <h1>Starting</h1>
          <div class="game-starting-in-time">5.0...</div>
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
  let gameStartingInContainer = null;
  let gameStartingIn = null;
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
  let inviteLinkInput = null;
  let battlePlayerImg = null;
  let battlePlayerName = null;
  let battlePlayerReady = null;
  let battlePlayerScore = null;
  let battlePlayerScoreBoard = null;
  let battlePlayerScoreFx = null;
  let boardImg1v1 = null;
  let battlePlayerNameBoard = null;
  let boardRanking1v1 = null;
  let winLoseLabel1v1 = null;
  let racerStartGameLabel = null;
  let enterKey = null;
  let arrowUpKey = null;
  let inviteCopyBtn = null;
  let inviteLinkBox = null;
  let outputCoinsBox = null;
  let outputCoins = null;
  let outputCoinsContent = null;
  // stats
  let resultSpeedStats = null;
  let resultAccuracyStats = null;
  let resultIncorrectStats = null;
  this.racerGameBattleDOM = function() {
  gameStartingInContainer = document.querySelector(".game-starting-in-container");
  gameStartingIn = document.querySelector(".game-starting-in-time");
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
  gameInfoLabelContainer = document.querySelector(".game-info-label-container-1v1")
  circleBox = document.querySelector(".circle-box")
  inviteLinkInput = document.querySelector(".invite-link-input")
  battlePlayerImg = document.querySelectorAll(".battle-player-img")
  battlePlayerName = document.querySelectorAll(".battle-player-name")
  battlePlayerReady = document.querySelectorAll(".battle-player-ready")
  battlePlayerScore = document.querySelectorAll(".battle-player-score")
  battlePlayerScoreBoard = document.querySelectorAll(".battle-player-score-board")
  battlePlayerScoreFx = document.querySelectorAll(".battle-player-score-fx")
  boardImg1v1 = document.querySelectorAll(".board-img-1v1")
  battlePlayerNameBoard = document.querySelectorAll(".battle-player-name-board")
  boardRanking1v1 = document.querySelectorAll(".board-ranking-1v1")
  winLoseLabel1v1 = document.querySelector(".win-lose-label-1v1")
  racerStartGameLabel = document.querySelector(".racer-start-game-label")
  enterKey = document.querySelector(".enter-key")
  arrowUpKey = document.querySelector(".arrow-up-key")
  inviteCopyBtn = document.querySelector(".invite-copy-btn")
  inviteLinkBox = document.querySelector(".invite-link-box")
  outputCoinsBox = document.querySelector(".output-coins-box")
  outputCoins = document.querySelector(".output-coins")
  outputCoinsContent = document.querySelector(".output-coins-content")

  // stats
  resultSpeedStats = document.querySelector(".result-speed-stats")
  resultAccuracyStats = document.querySelector(".result-accuracy-stats")
  resultIncorrectStats = document.querySelector(".result-incorrect-stats")
  }



  this.racerGameBattleEVENT = function() {
    // inputEmote.addEventListener("keypress", guessListener)
    document.addEventListener("keypress", guessListener)


    // INVITE COPY
    inviteCopyBtn.addEventListener("click", function() {
      /* Select the text field */
      inviteLinkInput.select();
      inviteLinkInput.setSelectionRange(0, 99999); /*For mobile devices*/
      document.execCommand("copy");

      inviteCopyBtn.innerText = "COPIED!"
      inviteCopyBtn.classList.add("copied-animation")
    });

    // Play Again
    playAgainBtn.addEventListener("click", function() {

      if(mode === "public") {
        racerGameBattleRemoveEVENT();
        socket.removeAllListeners();

        socket.emit("leaveUser", "1v1Public", roomId)

        racerGameBattle("public")
      } else if(mode === "private" || mode === "joinByLink") {
        // socket.emit("leaveUser", "1v1Private", roomId)

        playAgainPrivate()
      }
      
    });

    // Back To Main Page
    mainLobbyBtn.addEventListener("click", function() {
      racerGameBattleRemoveEVENT();
      socket.disconnect();
      mainPage();
    });
  }

  this.racerGameBattleRemoveEVENT = function() {
    // remove potential event listeners from last session
    if(typeof guessListener === "function") document.removeEventListener("keypress", guessListener)
    if(typeof skipListener === "function") document.removeEventListener("keydown", skipListener)
  }

  function initPage() {
    pageChangeDisplay("game")

    racerGameBattleHTML(); // Loads html
    pageTransition("game"); // Page transition
    racerGameBattleDOM(); // Inits dom wiring
    racerGameBattleEVENT(); // Inits event listeners
  
    configuration()
  }



  this.getCurrentPage = function() {
    return currentPage;
  }

}


