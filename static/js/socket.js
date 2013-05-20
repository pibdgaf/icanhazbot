// This file handles all that socket.io-related stuff.

var socket = io.connect(window.location.host);

socket.on('connected', function(data)
{
    $('.status').html('Connected');
});

socket.on('error', function(data)
{
    console.log(data);
});

socket.on('parsed', function(packet)
{
    console.log(packet);
});
