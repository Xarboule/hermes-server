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

    try {
        var status = JSON.parse(e);
    }
    catch(error){
        console.error("Parsing error : "+error);
    }
    //console.log("STATUS cpuLoad : "+JSON.parse(status).cpuLoad);


});

socket.on('data', function(e){
   console.log("Reçu : "+e);
});

socket.on('connect_failed', function(e){
    console.log('Impossible de se connecter à MotorDaemon Manager !');
    document.location.href="/disconnected";


});
socket.on('disconnect', function(e){   // En cas de déconnexion entre le serveur et le client
    console.log('MotorDaemon Manager déconnecté !');
    stopKeepAlive();
    document.location.href="/disconnected";
});

/**
 * Liste des ordres
 */

function askGoTo(coordinates, angle){
    console.log("PDD : Demande pour le point : "+coordinates);
    sendEvent("goto "+coordinates.x+" "+coordinates.y+" "+angle+" "+"0");
}

function goTo(coordinates, angle) {
    console.log("PDD : GoTo "+coordinates);
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




