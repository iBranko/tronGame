var ctx;
var gameloopId;
var gameRunning = false;
var screenX;
var screenY;
var color1 = "#4ddaff";
var color2 = "#f2cc0f";
var width;
var height;

var mainLoopDelay = 1;

var Moto = function(startPoint, lineColor, orientation){
    this.path = [{x:startPoint.x, y:startPoint.y}];
    this.orientation = orientation;
    this.actualPoint = startPoint;
    this.speed = 0.4;
    this.lineWidth = 4;
    this.lineColor = lineColor;
};

Moto.prototype.moveHorizontal = function(path){
    return !(this.orientation % 2);
};
var moto1;
var moto2;

function init() {

    width = document.getElementById("canvas").offsetWidth;
    height = document.getElementById("canvas").offsetHeight;

    //just a debug array of points
    moto1 = new Moto({x:50, y:height/2}, color1, 1);
    
    moto2 = new Moto({x:width-50, y:height/2}, color2, 3);
    //add event handler for clicking on start/stop button and toggle the game play
    var td = document.getElementById('startStop');
    td.setAttribute('onclick', 'toggleGameplay()');
    document.onkeydown = handleKey;
    
    var canvas = document.getElementById("canvas");
    ctx = canvas.getContext('2d');
    screenX = canvas.height;
    screenY = canvas.width;
}

//https://developer.mozilla.org/en/Drawing_Graphics_with_Canvas#Using_Paths
function drawPath(player, playerType) {
    ctx.beginPath();
    
    for (var i = 0; i < player.path.length; i++) {
        ctx.lineTo(player.path[i].x, player.path[i].y);
    }
    //add the actual point for the player
    ctx.lineTo(player.actualPoint.x, player.actualPoint.y);
    //bigger line
    ctx.lineWidth = player.lineWidth;

    //blur line
    switch(playerType) {
        case 1:ctx.shadowColor = color1; ctx.shadowBlur = 10; break;
        case 2:ctx.shadowColor = color2; ctx.shadowBlur = 10; break;
    }
        
    //round ending for the line
    ctx.lineCap = "round";
    ctx.strokeStyle = player.lineColor;
    
    ctx.stroke();
}

function updateOrientation(player, newOrientation) {
    if (((player.orientation + newOrientation) % 2) != 0) {
        player.orientation = newOrientation;
        player.path.push({x: player.actualPoint.x, y: player.actualPoint.y});
    }
}

function moveMoto(player) {
    switch (player.orientation) {
        case 0:player.actualPoint.y = player.actualPoint.y - player.speed; break;
        case 1:player.actualPoint.x = player.actualPoint.x + player.speed; break;
        case 2:player.actualPoint.y = player.actualPoint.y + player.speed; break;
        case 3:player.actualPoint.x = player.actualPoint.x - player.speed; break;
    }
}

function dectectCollision(player) {
    switch (player.orientation) {
        case 0: return (player.actualPoint.y) < 0;
        case 1: return (player.actualPoint.x) > screenX;
        case 2: return (player.actualPoint.y) > screenY;
        case 3: return (player.actualPoint.x) < 0;
    }
}   
function sgn(int) {
    if (int >= 0) return 1;
    else return 0;
}
function detectCollisionWithPlayer(player, playerWall) {
    var path = playerWall.path.concat(playerWall.actualPoint)

    for (var i = 1; i < path.length; i++) {
        // if (path[i - 1].x == path[i].x) {
            //horizontal wall 
            if (player.orientation == 1) {
                //go right
                if ((player.actualPoint.x + 1) < path[i].x) {
                    if ((player.actualPoint.x + 1 + player.speed) > path[i].x) {
                        if (sgn(player.actualPoint.y - path[i].y) != sgn(player.actualPoint.y - path[i - 1].y))
                        //check the bound of the point
                            return true;
                    }
                }
            } else if (player.orientation == 3) {
                //go left
                if ((player.actualPoint.x - 1) > path[i].x) {
                    if ((player.actualPoint.x - 1 - player.speed) < path[i].x) {
                        if (sgn(player.actualPoint.y - path[i].y) != sgn(player.actualPoint.y - path[i - 1].y))
                            return true;
                    }
                }
            }
        // } else {
            if (player.orientation == 0) {
                //go up
                if ((player.actualPoint.y - 1) > path[i].y) {
                    if ((player.actualPoint.y - 1 - player.speed) < path[i].y) {
                        if (sgn(player.actualPoint.x - path[i].x) != sgn(player.actualPoint.x - path[i - 1].x))
                            return true;
                    }
                }
            } else if (player.orientation == 2) {
                //go down
                    if ((player.actualPoint.y + 1 + player.speed) > path[i].y) {
                if ((player.actualPoint.y + 1) < path[i].y) {
                        if (sgn(player.actualPoint.x - path[i].x) != sgn(player.actualPoint.x - path[i - 1].x))
                            return true;
                    }
                }
            }
        // }
    }
}
function detectFrontalCollision(player, playerWall) {

    if (player.orientation == 1) {//right
        if (player.actualPoint.x < playerWall.actualPoint.x && player.actualPoint.y == playerWall.actualPoint.y)
            if ((player.actualPoint.x + player.speed) > playerWall.actualPoint.x)
                return true;
    } 
    else if (player.orientation == 3) {//left
         if (player.actualPoint.x > playerWall.actualPoint.x && player.actualPoint.y == playerWall.actualPoint.y)
            if ((player.actualPoint.x - player.speed) < playerWall.actualPoint.x)
                return true;
    }
     else if (player.orientation == 0) {//up
         if (player.actualPoint.y > playerWall.actualPoint.y && player.actualPoint.x == playerWall.actualPoint.x)
            if ((player.actualPoint.y - player.speed) < playerWall.actualPoint.x)
                return true;
    }
    else{//down
        if (player.actualPoint.y < playerWall.actualPoint.y && player.actualPoint.x == playerWall.actualPoint.x)
            if ((player.actualPoint.y + player.speed) > playerWall.actualPoint.x)
                return true;
    }

}

function mainLoop() {

    //clear screen
    ctx.clearRect(0, 0, screenX, screenY);
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, screenX, screenY);
    //redraw the thingy
    drawPath(moto1, 1);
    drawPath(moto2, 2)

    if (detectCollisionWithPlayer(moto1, moto1) || detectCollisionWithPlayer(moto1, moto2)) {
        alert("Player 1 just lost against a trace")
        clearInterval(gameloopId);

    }
    if (dectectCollision(moto1)) {
        alert("Player 1 just lost against a wall");
        clearInterval(gameloopId);
    }
    if (detectCollisionWithPlayer(moto2, moto2) || detectCollisionWithPlayer(moto2, moto1)) {
        alert("Player 2 just lost against a trace")
        clearInterval(gameloopId);
    }
    if (dectectCollision(moto2)) {
        alert("Player 2 just lost against a wall");
        clearInterval(gameloopId);
    }
    if (detectFrontalCollision(moto1, moto2)) {
        alert("Frontal collision!");
        clearInterval(gameloopId);
    }
    moveMoto(moto1);
    moveMoto(moto2)
}

//Start/stop the game loop (and more importantly that annoying boinging!)
function toggleGameplay()
{
    gameRunning = !gameRunning;
    if(gameRunning) {
        init();
        clearInterval(gameloopId);
        gameloopId = setInterval(mainLoop, mainLoopDelay);
    } else {
        clearInterval(gameloopId);
        //clear canvas
        ctx.clearRect(0, 0, screenX, screenY);
        ctx.save();
    }
}
