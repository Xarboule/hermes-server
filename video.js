var express = require('express')
var http = require('http')
var net = require('net');
var child = require('child_process');

var app = express();





console.log('- Serveur Video UP -');
var cmd = 'gst-launch-1.0';
var options = null;
var args =
    ['udpsrc', 'address=localhost', 'port=56988',
        '!', 'application/x-rtp, media=video, encoding-name=JPEG, clock-rate=90000, payload=26',
        '!', 'rtpjitterbuffer',
        '!', 'rtpjpegdepay',
        '!', 'jpegdec',
        '!', 'theoraenc',
        '!', 'oggmux',
        '!', 'tcpserversink', 'host=localhost', 'port=8081'];


var gstMuxer = child.spawn(cmd, args);

gstMuxer.stderr.on('data', onSpawnError);
gstMuxer.on('exit', onSpawnExit);


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