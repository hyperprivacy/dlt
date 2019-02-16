
require('./config')


var fs = require("fs");
var path = require("path");

//JOIN CHANNEL
var joinChannel = require('./network/src/lib/channels/join-channel');

joinChannel.joinChannel('eventchannel',["peer0.provider.hyperprivacy.network.com"], 'Provider', 'provider_admin')
.then((res) => {
    console.log(res);
});