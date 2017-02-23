var http = require('http');
var bodyParser = require('body-parser');
var express = require('express');
var net = require('net');
var path = require('path');
var colors = require('colors');

var app = express();
var server = http.createServer(app);

var previousOrder = " ";

exports.debug = false;
global.debug = true;



// Chargement de socket.io
var io = require('socket.io')(server);

// Création du socket avec l'interface client
io.on('connection', function (socket) {
    console.log('=== Client connecté ==='.green);

    if(!global.debug) {
        robot.connect(port, ip, function () {
            console.log('Connecté à ' + ip);
            robot.write('sets 1500');
        });
    }

//    else {
//        console.log("--- Mode DEBUG (pas de socket vers le robot) ---");
//        var fakeVideo = require('./fake-video-source');

//    }
    socket.on('disconnect', function (socket) {
        console.log('=== Deconnexion volontaire du client ==='.green);
        disconnect();
    });
    socket.on('message', function (order) {
        if(order !== previousOrder){
            console.log('-> Ordre reçu : '.yellow+order.grey);
            previousOrder = order;
        }


        processOrder(order);
    });

});




var ip = '';
var port = 56987;
var robot = new net.Socket(); // Socket vers MotorDaemon



app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


// Routes :

app.get('/', function(req, res) {
    res.render('../client/views/index.ejs');
});


app.post("/", function (req, res) {     // Envoi du formulaire (ip du robot)
    console.log('IP du robot : '+req.body.ip);
    ip = req.body.ip;
    if(ip === "debug"){
        global.debug = true;
    }
    else{
        debug = false;
    }
    var videoserver = require('./server/video'); // lancement du systeme de vidéo (vérifie l'etat de global.debug)
    res.render('../client/views/remote.ejs');
});


app.get('/status', function (req, res){
   console.log('Actualisation SNMP...');
   var snmp = require('./server/snmp');
});


// Events :

var buf = Buffer.alloc(1024);

function processOrder (orderstr) {

    if(!global.debug) {

        buf = Buffer.alloc(1024);
        buf.write(orderstr);
        console.log('Buffer : '+buf.toString());

        if (orderstr === "go") {
            console.log('Le robot avance !');
            robot.write(buf);
        }
        else if (orderstr === "gor") {
            console.log('Le robot recule !');
            robot.write(buf);

        }
        else if (orderstr === "stop") {
            console.log("Le robot s'arrete !");
            robot.write(buf);

        }
        else if (orderstr === "sweepL") {
            console.log('Le robot tourne a gauche !');
            robot.write(buf);

        }
        else if (orderstr === "sweepR") {
            console.log('Le robot tourne a droite !');
            robot.write(buf);

        }
        else if (orderstr === "sweepstop") {
            console.log('Le robot arrete de tourner !');
            robot.write(buf);

        }
        else if (orderstr === "close") {
            console.log('=== Deconnexion volontaire du client ===');
            disconnect();
        }
        else {
            console.log('Ordre inconnu : ' + orderstr);
        }

    }
}

app.use(express.static(path.join(__dirname, 'client')));

process.on('uncaughtException', function (err) {
    console.error(err.stack);
    console.log("Node NOT Exiting...");
});

function disconnect(){
    console.log('Fermeture du socket Serveur <-> Robot');
    robot.destroy();
}


server.on('close', function(){
    disconnect();
    console.log('Arrêt du serveur.');
});

server.listen(8080);

