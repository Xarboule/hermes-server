/**
 * Created by xarboule on 08/02/17.
 */
var child = require('child_process');

console.log('Lancement de la Fake Video Source');

var cmd = 'gst-launch-1.0';
var options = null;
var args =
    ['videotestsrc',
        '!', 'video/x-raw,width=320,height=240,framerate=15/1',
        '!', 'videoscale',
        '!', 'videorate',
        '!', 'videoconvert',
        '!', 'timeoverlay',
        '!', 'vp8enc', 'error-resilient=1',
        '!', 'rtpvp8pay',
        '!', 'udpsink', 'host=127.0.0.1',
        'port=5004'];


var gstMuxer = child.spawn(cmd, args);

gstMuxer.stderr.on('data', onSpawnError);
gstMuxer.on('exit', onSpawnExit);



function onSpawnError(data) {
    console.log('FAKE-VIDEO-SOURCE : '+data.toString());
}

function onSpawnExit(code) {
    if (code != null) {
        console.error('FAKE-VIDEO-SOURCE : GStreamer error, exit code ' + code);
    }
}