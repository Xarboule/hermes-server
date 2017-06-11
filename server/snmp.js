/**
 * Created by xarboule on 14/02/17.
 */

var snmp = require('net-snmp');

var debug = false;

snmp.log = function(string){
    if(debug){
        console.log("SNMP : "+string);
    }
};

// Default options
var options = {
    port: 56991,
    retries: 0,
    timeout: 3000,
    transport: "udp4",
    trapPort: 162,
    version: snmp.Version1
};

var session = snmp.createSession ("127.0.0.1", "public", options);

var state = { type: "snmp",
    connected:false,
    positionX:0,
    positionY:0,
    batteryLevel: 0,
    cameraState: false,
    cpuLoad: 42,
    cpuTemp: 0,
    usedRam: 0,
    totalRam: 0,
    speed: 0,
    orientation: 0 };



module.exports = {

refreshstate: function(socket){
    var baseOid = "1.3.6.1.4.1.56987.";
    var endOid = ".1";
    var oids = [baseOid+"1"+endOid, baseOid+"2"+endOid,
        baseOid+"3"+endOid,
        baseOid+"4"+endOid,
        baseOid+"5"+endOid,
        baseOid+"6"+endOid,
        baseOid+"7"+endOid,
        baseOid+"8"+endOid,
        baseOid+"9"+endOid,
        baseOid+"10"+endOid,
        baseOid+"11"+endOid]; // Liste des oid à vérifier (dans l'ordre !)

    session.get (oids, function (error, varbinds) {
        if (error) {
            console.error("SNMP Error : "+error);
            console.log ("SNMP : Impossible d'obtenir les infos -> infos par defaut");
        } else {
            for (var i = 0; i < varbinds.length; i++)
                if (snmp.isVarbindError (varbinds[i])){
                    console.log ("SNMP Varbinds error : " + snmp.varbindError (varbinds[i]).red);
                }
                else {
                    state.connected = varbinds[0].value.toString();
                    state.positionX = varbinds[1].value.toString();
                    state.positionY = varbinds[2].value.toString();
                    state.batteryLevel = varbinds[3].value.toString();
                    state.cameraState = varbinds[4].value.toString();
                    state.cpuLoad = varbinds[5].value.toString();
                    state.cpuTemp = varbinds[6].value.toString();
                    state.usedRam = varbinds[7].value.toString();
                    state.totalRam = varbinds[8].value.toString();
                    state.speed = varbinds[9].value.toString();
                    state.orientation = varbinds[10].value.toString();
                }
        }
    });
    snmp.log("SNMP : Envoi au client : "+ JSON.stringify(state));
    socket.emit('message', state); // envoi au client de toutes les données
}

};



session.trap (snmp.TrapType.LinkDown, function (error) {
    if (error)
        console.error ("SNMP LinkDown : " + error.red);
});

session.trap (snmp.TrapType.LinkUp, function (error) {
    if (error)
        console.error ("SNMP LinkUp : " + error.red);
});

