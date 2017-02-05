var http = require('http');
var bodyParser = require('body-parser');
var express = require('express');
var net = require('net');

var app = express();
var server = http.createServer(app);


// Chargement de socket.io
var io = require('socket.io')(server);

// Création du socket avec l'interface client
io.on('connection', function (socket) {
    console.log('---- Client connecté ----');
    socket.on('disconnect', function (socket) {
        console.log('---- Client déconnecté ----');
        disconnect();
    });
    socket.on('message', function (order) {
        console.log('-> Ordre reçu : '+order);
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
    res.render('index.ejs');
});


app.post("/", function (req, res) {     // Envoi du formulaire (ip du robot)
    console.log('IP du robot : '+req.body.ip);

    if(req.body.ip !== "debug")
    {
        robot.connect(port, req.body.ip, function() {
            console.log('Connected to '+req.body.ip);
            robot.write('sets 2500');

        });
    }

    res.render('remote.ejs');
});


// Events :

function processOrder (orderstr) {

    var buf = new Buffer(1024);
    buf.write(orderstr);


    if(orderstr === "go"){
        console.log('Le robot avance !');
        robot.write(buf);
    }
    else if(orderstr === "gor"){
        console.log('Le robot recule !');
        robot.write(buf);

    }
    else if(orderstr === "stop"){
        console.log("Le robot s'arrete !");
        robot.write(buf);

    }
    else if(orderstr === "sweepL"){
        console.log('Le robot tourne a gauche !');
        robot.write(buf);

    }
    else if(orderstr === "sweepR"){
        console.log('Le robot tourne a droite !');
        robot.write(buf);

    }
    else if(orderstr ==="sweepstop"){
        console.log('Le robot arrete de tourner !');
        robot.write(buf);

    }
    else {
        console.log('Ordre inconnu : '+orderstr );
    }

}


process.on('uncaughtException', function (err) {
    console.error(err.stack);
    console.log("Node NOT Exiting...");
});

function disconnect(){
    console.log('Fermeture du socket Robot...')
    robot.close();
}


server.on('close', function(){
    disconnect();
    console.log('Arrêt du serveur.');
});

server.listen(8080);
