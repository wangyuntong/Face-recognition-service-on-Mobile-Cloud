/**
 * Created by yuntongwang on 4/18/16.
 */
console.log("server start ... ");

var http = require('http')
var spawn = require('child_process').spawn
var fs = require('fs')

execPath = '/home/ubuntu/torch/install/bin/th'
runScriptName = '../run.lua'
loadScriptName = '../load.lua'

// Load CNN model and raise handlers
console.log('Loading the CNN model...')
const luaScript = spawn(execPath, [loadScriptName]);

luaScript.stdout.on('data', function (data) {
    console.log(data);
});

luaScript.stderr.on('data', function (data) {
    console.log('stderr: ' + data);
});

luaScript.on('close', function (code) {
    console.log('Load model succeed!');
});

// Create an HTTP server, handle HTTP request from mobile
var server = http.createServer(function (request, response) {
    console.log("Processing incoming image...");
    var headers = request.headers;
    var method = request.method;
    var url = request.url;
    
    // Write the image to current image file
    // so that lua script could read the image and process
    var f = fs.createWriteStream('../image/currentImage.jpg');

    request.on('error', function (err) {
        console.error(err);
    }).on('data', function (chunk) {
        f.write(chunk);
    }).on('end', function () {

        var FRresult = '';
        f.end();
        // Image filie saved successfully!
        console.log('File saved in ../image/currentImage.jpg')

        // Call another lua script child process to run model on current image
        const luaRunScript = spawn(execPath, [runScriptName]);

        luaRunScript.stdout.on('data', function (data) {
            console.log('Face detection result from lua child process: \n' + data);
            FRresult += data;

            response.on('error', function (err) {
                console.error(err);
            });

            response.statusCode = 200;
            response.setHeader('Content-Type', 'application/json');

            var responseBody = {
                headers: headers,
                method: method,
                url: url,
                body: FRresult
            };

            response.end(JSON.stringify(responseBody));
            console.log("reponse sent back to mobile ... ");
        });

        luaRunScript.stderr.on('data', function (data) {
            console.log('stderr: ' + data);
        });

        luaRunScript.on('close', function (code) {
            console.log('HTTP response sent succeed!');
        });

    })

});
// server listen on port 80
port = '80'
server.listen(port)

console.log("Server listen on port " + port);
