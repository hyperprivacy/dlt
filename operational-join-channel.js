
require('./config')


var fs = require("fs");
var path = require("path");

//JOIN CHANNEL
var joinChannel = require('./network/src/lib/channels/join-channel');

joinChannel.joinChannel('eventchannel',"peer0.supervisor.hyperprivacy.network.com", 'Supervisor', 'supervisor_admin');