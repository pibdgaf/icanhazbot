// This file handles all the UI javascript

$(document).ready(function()
{
    $('.packet, .pattern').keypress(function(event)
    {
        // When a user presses enter
        if(event.which == 13)
            $('.submit').trigger('click');
    });

    $('.submit').click(function()
    {
        var packet = $('.packet').val();
        var pattern = $('.pattern').val();
        
        localStorage.setItem('packet', packet);
        localStorage.setItem('pattern', pattern);
        
        socket.emit('packet', {packet: packet, pattern: pattern});
    });
    
    if(localStorage.getItem('packet'))
        $('.packet').val(localStorage['packet']);

    if(localStorage.getItem('pattern'))
        $('.pattern').val(localStorage['pattern']);
});
