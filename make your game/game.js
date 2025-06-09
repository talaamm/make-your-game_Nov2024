let score = 0
let Highscore = 0
document.getElementById("game-over").style.display = 'none'
document.getElementById("time-is-up").style.display = 'none'
const startButton = document.getElementById('start-game');
const bgSound = document.getElementById('bg-sound');
var createDuckInterval ; 
var createLargeDuckInterval ;
var createSmallDuckInterval;
let isPaused = false;
const pauseMenu = document.getElementById("pause-menu");
const continueButton = document.getElementById("continue-game");
const restartButton = document.getElementById("restart-game");
let pausebtn = document.getElementById('pausebtn')

function moveLeft(duck ,  speedx , speedy ) {

let pos = parseFloat(duck.style.left) || 0
let currentY = parseFloat(duck.style.top) || 0

function repet(){
    pos += speedx
    duck.style.left =  pos + "px"
    
    currentY += speedy
duck.style.top = currentY + "px"
     if (pos < window.innerWidth){
        requestAnimationFrame(repet)
     }
 }

 repet()
}

function moveRight(duck ,  speedx ) {
    
    let pos = duck.style.right
    pos = parseFloat(pos) || 0
    function repet(){
        pos += speedx
        duck.style.right =  pos + "px"
        
     if (pos < window.innerWidth){
         requestAnimationFrame(repet)
        }
    }

 repet()
}

var timerInterval;
let timeLeft = 30;

function startTimer() {
     timerInterval = setInterval(() => {
            timeLeft--;
            document.getElementById('time-left').textContent = timeLeft;
            
            if (timeLeft <= 0) {
                document.getElementById("time-is-up").style.display = 'block'
                document.getElementById("finalscore").textContent = score
if (score> Highscore){
    Highscore = score
}
document.getElementById('highscore').textContent = Highscore
            clearInterval(timerInterval);
            clearInterval(createDuckInterval);
            clearInterval(createLargeDuckInterval);
            clearInterval(createSmallDuckInterval);
            return
            }
 
    }, 1000); //1000ms --> 1 sec
}

startButton.addEventListener('click', () => {
  bgSound.play();
  document.getElementById("welcomeDiv").remove()
  Highscore = 0
moveLeft(document.getElementById("small"), 3 , 0)
moveLeft(document.getElementById("med") , 5, 0)
moveRight(document.getElementById("large") , 10)

startTimer();

 createDuckInterval = setInterval(() => createDuck('duck', 'med'), 1500); // Create a new duck every 1.5 seconds
 createLargeDuckInterval = setInterval(() => createDuck('yes-bg-unscreen', 'large'), 5000); // Create a new large duck every 5 seconds
createSmallDuckInterval = setInterval(() => createDuck('small_duck', 'small'), 1000); // Create a new small duck every 1 second
});

function createDuck(image , idname) {
    const duck = document.createElement('img');
    duck.src = "gifs/" + image + '.gif';  // Path to your duck image
duck.id = idname
duck.style.position = 'absolute'; // Ensure the duck is positioned absolutely on the page

//const yPos = min + Math.random() * (max - min);
//    const yPos = 50 + Math.random() * (window.innerHeight - 35 -100); /*how can i  limit this to give everytime  a certain height between 35px & innerheight - 25px? */

const minY = 50; // Minimum vertical position (visible at the top)
const maxY = window.innerHeight - 100; // Maximum vertical position (100px above the bottom)
const yPos = Math.min(maxY, Math.max(minY, minY + Math.random() * (maxY - minY)));


if (idname === 'large'){
        duck.style.right  = "-250px"
    }else{
    duck.style.left = "-200px";}
  
    duck.style.top = yPos+'px';

    // Randomize movement direction
    let dx = Math.random() > 0.5 ? 1 : -1; // Random horizontal direction
    let dy = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 0.5 + 1); // Limit vertical movement to a smaller range

    // Move the duck
  if (idname === 'large'){
    moveRight(duck , dx*10)
  }else{
      moveLeft(duck , dx*3 , dy*2)
  }

    document.body.appendChild(duck);
}


 function handleClick(wiwi){
 //   console.log(wiwi.target.nodeName )
    document.getElementById("shotgun-sound").play()

        if (wiwi.target.id == "small" ){
          score+=1
            document.getElementById("myscore").innerHTML = score 
            wiwi.target.remove()
            }else if (wiwi.target.id == "med"){
                score +=5
                wiwi.target.remove()
                document.getElementById("myscore").innerHTML = score
                
                }else if (wiwi.target.id == "large"){
                    wiwi.target.remove()
                   score +=10
                    document.getElementById("myscore").innerHTML = score 
                   
                    }else if (wiwi.target.nodeName == "BODY"){
                        score -= 2
                        document.getElementById("myscore").innerHTML = score 
        }
    if (score < 0) {
        document.getElementById("game-over").style.display = 'block'
        }else {
            document.getElementById("game-over").style.display = 'none'

        }
}

function handleClickWOminus(wiwi){
    console.log(wiwi.target.nodeName )
    document.getElementById("shotgun-sound").play()
        if (wiwi.target.id == "small" ){
          score+=1
            document.getElementById("myscore").innerHTML = score 
            wiwi.target.remove()
            }else if (wiwi.target.id == "med"){
                score +=5
                wiwi.target.remove()
                document.getElementById("myscore").innerHTML = score
                
                }else if (wiwi.target.id == "large"){
                    wiwi.target.remove()
                   score +=10
                    document.getElementById("myscore").innerHTML = score 
                   
                    }
    if (score < 0) {
        document.getElementById("game-over").style.display = 'block'
        }else {
            document.getElementById("game-over").style.display = 'none'

        }
}


// Pause Function
function pauseGame() {
    isPaused = true;
    clearInterval(timerInterval);
    clearInterval(createDuckInterval);
    clearInterval(createLargeDuckInterval);
    clearInterval(createSmallDuckInterval);
bgSound.muted=true
    // Stop all animations
    // animationsssIDS.forEach((id) => cancelAnimationFrame(id));

    pauseMenu.style.display = "block";
}

// Continue Function
function continueGame() {
    isPaused = false;
    bgSound.muted=false

    startTimer(); // Restart the timer
    createDuckInterval = setInterval(() => createDuck('duck', 'med'), 1500);
    createLargeDuckInterval = setInterval(() => createDuck('yes-bg-unscreen', 'large'), 5000);
    createSmallDuckInterval = setInterval(() => createDuck('small_duck', 'small'), 1000);

    pauseMenu.style.display = "none";
}

// Restart Function
function restartGame() {
    isPaused = false;
    bgSound.muted=false

    score = 0;
    timeLeft = 30;
    document.getElementById('myscore').innerHTML = score;
    document.getElementById('time-left').textContent = timeLeft;
    document.querySelectorAll("img").forEach((duck) => duck.remove()); // Remove all ducks
    pauseMenu.style.display = "none";
    document.getElementById('time-is-up').style.display = "none";
    document.getElementById('pausebtn').style.display = 'block';
// document.getElementById('pause').style.display = 'block'
    // Restart the game
    bgSound.play();
    startTimer();

    createDuckInterval = setInterval(() => createDuck('duck', 'med'), 1500);
    createLargeDuckInterval = setInterval(() => createDuck('yes-bg-unscreen', 'large'), 5000);
    createSmallDuckInterval = setInterval(() => createDuck('small_duck', 'small'), 1000);
}

// Event Listeners for Buttons
continueButton.addEventListener("click", continueGame);
restartButton.addEventListener("click", restartGame);
document.getElementById('restart-btn').addEventListener("click", restartGame);

// Bind the pause functionality to a key (e.g., "P")
pausebtn.addEventListener("click", (event) => {
    
        if (isPaused) {
            continueGame();
        } else {
            pauseGame();
        }
    
});


window.onclick = handleClick;

window.onmousedown = handleClickWOminus;
