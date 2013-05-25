// This file handles all that socket.io-related stuff.

var socket = io.connect(window.location.host);

socket.on('connected', function(data)
{
    console.log('connected...');
});

socket.on('error', function(data)
{
    console.log(data);
});

socket.on('response', function(data)
{
    console.log(data);
});
