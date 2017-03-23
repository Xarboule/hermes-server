/**
 * Created by xarboule on 14/02/17.
 */

var snmp = require('net-snmp');

// Default options
var options = {
    port: 8079,
    retries: 0,
    timeout: 1000,
    transport: "udp4",
    trapPort: 162,
    version: snmp.Version1
};

var session = snmp.createSession ("137.74.162.172", "public", options);

var oids = ["1.3.6.1.2.1.1.1.0"];

session.get (oids, function (error, varbinds) {
    if (error) {
        console.error ("SNMP : " + error);
    } else {
        for (var i = 0; i < varbinds.length; i++)
            if (snmp.isVarbindError (varbinds[i]))
                console.error ("SNMP : " + snmp.varbindError (varbinds[i]))
            else
                console.log ("SNMP : " + varbinds[i].oid + " = " + varbinds[i].value);
    }
});

session.trap (snmp.TrapType.LinkDown, function (error) {
    if (error)
        console.error ("SNMP LinkDown : " + error);
});

session.trap (snmp.TrapType.LinkUp, function (error) {
    if (error)
        console.error ("SNMP LinkUp : " + error);
});
