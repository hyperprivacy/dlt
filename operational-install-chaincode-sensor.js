'use strict';

require('./config');

var util = require('util');
var path = require("path");
var sleep = require("sleep");

var installChaincode = require('./network/src/lib/chaincodes/install-chancode');

// install chaincode
var chaincodeSensorPath = path.join(__dirname, 'network/src/chaincodes/sensors');


installChaincode.installChaincode(['peer0.supervisor.hyperprivacy.network.com'], "sensors",chaincodeSensorPath,'v0','node','Supervisor')
.then((res) => {
    console.log(res);
});

sleep.sleep(5);

installChaincode.installChaincode(['peer0.provider.hyperprivacy.network.com'], "sensors",chaincodeSensorPath,'v0','node','Provider')
.then((res) => {
    console.log(res);
});

sleep.sleep(5);

installChaincode.installChaincode(['peer0.enduser.hyperprivacy.network.com'], "sensors",chaincodeSensorPath,'v0','node','EndUser')
.then((res) => {
    console.log(res);
});

sleep.sleep(5);

installChaincode.installChaincode(['peer0.iot.hyperprivacy.network.com'], "sensors",chaincodeSensorPath,'v0','node','Iot')
.then((res) => {
    console.log(res);
});