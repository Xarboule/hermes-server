/**
 * Created by xarboule on 14/02/17.
 */

var snmp = require('net-snmp');

// Default options
var options = {
    port: 8079,
    retries: 0,
    timeout: 3000,
    transport: "udp4",
    trapPort: 162,
    version: snmp.Version1
};

var session = snmp.createSession ("127.0.0.1", "public", options);

var state = { connected:false, positionX:0, positionY:0, batteryLevel: 0, cameraState: false, cpuLoad: 42, cpuTemp: 0, usedRam: 0, totalRam: 0, speed: 0, orientation: 0 };

module.exports = {

refreshstate: function(socket){
    var baseOid = "1.3.6.1.4.1.56987.";
    var endOid = ".1";
    var oids = [baseOid+"0"+endOid, baseOid+"1"+endOid, baseOid+"2"+endOid, baseOid+"3"+endOid, baseOid+"4"+endOid, baseOid+"5"+endOid, baseOid+"6"+endOid, baseOid+"7"+endOid, baseOid+"8"+endOid, baseOid+"9"+endOid, baseOid+"10"+endOid]; // Liste des oid à vérifier (dans l'ordre !)
    session.get (oids, function (error, varbinds) {
        if (error) {
            console.log ("SNMP : Impossible d'obtenir les infos -> infos par defaut");
        } else {
            for (var i = 0; i < varbinds.length; i++)
                if (snmp.isVarbindError (varbinds[i])){
                    console.log ("SNMP Varbinds : " + snmp.varbindError (varbinds[i]).red);
                }
                else {
                    state.connected = varbinds[0].value;
                    state.position[0] = varbinds[1].value;
                    state.position[1] = varbinds[2].value;
                    state.batteryLevel = varbinds[3].value;
                    state.cameraState = varbinds[4].value;
                    state.cpuLoad = varbinds[5].value;
                    state.cpuTemp = varbinds[6].value;
                    state.usedRam = varbinds[7].value;
                    state.totalRam = varbinds[8].value;
                    state.speed = varbinds[9].value;
                    state.orientation = varbinds[10].value;
                }
        }
    });
    console.log("SNMP : Envoi au client : "+ JSON.stringify(state));
    socket.emit('message', JSON.stringify(state)); // envoi au client de toutes les données
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

