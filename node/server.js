var http = require('http');
var bodyParser = require('body-parser');
var express = require('express');
var app = express();

/** bodyParser.urlencoded(options)
 * Parses the text as URL encoded data (which is how browsers tend to send form data from regular forms set to POST)
 * and exposes the resulting object (containing the keys and values) on req.body
 */
app.use(bodyParser.urlencoded({
    extended: true
}));

/**bodyParser.json(options)
 * Parses the text as JSON and exposes the resulting object on req.body.
 */
app.use(bodyParser.json());

app.post("/", function (req, res) {
    console.log('IP du robot : ');
    console.log(req.body.ip);
    res.redirect('/remote');
});

app.get('/', function(req, res){
    res.render('index.ejs');
});

app.get('/remote', function(req, res) {
    res.render('remote.ejs');
});

app.listen(8080);

