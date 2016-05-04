/**
 * Created by yuntongwang on 4/18/16.
 */
console.log("server start ... ");

var http = require('http')
var spawn = require('child_process').spawn
var fs = require('fs')

execPath = '/home/ubuntu/torch/install/bin/th'
// execPath = '/Users/yuntongwang/torch/install/bin/th'
runScriptName = '../run.lua'
loadScriptName = '../load.lua'

const luaScript = spawn(execPath, [loadScriptName]);

luaScript.stdout.on('data', function (data) {
    console.log('stdout: ' + data);
});

luaScript.stderr.on('data', function (data) {
    console.log('stderr: ' + data);
});

luaScript.on('close', function (code) {
    console.log('Load model child process exited with code ' + code);
});

var server = http.createServer(function(request, response) {
    console.log("Processing incoming image...");
    var imagedata = []
    var headers = request.headers;
    var method = request.method;
    var url = request.url;

    request.on('error', function(err) {
        console.error(err);
    }).on('data', function(chunk) {
        imagedata.push(chunk);
    }).on('end', function() {

        // Write the image to current image file
        var FRresult = [];
        fs.writeFile('../image/currentImage.jpg', imagedata, 'binary', function(err){
            if (err) {
                return console.error(err);
            }
            console.log('File saved in ../image/currentImage.jpg')
            const luaRunScript = spawn(execPath, [runScriptName]);

            luaRunScript.stdout.on('data', function (data) {
                console.log('stdout: ' + data);
                FRresult.push(data)
                
                response.on('error', function(err) {
                    console.error(err);
                });

                response.statusCode = 200;
                response.setHeader('Content-Type', 'application/json');
                // Note: the 2 lines above could be replaced with this next one:
                // response.writeHead(200, {'imageID': imgID})

                var responseBody = {
                  headers: headers,
                  method: method,
                  url: url,
                  body: FRresult
                };

                response.write(JSON.stringify(responseBody));
                response.end();
                console.log("reponse sent back to mobile ... ");
                // Note: the 2 lines above could be replaced with this next one:
                // response.end(JSON.stringify(responseBody))

                // END OF NEW STUFF
            });

            luaRunScript.stderr.on('data', function (data) {
                console.log('stderr: ' + data);
            });

            luaRunScript.on('close', function (code) {
                console.log('child process exited with code ' + code);
            });

        })

    });
});

// server listen on port 8080
port = '80'
server.listen(port)

console.log("Server listen on port " + port);
