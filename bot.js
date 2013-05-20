// This file is for all the bot code
var $       = require('jquery'),
    request = require('request'), 
    config  = require('./config');


// First we get the sign in page...
request.get('https://www.icanhazchat.com/signin', function (error, response, body)
{    
    if(!error && response.statusCode == 200)
    {
        var signin = $(body);

        // Don't ask me why ICHC uses names like this
        signin.find('input[name="ctl00$ContentPlaceHolder1$txtAccountName"]').val(config.username);
        signin.find('input[name="ctl00$ContentPlaceHolder1$txtPassword1"]').val(config.password);

        var postdata = {};

        // Loop through all inputs to build a response (ichc has a lot of hidden values)
        signin.find('input').each(function()
        {
            postdata[$(this).attr('name')] = $(this).val();
        });
    
        // Sign in
        request.post('https://www.icanhazchat.com/signin', {form: postdata}, function (error, response, body)
        {
            // We can't check for statusCode == 200 here because the signin page issues a 302 redirect
            if(!error)
            {
                request.get('https://www.icanhazchat.com/?room=' + config.room, function (error, response, body)
                {    
                    if (!error && response.statusCode == 200)
                    {
                        var room = $(body);

                        room.find('input[name="ctl00$ContentPlaceHolder1$txtUserName"]').val(config.username + "text");
                        room.find('input[name="ctl00$ContentPlaceHolder1$txtPassword"]').val(config.roomPass);
                        room.find('input[name="ctl00$ContentPlaceHolder1$backImgUrl"]').val('');
                        room.find('input[name="ctl00$ContentPlaceHolder1$btnLogin"]').val("I am ready, let's go!");
                        room.find('input[name="WHARBARGLpass"]').val('a6c22d12c0105ae2d3a18d2ad0c22492dd1b4ae');
                        
                        
                        var postdata = {};

                        // Loop through all inputs to build a response (ichc has a lot of hidden values)
                        room.find('input').each(function()
                        {
                            $(this).removeAttr('disabled');
                            postdata[$(this).attr('name')] = $(this).val();
                        });
                                                
                        // Log into the room
                        request.post('https://www.icanhazchat.com/?room=' + config.room, {form: postdata}, function (error, response, body)
                        {
                            // We can't check for statusCode == 200 here because the room password page issues a 302 redirect
                            if(!error)
                            {
                                var wharb = $(body).find('#WHARBARGL1').val();
                                
                                request.cookie("thumper=" + wharb + "; path=/");
                                request.cookie("linestyle=3; path=/");
                                request.cookie("http://www.icanhazchat.com/ec_png=" + wharb + "; path=/");
                                request.cookie("http://www.icanhazchat.com/ec_etag=" + wharb + "; path=/");
                                request.cookie("http://www.icanhazchat.com/ec_cache=" + wharb + ";  path=/");
                                request.cookie("show_images=1; path=/");
                                
                                request.get('https://www.icanhazchat.com/' + config.room, function (error, response, body)
                                {
                                    if (!error && response.statusCode == 200)
                                    {
                                        console.log(body);
                                    }
                                });
                            }
                        });
                    }
                    else
                    {
                        console.log(error);
                        console.log(response);
                    }
                });                
            }
        });
    }
    else
    {
        console.log(error);
        console.log(response);
    }
});

/*
request.get('https://www.icanhazchat.com/?room=' + config.room, function (error, response, body)
{    
    if (!error && response.statusCode == 200)
    {
        console.log(body);
    }
});
*/
