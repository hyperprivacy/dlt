
require('./config')
// var log = process.argv[2];
// var object = JSON.parse(log);
var fs = require("fs");
var path = require("path");

// CREATE CHANNEL
var createChannel = require('./network/src/lib/channels/create-channel');

var channelConfigInBytes = fs.readFileSync(
    path.join(__dirname, 'network/channel/artifacts/eventchannel.tx'));

//console.log(channelConfigInBytes);

// CREATE CHANNEL
try {

    createChannel.createChannel('eventchannel', channelConfigInBytes, 'Supervisor', 'supervisor_admin');
} catch(err) {
    console.log(err);
}




