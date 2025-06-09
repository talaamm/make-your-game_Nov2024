let score = 0
// let Highscore = 0
let isPaused = false;
var createDuckInterval ; 
var createLargeDuckInterval ;
var createSmallDuckInterval;
var timerInterval;
let timeLeft = 30;
let scores;

const startButton = document.getElementById('start-game');
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
     timerInterval = setInterval(async() => {
            timeLeft--;
            document.getElementById('time-left').textContent = timeLeft;
////////////////////////////GAME ENDED INDICATION/////////////////////
            if (timeLeft <= 0) {
            document.querySelectorAll("img").forEach((duck) => duck.remove()); // Remove all ducks
            let resp = await fetch("/ask", {
                method: "GET",
                headers: {
                   'Content-Type': 'application/json',
               },
               })
                let ans = await resp.json()
               console.log(ans)

               if(ans.length === 0){
                   console.log('no cookie was found... or name is empty')
                   
                   document.getElementById('your-name').style.display = 'block'
                   document.getElementById("time-is-up").style.display = 'none'
                   document.getElementById('nameform').addEventListener('click' , async()=>{
                     
                  let uname=  document.getElementById('usersname').value 
                  localStorage.setItem("username", uname)
                  
                //   document.getElementById('your-name').style.display = 'none'
                let now = await fetch('sendData', {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json', // Inform the server you're sending JSON
                    },
                    body: JSON.stringify({
                        'name': localStorage.getItem('username'),
                        'score': score ,
                    }), })

                    if( !now.ok){
                    console.error('error occured')
                    return
                    }

                    let scoresResp = await fetch('getmescores', {  method: "GET"} )
                     scores = await scoresResp.json()
                    
                    
                     let RANK;
for (let i = 0; i < scores.length; i++) {
    let gamer = scores[i];
    
    if (gamer.name === localStorage.getItem('username')) {
        RANK = i+1;
        break;  // Exit the loop once the user is found
    }
}

                let percentile = (RANK / scores.length) * 100
                
                document.getElementById('currPerc').textContent = Number(percentile) + '%, on Rank ' + RANK


                    renderTable(currentPage, scores);
                    document.getElementById('your-name').style.display = 'none'
                    document.getElementById("time-is-up").style.display = 'block'
                    document.getElementById("finalscore").textContent = score                  
                })
            }else{
                document.getElementById('your-name').style.display = 'none'
                    localStorage.setItem("username", ans.name)
                    let now = await fetch('sendData', {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json', // Inform the server you're sending JSON
                        },
                        body: JSON.stringify({
                            'name': localStorage.getItem('username'),
                            'score': score ,
                        }), })
    
                        if( !now.ok){
                        console.error('error occured')
                        return
                        }
    
                        let scoresResp = await fetch('getmescores', {  method: "GET"} )
                         scores = await scoresResp.json()
    
                         let RANK;
for (let i = 0; i < scores.length; i++) {
    let gamer = scores[i];
    
    if (gamer.name === localStorage.getItem('username')) {
        RANK = i+1;
        break;  // Exit the loop once the user is found
    }
}

                let percentile = (RANK / scores.length) * 100
                
                document.getElementById('currPerc').textContent = Number(percentile) + '%, on Rank ' + RANK

    
                        renderTable(currentPage, scores);
                    document.getElementById("time-is-up").style.display = 'block'
                    document.getElementById("finalscore").textContent = score
                }

            // if (score> Highscore){
            //     Highscore = score
            // }
            // document.getElementById('highscore').textContent = Highscore
            document.querySelectorAll("img").forEach((duck) => duck.remove()); // Remove all ducks
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
//   Highscore = 0
document.getElementById('time-is-up').style.display = 'none'
moveLeft(document.getElementById("small"), 3 , 0)
moveLeft(document.getElementById("med") , 5, 0)
moveRight(document.getElementById("large") , 10)

startTimer();

 createDuckInterval = setInterval(() => createDuck('duck', 'med'), 1500); // Create a new duck every 1.5 seconds
 createLargeDuckInterval = setInterval(() => createDuck('yes-bg-unscreen', 'large'), 5000); // Create a new large duck every 5 seconds
createSmallDuckInterval = setInterval(() => createDuck('small_duck', 'small'), 800); // Create a new small duck every 1 second
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

pausebtn.addEventListener("click", (event) => {
    
        if (isPaused) {
            continueGame();
        } else {
            pauseGame();
        }
    
});

window.onclick = handleClick;
window.onmousedown = handleClickWOminus;




























































let currentPage = 1;
const rowsPerPage = 5;

function renderTable(page , scores) {
    const tableBody = document.querySelector("#scoreboard tbody");
    tableBody.innerHTML = ""; // Clear the table

    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const pageData = scores.slice(start, end);

    pageData.forEach((row) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${row.rank}</td>
            <td>${row.name}</td>
            <td>${row.score}</td>
            <td>${row.time}</td>
        `;
        tableBody.appendChild(tr);
    });

    // Update pagination
    document.getElementById("prevPage").disabled = page === 1;
    document.getElementById("nextPage").disabled = end >= scores.length;
    document.getElementById("pageInfo").textContent = `Page ${page}`;


    
    document.getElementById("prevPage").addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            renderTable(currentPage , scores);
        }
    });
    
    document.getElementById("nextPage").addEventListener("click", () => {
        if (currentPage * rowsPerPage < scores.length) {
            currentPage++;
            renderTable(currentPage, scores);
        }
    });



}
