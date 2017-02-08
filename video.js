var express = require('express')
var http = require('http')
var net = require('net');
var child = require('child_process');

var app = express();
var httpServer = http.createServer(app);

if(global.debug){
    var fakeVideo = require('./fake-video-source');
}

app.get('/', function(req, res) {
    var date = new Date();

    res.writeHead(200, {
        'Date':date.toUTCString(),
        'Connection':'close',
        'Cache-Control':'private',
        'Content-Type':'video/x-motion-jpeg',
        'Server':'CustomStreamer/0.0.1',
    });


    var dgram = require('dgram');
    var udpserver = dgram.createSocket('udp4');


    udpserver.on('listening', function () {
        console.log('Serveur UDP up');
        var cmd = 'gst-launch-1.0';
        var options = null;
        var args =
            ['udpsrc', 'host=localhost', 'port=56988',
                '!', 'application/x-rtp', 'media=video, encoding-name=JPEG, clock-rate=90000, payload=26',
                '!', 'rtpjitterbuffer',
                '!', 'rtpjpegdepay',
                '!', 'jpegdec',
                '!', 'tcpclientsink', 'host=localhost',
                'port=56988'];

        var gstMuxer = child.spawn(cmd, args);

        gstMuxer.stderr.on('data', onSpawnError);
        gstMuxer.on('exit', onSpawnExit);

    });
    udpserver.on('message', function(message, remote) {
        res.write(data);
    });


});

httpServer.listen(8081);

function onSpawnError(data) {
    console.log(data.toString());
}

function onSpawnExit(code) {
    if (code != null) {
        console.error('GStreamer error, exit code ' + code);
    }
}

process.on('uncaughtException', function(err) {
    console.log(err);
});