var express = require('express');
var https = require('https');
var http = require('http');
var fs = require('fs');
var app = express();

var options = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.crt'),
    ca: fs.readFileSync('ca.crt'),
    requestCert: true,
    rejectUnauthorized: false
};

app.get('/', function(req,res) {
    res.send('hello');
});

httpsPort = 4433;
var httpsServer = https.createServer(options, app);

httpsServer.listen(httpsPort, function() {
    console.log('Webserver started, Listening on port [' + httpsPort + ']');
});