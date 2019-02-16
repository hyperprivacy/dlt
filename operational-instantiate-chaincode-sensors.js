'use strict';

require('./config');

var util = require('util');
var path = require("path");
var sleep = require("sleep");

var instantiateChaincode = require('./network/src/lib/chaincodes/instantiate-chaincode');

instantiateChaincode.instantiateChaincode(['peer0.supervisor.hyperprivacy.network.com'],"sensor",'node','v0',['init'],[''],'Supervisor','eventchannel','supervisor_admin')
.then((res) => {
    console.log(res);
});
