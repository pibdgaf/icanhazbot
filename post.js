var http = require('http');
var querystring = require('querystring');

function postRequest(request, response, callback) {
    var queryData = "";
    if(typeof callback !== 'function') return null;

    if(request.method == 'POST') {
        request.on('data', function(data) {
            queryData += data;
            if(queryData.length > 1e6) {
                queryData = "";
                response.writeHead(413, {'Content-Type': 'text/plain'}).end();
                request.connection.destroy();
            }
        });

        request.on('end', function() {
            response.post = querystring.parse(queryData);
            callback();
        });

    } else {
        response.writeHead(405, {'Content-Type': 'text/plain'});
        response.end();
    }
}

http.createServer(function(request, response) {
    postRequest(request, response, function() {
        console.log(response.post);

        response.writeHead(200, "OK", {'Content-Type': 'text/plain'});
        response.end();
    });

}).listen(1024);
