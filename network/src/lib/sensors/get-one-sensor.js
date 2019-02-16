'use strict';

require('./../../../../config');
var query = require('../chaincodes/query-chaincode');

query.queryChaincode("peer0.supervisor.hyperprivacy.network.com",'eventchannel','sensors', 'checkSensor', ['c5558b40-3224-11e9-8080-f1209e3265a1'], "Supervisor", "supervisor_admin");

