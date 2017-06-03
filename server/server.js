var http = require('http');
var bodyParser = require('body-parser');
var express = require('express');
//var passport = require('passport');
//var session = require('express-session');
//var RedisStore = require('connect-redis')(session);
var net = require('net');
var path = require('path');
var colors = require('colors');

var app = express();
//app.use(session({
    //store = new RedisStore({
    //    url:
    //})
//}));
var server = http.createServer(app);

var snmpManager = require('./snmp'); // Lancement manager SNMP

var previousOrder = " ";
var maxSpeed = 1200; // Vitesse max du robot
var available = true; // Robot disponible ?



console.log("O======================================O".bold.magenta);
console.log("|            Hermes-Server             |".bold.magenta);
console.log("O======================================O".bold.magenta);
console.log(" ");

var sys = require('util');
var exec = require('child_process').exec;
function puts(error, stdout, stderr) { sys.puts(stdout) }
exec("janus", puts); // Lancement du serveur Janus



exports.debug = false;
global.debug = true;


var port = 56987;
var robot = new net.Socket(); // Socket vers MotorDaemon


// Chargement de socket.io
var io = require('socket.io')(server);

// Création du socket avec l'interface client
io.on('connection', function (socket) {
    if(available) {
        console.log('=== Client connecté ==='.bold.green);
        available = false;

        if (!global.debug) {
            robot.connect(port, ip, function () {
                console.log('Connecté à ' + ip);
                var buf1 = Buffer.alloc(1024);
                buf1.write('motordaemon');
                sendOrder(buf1);

                var buf2 = Buffer.alloc(1024);
                buf2.write('sets 1000');
                sendOrder(buf2);

                setTimeout(function () {
                    var buf3 = Buffer.alloc(1024);
                    buf3.write('startwebcamera 127.0.0.1');
                    sendOrder(buf3);
                }, 500);

            });
            robot.on('close', function (){      // En cas de perte du socket Serveur <-> Manager
                socket.disconnect('unauthorized');
                console.log('Socket Serveur <-> Manager Déconnecté !'.bold.red);
                robot.destroy(function () {
                    robot = new net.Socket();
                });
                console.log('Client déconnecté : Serveur libre.');
                available = true; // Remet le robot disponible
            });

        }
        else {
            console.log("(Mode Debug : Pas de socket vers le robot)".italic.gray);
            var fakeVideo = require('./fake-video-source');
        }
        socket.on('disconnect', function (socket) {
            console.log('=== Deconnexion du client ==='.green);
            disconnect();
        });
        socket.on('message', function (order) {
            if (order !== previousOrder) {
                //console.log('-> Ordre reçu : '.yellow + order.grey);
                previousOrder = order;
            }
            processOrder(order);
            snmpManager.refreshstate(socket);
        });

    }
    else {
        console.log("Tentative de connexion : Robot déjà pris !");
    }
});




app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


//-----------------------------------
//             ROUTES
//-----------------------------------


app.get('/', function(req, res) {
    res.render('../client/views/index.ejs');
});


// Mode manuel

app.get("/manualConnection", function(req, res){
    res.render('../client/views/manualConnection.ejs');
});

app.post("/manualConnection", function (req, res) {     // Envoi du formulaire (ip du robot)
    if (available) {
        console.log('IP du robot : '+req.body.ip);
        ip = req.body.ip;
        if(ip === "debug"){
            global.debug = true;
        }
        else{
            debug = false;
        }
        //var videoserver = require('./server/video'); // lancement du systeme de vidéo (vérifie l'etat de global.debug)

        res.render('../client/views/remote.ejs');
    }
    else {
        console.log("Tentative de connexion sur le robot "+ip+" : Deja pris !");
        errorRedirection('Le robot demandé est déjà pris par un autre utilisateur. Veuillez essayer plus tard.', res);
    }
});


// Mode Automatique

app.get('/automaticConnection', function (req, res){
    res.render('../client/views/automaticConnection.ejs');
});

app.post("/automaticConnection", function (req, res) {     // Envoi du formulaire (ip du robot)
    if (available) {
        console.log('IP du robot : '+req.body.ip);
        ip = req.body.ip;
        if(ip === "debug"){
            global.debug = true;
        }
        else{
            debug = false;
        }
        var videoserver = require('./server/video'); // lancement du systeme de vidéo (vérifie l'etat de global.debug)

        res.render('../client/views/automatic.ejs');
    }
    else {
        console.log("Tentative de connexion sur le robot "+ip+" : Deja pris !");
        errorRedirection('Le robot demandé est déjà pris par un autre utilisateur. Veuillez essayer plus tard.', res);
    }
});




app.get("/settings", function(req, res){
   res.render('../client/views/settings.ejs');
});

function errorRedirection(error, res){ // Génération de la page d'erreur
    res.render('../client/views/error.ejs', {error: error});
}

app.get('/disconnected', function(req, res) {
    errorRedirection("La connexion avec MotorDaemon Manager a été perdue.", res);
});


// Events :


function sendOrder(buf) {
    if(!global.debug) {
        robot.write(buf);
    }
}

function processOrder (orderstr) {

    buf = Buffer.alloc(1024);
    buf.write(orderstr);

    var words = orderstr.split(" ");

    if (orderstr === "go") {
        sendOrder(buf);
    }
    else if (orderstr === "gor") {
        sendOrder(buf);
    }
    else if (orderstr === "stop") {
        sendOrder(buf);
    }
    else if (orderstr === "sweepL") {
        sendOrder(buf);
    }
    else if (orderstr === "sweepR") {
        sendOrder(buf);
    }
    else if (orderstr === "sweepstop") {
        sendOrder(buf);
    }
    else if (words[0] === "startwebcamera") {
        buffer = Buffer.alloc(1024);
        var offset = maxSpeed/2;
        var newSpeed = offset+parseInt(words[1], 10)*offset/100;    // Calcul du pourcentage de vitesse
        buffer.write("sets "+newSpeed);                             // max à envoyer (50% offset + 50% variable)

        console.log("Envoyé --> "+buffer);
        sendOrder(buffer);
    }
    else if (words[0] === "speed") {
        buffer = Buffer.alloc(1024);
        var offset = maxSpeed/2;
        var newSpeed = offset+parseInt(words[1], 10)*offset/100;    // Calcul du pourcentage de vitesse
        buffer.write("sets "+newSpeed);                             // max à envoyer (50% offset + 50% variable)

        console.log("Envoyé --> "+buffer);
        sendOrder(buffer);
    }


    else {
        console.log('Ordre inconnu : '.bold.red + orderstr.italic);
    }

}

app.use(express.static(path.join(__dirname, '../client'))); // Rend public le dossier client


process.on('uncaughtException', function (err) {
    console.error("msg : " + err.message);
    console.error("status : " + err.status);
    console.error("statusCode : " + err.statusCode);
    console.log("Node NOT Exiting...");

    available = true; //TODO : rendre ça propre
});

function disconnect(){
    console.log('Fin du flux video...');
    robot.write('stopcamera');
    console.log('Fermeture du socket Serveur <-> Robot '+ip);
    robot.destroy();
    console.log('Client déconnecté : Serveur libre.');
    available = true; // Remet le robot disponible
}


server.on('close', function(){
    disconnect();
    console.log('Arrêt du serveur.');
});

server.listen(8080);

