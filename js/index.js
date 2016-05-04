/**
 * Created by yuntongwang on 4/18/16.
 */

var http = require('http')
var spawn = require('child_process').spawn
var fs = require('fs')

// execPath = '/home/ubuntu/torch/install/bin/th'
execPath = '/Users/yuntongwang/torch/install/bin/th'
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
    console.log('child process exited with code ' + code);
});

http.createServer(function(request, response) {
    var imagedata = []
    var imgID = request.get('imageID');
    var method = request.method;
    var url = request.url;
    var body = [];
    response.setEncoding('binary')

    request.on('error', function(err) {
        console.error(err);
    }).on('data', function(chunk) {
        body.push(chunk);
    }).on('end', function() {

        // Write the image to current image file
        var FRresult = [];
        fs.writeFile('../image/currentImage.jpg', imagedata, 'binary', function(err){
            if (err) throw err
            console.log('File saved.')
            const luaRunScript = spawn(execPath, [runScriptName]);

            luaRunScript.stdout.on('data', function (data) {
                console.log('stdout: ' + data);
                FRresult.push(data)
            });

            luaRunScript.stderr.on('data', function (data) {
                console.log('stderr: ' + data);
            });

            luaRunScript.on('close', function (code) {
                console.log('child process exited with code ' + code);
            });

        })

        //
        //


        response.on('error', function(err) {
            console.error(err);
        });

        response.statusCode = 200;
        response.setHeader('Content-Type', 'application/json');
        // Note: the 2 lines above could be replaced with this next one:
        // response.writeHead(200, {'Content-Type': 'application/json'})

        var responseBody = {
            headers: headers,
            method: method,
            url: url,
            body: FRresult
        };

        response.write(JSON.stringify(responseBody));
        response.end();
        // Note: the 2 lines above could be replaced with this next one:
        // response.end(JSON.stringify(responseBody))

        // END OF NEW STUFF
    });
}).listen(8080);


//const loadLuaScript = spawn(execPath, [loadScriptName]);

//loadLuaScript.stdout.on('data', function (data) {
//    console.log('stdout: ' + data);
//});

//loadLuaScript.stderr.on('data', function (data) {
//    console.log('stderr: ' + data);
//});

//loadLuaScript.on('close', function (code) {
//    console.log('child process exited with code ' + code);
//});

