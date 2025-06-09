let score = 0
let Highscore = 0
let isPaused = false;
var createDuckInterval ; 
var createLargeDuckInterval ;
var createSmallDuckInterval;
var timerInterval;
let timeLeft = 30;

// const startButton = document.getElementById('start-game');
const startEasy = document.getElementById('start-easy');
const startMed = document.getElementById('start-medm');
const startHard = document.getElementById('start-hard');

const bgSound = document.getElementById('bg-sound');
const pauseMenu = document.getElementById("pause-menu");
const continueButton = document.getElementById("continue-game");
const restartButton = document.getElementById("restart-game");
let pausebtn = document.getElementById('pausebtn')

document.getElementById("game-over").style.display = 'none'
document.getElementById("time-is-up").style.display = 'none'


function moveLeft(duck ,  speedx , speedy ) {
    let pos = parseFloat(duck.style.left) || 0
    let currentY = parseFloat(duck.style.top) || 0

    function repeat(){
        pos += speedx
        duck.style.left =  pos + "px"
        currentY += speedy // move downwords
        duck.style.top = currentY + "px"
    if (speedy>0){
        if (pos < window.innerWidth && currentY < window.innerHeight){
            requestAnimationFrame(repeat)
        }else { //AT THE START -250PX : The condition pos > window.innerWidth will not be true because a negative value is always smaller than the viewport width.
            duck.remove()
        }

    }else{
        if (pos < window.innerWidth && currentY > 0) {
            requestAnimationFrame(repeat);
        } else {
            duck.remove();
        }
    }
    }
    repeat()
}

function moveRight(duck ,  speedx ) {
    let pos = duck.style.right
    pos = parseFloat(pos) || 0
    function repeat(){
        pos += speedx
        duck.style.right =  pos + "px"
        
     if (pos < window.innerWidth){
         requestAnimationFrame(repeat)
        }
        if (pos > window.innerWidth) {
            duck.remove()
        }
    }

 repeat()
}

function startTimer() {
     timerInterval = setInterval(() => {
            timeLeft--;
            document.getElementById('time-left').textContent = timeLeft;
            
            if (timeLeft <= 0) {
                document.querySelectorAll("img").forEach((duck) => duck.remove()); // Remove all ducks
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
function easymode (){
    bgSound.play();
    document.body.style.backgroundImage = "url('./gifs/stage.png')"
    document.getElementById("welcomeDiv").remove()
    Highscore = 0
    
  moveLeft(document.getElementById("small"), 3 , 0)
  moveLeft(document.getElementById("med") , 5, 0)
  moveRight(document.getElementById("large") , 10)
  
  startTimer();
  
   createDuckInterval = setInterval(() => createDuck('duck', 'med'), 1500); // Create a new duck every 1.5 seconds
   createLargeDuckInterval = setInterval(() => createDuck('yes-bg-unscreen', 'large'), 5000); // Create a new large duck every 5 seconds
  createSmallDuckInterval = setInterval(() => createDuck('small_duck', 'small'), 800); // Create a new small duck every 1 second
  
}
startEasy.addEventListener('click', easymode);

function medmode(){
    document.body.style.backgroundImage = "url('./gifs/med-stage.png')"
    document.body.style.backgroundRepeat = "repeat-x"
  bgSound.play();
  document.getElementById("welcomeDiv").remove()

  Highscore = 0
moveLeft(document.getElementById("small"), 6 , -3)
moveLeft(document.getElementById("med") , 10, -2)
moveRight(document.getElementById("large") , 20)

startTimer();

 createDuckInterval = setInterval(() => createDuck('duck', 'med'), 1000); // Create a new duck every 1.5 seconds
 createLargeDuckInterval = setInterval(() => createDuck('yes-bg-unscreen', 'large'), 8000); // Create a new large duck every 5 seconds
createSmallDuckInterval = setInterval(() => createDuck('small_duck', 'small'), 500); // Create a new small duck every 1 second

}
startMed.addEventListener('click', medmode);

function hardmode(){
    bgSound.play();
    document.body.style.backgroundImage = "url('./gifs/hard-stage.png')"
    document.body.style.backgroundRepeat = "repeat-x"
   document.getElementById("welcomeDiv").remove()
   Highscore = 0
 moveLeft(document.getElementById("small"), 9 , -2)
 moveLeft(document.getElementById("med") , 15, -6)
 moveRight(document.getElementById("large") , 30)
 
 startTimer();
 
  createDuckInterval = setInterval(() => createDuck('duck', 'med'), 800); // Create a new duck every 1.5 seconds
  createLargeDuckInterval = setInterval(() => createDuck('yes-bg-unscreen', 'large'), 10000); // Create a new large duck every 5 seconds
 createSmallDuckInterval = setInterval(() => createDuck('small_duck', 'small'), 300); // Create a new small duck every 1 second
 
}


startHard.addEventListener('click', hardmode);

// startButton.addEventListener('click', () => {
//   bgSound.play();
//   document.getElementById("welcomeDiv").remove()
//   Highscore = 0
// moveLeft(document.getElementById("small"), 3 , 0)
// moveLeft(document.getElementById("med") , 5, 0)
// moveRight(document.getElementById("large") , 10)

// startTimer();

//  createDuckInterval = setInterval(() => createDuck('duck', 'med'), 1500); // Create a new duck every 1.5 seconds
//  createLargeDuckInterval = setInterval(() => createDuck('yes-bg-unscreen', 'large'), 5000); // Create a new large duck every 5 seconds
// createSmallDuckInterval = setInterval(() => createDuck('small_duck', 'small'), 800); // Create a new small duck every 1 second
// });

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
//   function getRandomNumberExclusive(min, max) {
//     return Math.random() * (max - min) + min;
//   }
  
function createDuck(image , idname) {
    const duck = document.createElement('img');
    duck.src = "gifs/" + image + '.gif';  // Path to your duck image
duck.id = idname
duck.style.position = 'absolute'; // Ensure the duck is positioned absolutely on the page

//const yPos = min + Math.random() * (max - min);
//    const yPos = 50 + Math.random() * (window.innerHeight - 35 -100); /*how can i  limit this to give everytime  a certain height between 35px & innerheight - 25px? */

const minY = 50; // Minimum vertical position from the top
const maxY = window.innerHeight - 100; // Maximum vertical position (100px above the bottom)
const yPos = getRandomNumber(minY , maxY)
console.log(getRandomNumber(5, 10)); 

if (idname === 'large'){
        duck.style.right  = "-250px"
    }else{
    duck.style.left = "-200px";}
  
    duck.style.top = yPos+'px';

    // Randomize movement direction
    // let dx = Math.random() > 0.5 ? 1 : -1; 
    // let dy = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 0.5 + 1); 

    /*
Great question! In this context, dx and dy are not angles but directional speeds (or velocity components) that determine how the "duck" moves horizontally (dx) and vertically (dy). Let's break it down:

What dx and dy Represent
dx (Horizontal Speed):

Represents the movement along the horizontal axis (left-right movement).
Positive dx: Moves the duck to the right.
Negative dx: Moves the duck to the left.
The value of dx determines how fast the duck moves horizontally.
dy (Vertical Speed):

Represents the movement along the vertical axis (up-down movement).
Positive dy: Moves the duck downward.
Negative dy: Moves the duck upward.
The value of dy determines how fast the duck moves vertically. 

The ratio of dy/dx determines the slope (steepness) of 
the duck's movement path. A larger dy means more vertical
 movement compared to horizontal.
*/

const isUpperHalf = yPos < (window.innerHeight / 2); // is in the upper half
let dx = getRandomNumber(3,10)
let dy = getRandomNumber(1,5)


  if (idname === 'large'){
    moveRight(duck , dx*2)
  }else{
    //   moveLeft(duck , dx*3 , dy*2)
    if (!isUpperHalf) {
        dy = dy *-1
    }
    moveLeft(duck, dx, dy);
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
   // console.log(wiwi.target.nodeName )
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


function pauseGame() {
    isPaused = true;
    document.querySelectorAll("img").forEach((duck) => duck.remove()); // Remove all ducks
    clearInterval(timerInterval);
    clearInterval(createDuckInterval);
    clearInterval(createLargeDuckInterval);
    clearInterval(createSmallDuckInterval);
bgSound.muted=true
    // Stop all animations
    // animationsssIDS.forEach((id) => cancelAnimationFrame(id));

    pauseMenu.style.display = "block";
}


function continueGame() {
    isPaused = false;
    bgSound.muted=false

    startTimer(); // Restart the timer
    createDuckInterval = setInterval(() => createDuck('duck', 'med'), 1500);
    createLargeDuckInterval = setInterval(() => createDuck('yes-bg-unscreen', 'large'), 5000);
    createSmallDuckInterval = setInterval(() => createDuck('small_duck', 'small'), 1000);

    pauseMenu.style.display = "none";
}


function restartGame() {
    isPaused = false;
    bgSound.muted=false

    score = 0;
    timeLeft = 30;
    // document.body.style.backgroundImage = bg
    document.getElementById('myscore').innerHTML = score;
    document.getElementById('time-left').textContent = timeLeft;
    document.querySelectorAll("img").forEach((duck) => duck.remove()); // Remove all ducks
    pauseMenu.style.display = "none";
    document.getElementById('time-is-up').style.display = "none";
    document.getElementById('pausebtn').style.display = 'block';
// document.getElementById('pause').style.display = 'block'
    // Restart the game
 //   bgSound.play();
    startTimer();

    createDuckInterval = setInterval(() => createDuck('duck', 'med'), 1500);
    createLargeDuckInterval = setInterval(() => createDuck('yes-bg-unscreen', 'large'), 5000);
    createSmallDuckInterval = setInterval(() => createDuck('small_duck', 'small'), 1000);
}
function restartGameEasy() {
    isPaused = false;
    bgSound.muted=false

    score = 0;
    timeLeft = 30;
        document.body.style.backgroundImage = "url('./gifs/stage.png')"
    // document.body.style.backgroundImage = bg
    document.getElementById('myscore').innerHTML = score;
    document.getElementById('time-left').textContent = timeLeft;
    document.querySelectorAll("img").forEach((duck) => duck.remove()); // Remove all ducks
    pauseMenu.style.display = "none";
    document.getElementById('time-is-up').style.display = "none";
    document.getElementById('pausebtn').style.display = 'block';
// document.getElementById('pause').style.display = 'block'
    // Restart the game
 //   bgSound.play();
    startTimer();

    createDuckInterval = setInterval(() => createDuck('duck', 'med'), 1500);
    createLargeDuckInterval = setInterval(() => createDuck('yes-bg-unscreen', 'large'), 5000);
    createSmallDuckInterval = setInterval(() => createDuck('small_duck', 'small'), 1000);
}
function restartGameMedium() {
    isPaused = false;
    bgSound.muted=false

    score = 0;
    timeLeft = 30;
    // document.body.style.backgroundImage = bg
        document.body.style.backgroundImage = "url('./gifs/med-stage.png')"
    document.getElementById('myscore').innerHTML = score;
    document.getElementById('time-left').textContent = timeLeft;
    document.querySelectorAll("img").forEach((duck) => duck.remove()); // Remove all ducks
    pauseMenu.style.display = "none";
    document.getElementById('time-is-up').style.display = "none";
    document.getElementById('pausebtn').style.display = 'block';
// document.getElementById('pause').style.display = 'block'
    // Restart the game
 //   bgSound.play();
    startTimer();
 createDuckInterval = setInterval(() => createDuck('duck', 'med'), 1000); // Create a new duck every 1.5 seconds
 createLargeDuckInterval = setInterval(() => createDuck('yes-bg-unscreen', 'large'), 8000); // Create a new large duck every 5 seconds
createSmallDuckInterval = setInterval(() => createDuck('small_duck', 'small'), 500); // Create a new small duck every 1 second
}
function restartGameHard() {
    isPaused = false;
    bgSound.muted=false

    score = 0;
    timeLeft = 30;
    // document.body.style.backgroundImage = bg
        document.body.style.backgroundImage = "url('./gifs/hard-stage.png')"
    document.getElementById('myscore').innerHTML = score;
    document.getElementById('time-left').textContent = timeLeft;
    document.querySelectorAll("img").forEach((duck) => duck.remove()); // Remove all ducks
    pauseMenu.style.display = "none";
    document.getElementById('time-is-up').style.display = "none";
    document.getElementById('pausebtn').style.display = 'block';
// document.getElementById('pause').style.display = 'block'
    // Restart the game
 //   bgSound.play();
    startTimer();

    createDuckInterval = setInterval(() => createDuck('duck', 'med'), 800); // Create a new duck every 1.5 seconds
    createLargeDuckInterval = setInterval(() => createDuck('yes-bg-unscreen', 'large'), 10000); // Create a new large duck every 5 seconds
   createSmallDuckInterval = setInterval(() => createDuck('small_duck', 'small'), 300); // Create a new small duck every 1 second
   
 }

// Event Listeners for Buttons
continueButton.addEventListener("click", continueGame);
restartButton.addEventListener("click", restartGame);
document.getElementById('restart-easy').addEventListener("click", restartGameEasy );
document.getElementById('restart-medm').addEventListener("click", restartGameMedium );
document.getElementById('restart-hard').addEventListener("click", restartGameHard );
document.getElementById('restart-btn').addEventListener("click", restartGame );

pausebtn.addEventListener("click", (event) => {
    
        if (isPaused) {
            continueGame();
        } else {
            pauseGame();
        }
    
});

window.onclick = handleClick;
window.onmousedown = handleClickWOminus;
