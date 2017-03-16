/**
 * Created by xarboule on 23/02/17.
 */

var serverIp = '157.159.47.49';
//var serverIp = 'localhost';
var serverPort = '8080';

var socket = io(serverIp+':'+serverPort);

function moveForward() {
    document.getElementById("speed").innerHTML = "Marche avant";
    sendEvent("go");
}

function moveBackward() {
    document.getElementById("speed").innerHTML = "Marche arrière";
    sendEvent("gor");

}

function turnLeft() {
    document.getElementById("turn").innerHTML = "Tourne à gauche";
    sendEvent("sweepL");
}

function turnRight() {
    document.getElementById("turn").innerHTML = "Tourne à droite";
    sendEvent("sweepR");
}

function stop() {
    document.getElementById("speed").innerHTML = "Arrêt";
    sendEvent("stop");
}

function sweepStop () {
    document.getElementById("turn").innerHTML = "Arrete de tourner"
    sendEvent("sweepstop");
}

var isPressedfbutton = false;
var isPressedbbutton = false;
var isPressedlbutton = false;
var isPressedrbutton = false;

var keepaliveTime = 400;
var keepAlive = setInterval(stop, keepaliveTime);

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

function setSpeed(speed){
    console.log("Nouvelle vitesse : " + speed.toString().cyan);
    sendEvent("speed " + speed.toString());
}

function sendEvent(string) {
    socket.emit('message', string);
    console.log('Ordre envoyé : '+string);
}

function shutdown(){
    console.log("Fermeture du webSocket...");
    socket.close();
    document.location.href="/";
}


document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);




