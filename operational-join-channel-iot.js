
require('./config')


var fs = require("fs");
var path = require("path");

//JOIN CHANNEL
var joinChannel = require('./network/src/lib/channels/join-channel');

joinChannel.joinChannel('eventchannel',["peer0.iot.hyperprivacy.network.com"], 'Iot', 'iot_admin')
.then((res) => {
    console.log(res);
});