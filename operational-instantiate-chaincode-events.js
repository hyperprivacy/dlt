'use strict';

require('./config');
var path = require("path");
var sleep = require("sleep");

var instantiateChaincode = require('./network/src/lib/chaincodes/instantiate-chaincode');
var version = 'v0';

var collectionPath = path.join(__dirname, 'network/src/chaincodes/events/collection_config.json');

instantiateChaincode.instantiateChaincode(['peer0.enduser.hyperprivacy.network.com'],"events",'node', version ,['init'],[''],'EndUser','eventchannel','enduser_admin', collectionPath)
.then((res) => {
    console.log(res);
});