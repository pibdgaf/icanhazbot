// This file is for all the websocket interface stuff

var express     = require('express')
  , app         = require('express')()
  , server      = require('http').createServer(app)
  , io          = require('socket.io').listen(server)
  , net         = require('net')
  , bot         = require('./bot');

server.listen(1064);
app.use(express.static(__dirname + '/static'));

app.get('/', function(req, res)
{
  res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket)
{
    socket.emit('connected');

    socket.on('command', function(data)
    {
        console.log('got command');
        switch(data.command)
        {
            case "login":
                bot.login();
                socket.emit('response', {message: "Logged into ICHC"});
                break;

            case "enter":
                bot.enter();
                socket.emit('response', {message: "entered room"});
                break;

            default:
                socket.emit('response', {message: "You sent me '"+data.command+"' but I dunno what that is!"});
                break;
        }
    });
});
