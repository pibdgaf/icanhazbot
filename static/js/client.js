// This file handles all the UI javascript

$(document).ready(function()
{
    $('.command').keypress(function(event)
    {
        // When a user presses enter
        if(event.which == 13)
            $('.submit').trigger('click');
    });

    $('.submit').click(function()
    {
        var command = $('.command').val();
        console.log(socket);
        socket.emit('command', {command: command});
    });
});
