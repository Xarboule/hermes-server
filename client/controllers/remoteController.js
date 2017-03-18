/**
 * Created by xarboule on 23/02/17.
 */




var isPressedfbutton = false;
var isPressedbbutton = false;
var isPressedlbutton = false;
var isPressedrbutton = false;



function keyDown(event) {
    event.stopPropagation();

    if (event.keyCode === 38 && !isPressedfbutton){
        isPressedfbutton = true;
        clearInterval(keepAlive);
        keepAlive = setInterval(moveForward, keepaliveTime);
        moveForward();
    } // avant

    else if (event.keyCode === 40 && !isPressedbbutton){
        isPressedbbutton = true;
        clearInterval(keepAlive);
        keepAlive = setInterval(moveBackward, keepaliveTime);
        moveBackward();
    } //arriere

    else if (event.keyCode === 37 && !isPressedlbutton) {
        isPressedlbutton = true;
        turnLeft();
    } //gauche

    else if (event.keyCode === 39 && !isPressedrbutton) {
        isPressedrbutton = true;
        turnRight();

    } //droite
}

function keyUp(event) {

    if (event.keyCode === 38){
        stop();
        clearInterval(keepAlive);
        keepAlive = setInterval(stop, keepaliveTime);
        isPressedfbutton = false;
    }
    else if (event.keyCode === 40){
        stop();
        clearInterval(keepAlive);
        keepAlive = setInterval(stop, keepaliveTime);
        isPressedbbutton = false;
    }
    else if (event.keyCode === 37){
        if(!isPressedrbutton){ // En cas d'appui sur les 2 cotés en même temps
            sweepStop();
        }
        isPressedlbutton = false;
    }
    else if (event.keyCode === 39){
        if(!isPressedlbutton){
            sweepStop();
        }
        isPressedrbutton = false;

    }
}




document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);




