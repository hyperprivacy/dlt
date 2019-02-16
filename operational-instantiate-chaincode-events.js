'use strict';

require('./config');
var path = require("path");
var sleep = require("sleep");

var instantiateChaincode = require('./network/src/lib/chaincodes/instantiate-chaincode');

var collectionPath = path.join(__dirname, 'network/src/chaincodes/events/collection_config.json');

instantiateChaincode.instantiateChaincode(['peer0.supervisor.hyperprivacy.network.com'],"events",'node','v1',['init'],[''],'Supervisor','eventchannel','supervisor_admin', collectionPath)
.then((res) => {
    console.log(res);
});
