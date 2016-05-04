/**
 * Created by yuntongwang on 4/18/16.
 */
var spawn = require('child_process').spawn

execPath = '/home/ubuntu/torch/install/bin/th'
runScriptName = '/home/ubuntu/Face-recognition-service-on-Mobile-Cloud/run.lua'
loadScriptName = '/home/ubuntu/Face-recognition-service-on-Mobile-Cloud/load.lua'

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

const luaScript = spawn(execPath, [runScriptName]);

luaScript.stdout.on('data', function (data) {
    console.log('stdout: ' + data);
});

luaScript.stderr.on('data', function (data) {
    console.log('stderr: ' + data);
});

luaScript.on('close', function (code) {
    console.log('child process exited with code ' + code);
});
