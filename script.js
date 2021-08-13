const canvas = document.getElementById('canvas');
const WIDTH = 400,
    HEIGHT = 400;
canvas.width = WIDTH;
canvas.height = HEIGHT;
canvas.style.background = '#66b3ff';
const context = canvas.getContext('2d');
var winner;
var playerName;
var keydowns = {};
var player = new Player();
var computer = new Computer();
var ball = new Ball(WIDTH / 2 + 10, HEIGHT / 2);
var popup = document.getElementById("popup")
var modal = document.getElementById("modal")
var gameLevel = 1 
// var ball2 = new Ball(WIDTH / 2 + 10, HEIGHT / 4);

document.addEventListener('keydown', function (event) {
    keydowns[event.keyCode] = true;
});
document.addEventListener('keyup', function (event) {
    delete keydowns[event.keyCode];
});

var render = function () {
    context.clearRect(0, 0, WIDTH, HEIGHT);
    player.render();
    computer.render();
    ball.render();
    // ball2.render();
}

var update = function () {
    console.log(" update call ")
    player.update();
    computer.update(ball);
    ball.update(player.paddle, computer.paddle);
    // ball2.update(player.paddle, computer.paddle) 
};

function Paddle(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.xSpeed = 0;
    this.ySpeed = 0;
}

Paddle.prototype.render = function () {
    context.beginPath();
    context.fillStyle = "#ff5050";
    context.fillRect(this.x, this.y, this.width, this.height);
    context.closePath();
};

Paddle.prototype.move = function (x, y) {
    this.x += x;
    this.y = y;
    this.xSpeed = x;
    this.ySpeed = y;
    if (this.x < 0) {
        // console.log(" left side ", x)
        this.x = 0;
        this.xSpeed = 10;
    } else if (this.x + this.width > WIDTH) {
        // console.log(" eight side " , WIDTH , this.x , this.width)
        this.x = WIDTH - this.width;
        this.xSpeed = 10;
    }
};

function Player() {
    this.paddle = new Paddle(WIDTH / 2, HEIGHT - 15, 70, 15);
}

function Computer() {
    this.paddle = new Paddle(WIDTH / 2, 0, 70, 15);
}

Player.prototype.render = function () {
    this.paddle.render();
};
Player.prototype.update = function () {
    for (var key in keydowns) {
        if (key == 37) {
            this.paddle.move(-4, HEIGHT - 15);
        } else if (key == 39) {
            this.paddle.move(4, HEIGHT - 15);
        } else {
            this.paddle.move(0, HEIGHT - 15);
        }
    }
};

Computer.prototype.render = function () {
    this.paddle.render();
};
Computer.prototype.update = function (ball) {
    var diff = -((this.paddle.x + (this.paddle.width / 2) - ball.x));
    if (diff < 0 && diff < -4) {
        diff = -5;
    } else if (diff > 0 && diff > 4) {
        diff = 5;
    }
    this.paddle.move(diff, 0);
    if (this.paddle.x < 0) {
        this.paddle = 0;
    } else if (this.x + this.width > WIDTH) {
        this.x = WIDTH - this.width;
    }
};

function Ball(x, y) {
    this.x = x;
    this.y = y;
    this.xSpeed = 0;
    this.ySpeed = 1;
    this.radius = 5;
}
Ball.prototype.render = function () {
    context.beginPath();
    context.fillStyle = "#333300";
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    context.fill();
    context.closePath();
};
Ball.prototype.update = function (player_paddle, computer_paddle) {

    this.x += this.xSpeed;
    this.y += this.ySpeed;
    if (this.x - this.radius < 0) { //hitting the left wall
        this.x = 5;
        this.xSpeed = -this.xSpeed;
    } else if (this.x + this.radius > WIDTH) { //hitting the right wall
        this.x = WIDTH - this.radius;
        this.xSpeed = -this.xSpeed;
    }
    if (this.y - this.radius < 0 || this.y + this.radius > HEIGHT) { //point is scored by either computer or player
       // if(parseInt(document.getElementById("computer").innerHTML) <-3  || parseInt(document.getElementById("human").innerHTML) <-3 ){
            if (this.y < 0) {
                console.log('Player wins !');
                document.getElementById("computer").innerHTML = parseInt(document.getElementById("computer").innerHTML) - 1
                pauseGame()   
            } else if (this.y + this.radius > HEIGHT) {
                console.log('Computer wins !');
                document.getElementById("human").innerHTML = parseInt(document.getElementById("human").innerHTML) - 1
                pauseGame()   
            }
            this.xSpeed = 0;
            this.ySpeed = 3;
            this.x = WIDTH / 2;
            this.y = HEIGHT / 2;
        // }else{
        //     pauseGame()           
        // }
        
    }

    if (this.y > WIDTH / 2) {
        if ((this.y - this.radius) < (player_paddle.y + player_paddle.height) && (this.y + this.radius) > player_paddle.y && (this.x - this.radius) < (player_paddle.x + player_paddle.width) && (this.x + this.radius) > player_paddle.x) {
            addSound("hit");
            console.log(" hitting player paddle ")
            document.getElementById("human").innerHTML = parseInt(document.getElementById("human").innerHTML) + 1
            this.ySpeed = -this.ySpeed;
            this.xSpeed += (player_paddle.xSpeed / 2);
            this.y += this.ySpeed;
        }
    } else {
        if ((this.y - this.radius) < (computer_paddle.y + computer_paddle.height) && (this.y + this.radius) > computer_paddle.y && (this.x - this.radius) < (computer_paddle.x + computer_paddle.width) && (this.x + this.radius) > computer_paddle.x) {
            addSound("hit");
            console.log(" hitting computer paddle ")
            document.getElementById("computer").innerHTML = parseInt(document.getElementById("computer").innerHTML) + 1
            this.ySpeed = -this.ySpeed;
            this.x += (computer_paddle.xSpeed / 2);
            this.y += this.ySpeed;
        }
    }

    if (parseInt(document.getElementById("computer").innerHTML) == 500 || parseInt(document.getElementById("human").innerHTML) == 500) {
        parseInt(document.getElementById("computer").innerHTML) == 500 ? winner = "computer" : winner = playerName
        gameLevel = gameLevel+1
        pauseGame()
    }
};

function addSound(audioType) {
    var audio
    switch (audioType) {
        case "hit":
            audio = new Audio('sound/hitSound.mp3');
            break;
        case "win":
            audio = new Audio('sound/winningSound.mp3');
            break;
        case "lose":
            console.log(" lose inside")
            audio = new Audio('sound/loseSound.wav');
            break;
        default:
            break;
    }

    audio.play();
}

var animation = 1
function drawGame() {
    render();
    update();
    if (animation > 0) {
        animation = requestAnimationFrame(drawGame);
    }
}
function pauseGame() {
    if (winner != document.getElementById("userName").innerHTML) {
        addSound("lose");
    } else {
        addSound("win");
    }
    popup.classList.add("show");
    modal.innerHTML = `
            <div class="modal-header">
                <h5 class="modal-title">Score Board</h5>
            </div>
            <div class="modal-body" style="height: 350px;">
                <div class="row">
                    <div class="col-sm-7">
                    ${winner == document.getElementById("userName").innerHTML ?
            `<i class="fa fa-trophy fa-5x win" aria-hidden="true"></i>` :
            `<i class="fa fa-thumbs-down fa-5x win"></i>`
        }
                    </div>
                    <div class="col-sm-5">
                    ${winner != document.getElementById("userName").innerHTML ? (
            `
                        <span class="msg"> You lose the match. </span>
                        <span> Better luck then next time. Your Score is  ${parseInt(document.getElementById("human").innerHTML)} and high score is
                        ${parseInt(document.getElementById("computer").innerHTML)}
                        </span>                         
                        `
        ) :
            (
                `<span class="msg"> Congratulation !!! </span>
                    <span> Winner is ${winner}.</span>`
            )
        }
                      
                    </div>
                </div>
            </div>
            <div class="modal-footer">
            ${winner != document.getElementById("userName").innerHTML ? 
                `<button type="button" class="btn btn-danger">Try Again</button>` :
                `<button type="button" class="btn btn-success">Next Level</button>`
            }
            </div>
       `
    window.cancelAnimationFrame(animation);
    animation = undefined;
}

window.onload = function () {
    popup.classList.add("show");
    modal.innerHTML = `<div class="modal-header">
                <h5 class="modal-title">Enter Your Name</h5>
            </div>
            <div class="modal-body" style="height: 350px;">
                <input type="text" id="playerName" class="form-control" />
                <span id="errorMsg"> </span>
            <br><br>
               <h4>  Rules </h4>  <ul> <li>  Hit Ball and get point +1. </li> <li> Miss Ball lose point -1. </li>

            </div>
            <div class="modal-footer">
            <button type="button" class="btn btn-danger" onclick="nextBtn()">Next</button>
            </div>
    `
};

function nextBtn() {
    if (document.getElementById("playerName").value.length > 0) {
        console.log(" document.getElement.value", document.getElementById("playerName").value, " : ", document.getElementById("playerName").value.length)
        popup.classList.remove("show");
        playerName = document.getElementById("playerName").value;
        document.getElementById("userName").innerHTML = document.getElementById("playerName").value
        drawGame();
    } else {
        document.getElementById("errorMsg").innerHTML = "Please Enter Your Name Before Proceed Ahead."
    }
}