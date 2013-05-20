// This file is for all the websocket interface stuff

var express     = require('express')
  , app         = require('express')()
  , server      = require('http').createServer(app)
  , io          = require('socket.io').listen(server)
  , net         = require('net')
  , parser      = require('packet').createParser()
  , serializer  = require('packet').createSerializer();

server.listen(1064);
app.use(express.static(__dirname + '/static'));

app.get('/', function(req, res)
{
  res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket)
{
    socket.emit('connected'); 
});
