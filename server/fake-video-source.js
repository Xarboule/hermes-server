/**
 * Created by xarboule on 08/02/17.
 */
var child = require('child_process');


var cmd = 'gst-launch-1.0';
var options = null;
var args =
    ['videotestsrc', 'pattern=snow',
        '!', 'videoconvert',
        '!', 'videoscale',
        '!', 'video/x-raw,width=320,height=240',
        '!', 'videorate',
        '!', 'video/x-raw,framerate=15/1',
        '!', 'jpegenc', 'quality=30',
        '!', 'rtpjpegpay',
        '!', 'udpsink', 'host=127.0.0.1',
        'port=56988'];

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