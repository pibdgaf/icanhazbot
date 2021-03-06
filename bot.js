// This file is for all the bot code
var $       = require('jquery'),
    request = require('request'), 
    config  = require('./config');

var bot = (function()
{
    var getLogin = function()
        {
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

                    postLogin(postdata);
                }
                else
                {
                    setTimeout(function() { getLogin(); }, 2400);
                }
            });
        },
        
        postLogin = function(postdata)
        {
            request.post('https://www.icanhazchat.com/signin', {form: postdata}, function (error, response, body)
            {
                // We can't check for statusCode == 200 here because the signin page issues a 302 redirect
                if(!error)
                {
                    // We logged in!
                    return true;
                }
                else
                {
                    return false;
                }
            });
        },
        
        getRoom = function()
        {
            request.get('https://www.icanhazchat.com/?room=' + config.room, function (error, response, body)
            {    
                if (!error && response.statusCode == 200)
                {
                    var room = $(body);

                    room.find('input[name="ctl00$ContentPlaceHolder1$txtUserName"]').val(config.username);
                    room.find('input[name="ctl00$ContentPlaceHolder1$txtPassword"]').val(config.roomPass);
                    room.find('input[name="ctl00$ContentPlaceHolder1$backImgUrl"]').val('');
                    room.find('input[name="ctl00$ContentPlaceHolder1$btnLogin"]').val("I am 18+ and agree to the rules");

                    room.find('input[name="ctl00$ContentPlaceHolder1$btnGoAway"]').remove();
                    room.find('input[name="ctl00$btnAmazonSearch"]').remove();

                    // I'm not sure what this is. It doesn't seem to change. Maybe a unique key per-user?
                    room.find('input[name="WHARBARGLpass"]').val('0e14b468e465b0f47e6f141786e34a7fe4216d77');
                    

                    // For some reason ichc needs these values to be set, but empty.
                    var postdata =
                    {
                        __LASTFOCUS: '',
                        __EVENTTARGET: '',
                        __EVENTARGUMENT: ''
                    };

                    // Loop through all inputs to build a response
                    room.find('input').each(function()
                    {
                        $(this).removeAttr('disabled');
                        postdata[$(this).attr('name')] = $(this).val();
                    });

                    postRoom(postdata);
                }
                else
                {
                     setTimeout(function() { getRoom(); }, 2400);
                }
            });
        },
        
        postRoom = function(postdata)
        {
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
                            // We're in!
                            return true;
                        }
                    });
                }
                else
                {
                    return false;
                }
            });
        },

        update = function() {};
        
    return {
        login: getLogin,
        enter: getRoom,
        update: update
    };
})();



module.exports = bot;
