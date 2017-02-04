var http = require('http');
var bodyParser = require('body-parser');
var express = require('express');
var net = require('net');
var io = require('socket.io');

var app = express();


var ip = '';
var port = 56987;
var robot = new net.Socket();



app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


// Routes :

app.get('/', function(req, res) {
    res.render('index.ejs');
});

app.get('/remote', function(req, res) {
    res.render('remote.ejs');
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

    res.redirect('/remote');
});


// Events :

app.post('/remote', function (req, res) {

    var buf = new Buffer(1024);
    buf.write(req.body.orderstr)


    if(req.body.orderstr === "go"){
        console.log('Le robot avance !');
        res.writeHead(200, {'Content-Type':'text/plain'});
        res.send();
        robot.write(buf);
    }
    else if(req.body.orderstr === "gor"){
        console.log('Le robot recule !');
        res.writeHead(200, {'Content-Type':'text/plain'});
        res.send();
        robot.write(buf);

    }
    else if(req.body.orderstr === "stop"){
        console.log("Le robot s'arrete !");
        res.writeHead(200, {'Content-Type':'text/plain'});
        res.send();
        robot.write(buf);

    }
    else if(req.body.orderstr === "sweepL"){
        console.log('Le robot tourne a gauche !');
        res.writeHead(200, {'Content-Type':'text/plain'});
        res.send();
        robot.write(buf);

    }
    else if(req.body.orderstr === "sweepR"){
        console.log('Le robot tourne a droite !');
        res.writeHead(200, {'Content-Type':'text/plain'});
        res.send();
        robot.write(buf);

    }
    else if(req.body.orderstr ==="sweepstop"){
        console.log('Le robot arrete de tourner !');
        res.writeHead(200, {'Content-Type':'text/plain'});
        res.send();
        robot.write(buf);

    }
    else {
        console.log('Ordre inconnu '+req.body.orderstr );
        res.writeHead(200, {'Content-Type':'text/plain'});
        res.send();
        robot.write(buf);

    }

});





app.on('close', function(){
    console.log('Fermeture du client.');
});

app.listen(8080);
