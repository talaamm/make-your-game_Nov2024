let score = 0
let isPaused = false;
var createDuckInterval ; 
var createLargeDuckInterval ;
var createSmallDuckInterval;
var timerInterval;
let timeLeft = 30;
let currentLevel = 1
////////////////////push new/////////////////////////
const startButton = document.getElementById('start-game');
const bgSound = document.getElementById('bg-sound');
const pauseMenu = document.getElementById("pause-menu");
const continueButton = document.getElementById("continue-game");
const restartButton = document.getElementById("restart-game");
let pausebtn = document.getElementById('pausebtn')
let level2btn = document.getElementById('next-level')


document.getElementById("game-over").style.display = 'none'
document.getElementById('loss').style.display = "none";
document.getElementById('success').style.display = "none";
document.getElementById('success2').style.display = "none";
document.getElementById('mid-video').style.display = "none";
document.getElementById('final-video').style.display = "none";


document.addEventListener("DOMContentLoaded", () => {
    const video = document.getElementById("intro-video");
    const gameContainer = document.getElementById("welcomeDiv");
    gameContainer.style.display = "none";

    video.addEventListener("ended", () => {
      video.style.display = "none";
      gameContainer.style.display = "block";
    });
  });
  
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
               if( (score >=50 && currentLevel==1)){
                   document.getElementById("success").style.display = 'block'
                   document.getElementById("loss").style.display = 'none'
                   document.getElementById("finalscore-suc").textContent = score
                }else if ( (score <50 && currentLevel==1) || (score < 100 && currentLevel==2 ) || (score < 180 && currentLevel==3)){
                    
                    document.getElementById("success").style.display = 'none'
                    document.getElementById("loss").style.display = 'block'
                    document.getElementById("finalscore-loss").textContent = score
                    if (currentLevel==1){
                        document.getElementById("loss-statement").innerText = "OOPS, YOU NEED A SCORE ABOVE 50"
                    }else if (currentLevel == 2){
                        document.getElementById("loss-statement").innerText = "OOPS, YOU NEED A SCORE ABOVE 100"
                        
                    }else{
                        document.getElementById("loss-statement").innerText = "OOPS, YOU NEED A SCORE ABOVE 180"

                    }

               }else if ((score >= 100 && currentLevel==2 )){
                document.getElementById('final-video').style.display = "block"
                document.getElementById('final-video').addEventListener("ended", () => {
                    document.getElementById('final-video').style.display = "none";
                    bgSound.muted=true
                    document.getElementById("success2").style.display = 'block'
                    document.getElementById("loss").style.display = 'none'
                    document.getElementById("finalscore-suc2").textContent = score
                });

               }

            clearInterval(timerInterval);
            clearInterval(createDuckInterval);
            clearInterval(createLargeDuckInterval);
            clearInterval(createSmallDuckInterval);
            return
            }
 
    }, 1000); //1000ms --> 1 sec
}

document.getElementById("rest-allGame").addEventListener('click' , () =>{
    currentLevel = 1
document.getElementById("success2").style.display = 'none'
     document.getElementById("intro-video").style.display = "block"
     bgSound.muted=true

    video.addEventListener("ended", () => {
      video.style.display = "none";
     restartGame()
    });
    
})

startButton.addEventListener('click', () => {
  bgSound.play();
  document.getElementById("welcomeDiv").remove()
moveLeft(document.getElementById("small"), 3 , 0)
moveLeft(document.getElementById("med") , 5, 0)
moveRight(document.getElementById("large") , 10)

startTimer();

 createDuckInterval = setInterval(() => createDuck('duck', 'med'), 1500); // Create a new duck every 1.5 seconds
 createLargeDuckInterval = setInterval(() => createDuck('yes-bg-unscreen', 'large'), 5000); // Create a new large duck every 5 seconds
createSmallDuckInterval = setInterval(() => createDuck('small_duck', 'small'), 1000); // Create a new small duck every 1 second
});

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
function createDuck(image , idname) {
    const duck = document.createElement('img');
    duck.src = "gifs/" + image + '.gif';  // Path to your duck image
duck.id = idname
duck.style.position = 'absolute'; // Ensure the duck is positioned absolutely on the page

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
    if (!isUpperHalf) {
        dy = dy *-1
    }
    moveLeft(duck, dx, dy);
  }

    document.body.appendChild(duck);
}


 function handleClick(wiwi){
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
    pauseMenu.style.display = "block";
}


function continueGame() {
    isPaused = false;
    bgSound.muted=false

    startTimer(); // Restart the timer
    if (currentLevel==1){

        createDuckInterval = setInterval(() => createDuck('duck', 'med'), 1500);
        createLargeDuckInterval = setInterval(() => createDuck('yes-bg-unscreen', 'large'), 5000);
        createSmallDuckInterval = setInterval(() => createDuck('small_duck', 'small'), 1000);
    }else if (currentLevel==2){
        createDuckInterval = setInterval(() => createDuck('duck', 'med'), 1000);
        createLargeDuckInterval = setInterval(() => createDuck('yes-bg-unscreen', 'large'), 6000);
        createSmallDuckInterval = setInterval(() => createDuck('small_duck', 'small'), 500);
        
    }else{
        createDuckInterval = setInterval(() => createDuck('duck', 'med'), 1100);
        createLargeDuckInterval = setInterval(() => createDuck('yes-bg-unscreen', 'large'), 7000);
        createSmallDuckInterval = setInterval(() => createDuck('small_duck', 'small'), 800);
        
    }

    pauseMenu.style.display = "none";
}


function restartGame() {
    isPaused = false;
    bgSound.muted=false

    score = 0;
    timeLeft = 30;
    document.getElementById('myscore').innerHTML = score;
    document.getElementById('time-left').textContent = timeLeft;
    document.querySelectorAll("img").forEach((duck) => duck.remove()); // Remove all ducks
    pauseMenu.style.display = "none";
    document.getElementById('loss').style.display = "none";
    document.getElementById('success').style.display = "none";
    document.getElementById('pausebtn').style.display = 'block';
    bgSound.play();
    startTimer();
    if (currentLevel==1){

        createDuckInterval = setInterval(() => createDuck('duck', 'med'), 1500);
        createLargeDuckInterval = setInterval(() => createDuck('yes-bg-unscreen', 'large'), 5000);
        createSmallDuckInterval = setInterval(() => createDuck('small_duck', 'small'), 1000);
    }else if (currentLevel==2){
        createDuckInterval = setInterval(() => createDuck('duck', 'med'), 1000);
        createLargeDuckInterval = setInterval(() => createDuck('yes-bg-unscreen', 'large'), 6000);
        createSmallDuckInterval = setInterval(() => createDuck('small_duck', 'small'), 500);
        
    }else{
        createDuckInterval = setInterval(() => createDuck('duck', 'med'), 1100);
        createLargeDuckInterval = setInterval(() => createDuck('yes-bg-unscreen', 'large'), 7000);
        createSmallDuckInterval = setInterval(() => createDuck('small_duck', 'small'), 800);
        
    }}

continueButton.addEventListener("click", continueGame);
restartButton.addEventListener("click", restartGame);
document.getElementById('restart-btn').addEventListener("click", restartGame);

pausebtn.addEventListener("click", (event) => {
        if (isPaused) {
            continueGame();
        } else {
            pauseGame();
        }
});

level2btn.addEventListener("click",() => {
    bgSound.muted=true

document.getElementById('mid-video').style.display = "block";
document.getElementById('success').style.display = "none";
document.getElementById('mid-video').addEventListener("ended", () => {
    document.getElementById('mid-video').style.display = "none";
    bgSound.play();
    // document.getElementById("welcomeDiv").remove()
    document.getElementById("success").style.display = 'none'
  currentLevel++
restartGame()
});
})

window.onclick = handleClick;
window.onmousedown = handleClickWOminus;
