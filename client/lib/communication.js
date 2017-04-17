/**
 * Created by xarboule on 18/03/17.
 *
 * Lib de fonctions pour communiquer avec le serveur
 */

var serverIp = '127.0.0.1';
//var serverIp = 'localhost';
var serverPort = '8080';

var socket = io(serverIp+':'+serverPort);


function sendEvent(string) {
    socket.emit('message', string);
    console.log('Ordre envoyé : '+string);
}

socket.on('message', function(e) {

    console.log("REÇU : "+e);
    try {
        var status = JSON.parse(e);
    }
    catch(error){
        console.error("Parsing error : "+error);
    }
    //console.log("STATUS cpuLoad : "+JSON.parse(status).cpuLoad);

    document.getElementById("positionX").innerHTML = JSON.stringify(status).positionX;
    document.getElementById("positionY").innerHTML = JSON.stringify(status).positionY;
    document.getElementById("batteryLevel").innerHTML = JSON.stringify(status).batteryLevel;
    document.getElementById("cameraState").innerHTML = JSON.stringify(status).cameraState;
    document.getElementById("cpuLoad").innerHTML = JSON.stringify(status).cpuLoad;
    document.getElementById("cpuTemp").innerHTML = JSON.stringify(status).cpuTemp;
    document.getElementById("usedRam").innerHTML = JSON.stringify(status).usedRam;
    document.getElementById("totalRam").innerHTML = JSON.stringify(status).totalRam;
    document.getElementById("speed").innerHTML = JSON.stringify(status).speed;
    document.getElementById("orientation").innerHTML = JSON.stringify(status).orientation;




});

socket.on('disconnect', function(e){   // En cas de déconnexion entre le serveur et le client
    console.log('MotorDaemon Manager déconnecté !');
    stopKeepAlive();
    document.location.href="/disconnected";
});

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
    document.getElementById("turn").innerHTML = "Arrete de tourner";
    sendEvent("sweepstop");
}

function setSpeed(speed){
    console.log("Nouvelle vitesse : " + speed.toString().cyan);
    sendEvent("speed " + speed.toString());
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
var keepAlive = 0;

function startKeepAlive(){
    keepAlive = setInterval(stop, keepaliveTime);
}

function stopKeepAlive(){
    clearInterval(keepAlive);
}

startKeepAlive();




