/**
 * Created by xarboule on 18/03/17.
 *
 * Lib de fonctions pour communiquer avec le serveur
 */

var serverIp = '157.159.47.49';
//var serverIp = 'localhost';
var serverPort = '8080';

var socket = io(serverIp+':'+serverPort);

function sendEvent(string) {
    socket.emit('message', string);
    console.log('Ordre envoyé : '+string);
}


/**
 * Liste des ordres
 */

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

function setSpeed(speed){
    console.log("Nouvelle vitesse : " + speed.toString().cyan);
    sendEvent("speed " + speed.toString());
}

function getPosition(){
    sendEvent("p");
    console.log("Position du Robot : ")
}


function shutdown(){
    console.log("Fermeture du webSocket...");
    socket.close();
    document.location.href="/";
}

/**
 * Gestion KeepAlive
 */

var keepaliveTime = 400;
var keepAlive = setInterval(stop, keepaliveTime);




