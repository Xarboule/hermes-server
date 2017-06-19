/**
 * Created by xarboule on 18/03/17.
 *
 * Lib de fonctions pour communiquer avec le serveur
 */


var serverIp = location.host;
//var serverIp = 'localhost';

var socket = io(serverIp);


function sendEvent(string) {
    socket.emit('message', string);
    console.log('Ordre envoyé : '+string);
}

socket.on('message', function(e) {

    /*
    try {
        var obj = JSON.parse(e);

    }
    catch(error){
        console.error("Parsing error : "+error);
        console.log("DEBUG : "+e.toString());
    }
*/
    try {
        var decodedString = String.fromCharCode.apply(null, new Uint8Array(e));
        var obj = JSON.parse(decodedString);
    }
    catch(error){

    }

    if(e.type==="snmp"){
        console.log("Info SNMP reçue");
        var status = e;

        document.getElementById("positionX").innerHTML = status.positionX;
        document.getElementById("positionY").innerHTML = status.positionY;
        document.getElementById("batteryLevel").innerHTML = status.batteryLevel;
        document.getElementById("cameraState").innerHTML = status.cameraState;
        document.getElementById("cpuLoad").innerHTML = status.cpuLoad;
        document.getElementById("cpuTemp").innerHTML = status.cpuTemp;
        document.getElementById("usedRam").innerHTML = status.usedRam;
        document.getElementById("totalRam").innerHTML = status.totalRam;
        document.getElementById("snmpSpeed").innerHTML = status.speed;
        document.getElementById("orientation").innerHTML = status.orientation;

        updateRobotPosition(status.positionX, status.positionY, status.orientation); // Met à jour la position du robot en fonction des retours SNMP
    }
    else if(obj.type==="path"){
        console.log("Path reçu");
        displayPath(obj);
    }
    else {
        console.error("Message reçu de type inconnu : "+obj);
    }


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

function ping() {
    sendEvent("status");
}

function startKeepAlive(){
    keepAlive = setInterval(ping, keepaliveTime);
}

function stopKeepAlive(){
    clearInterval(keepAlive);
}

startKeepAlive();




