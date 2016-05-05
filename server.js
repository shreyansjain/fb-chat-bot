var express = require('express');
var https = require('https');
var http = require('http');
var fs = require('fs');
var app = express();

app.get('/', function(req,res) {
    res.send('hello');
});

httpPort = 8080;

app.listen(httpPort, function() {
    console.log('Webserver started, Listening on port [' + httpPort + ']');
});