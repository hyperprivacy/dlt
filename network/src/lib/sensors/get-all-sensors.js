'use strict';

require('./../../../../config');
var sleep = require('sleep');
var query = require('../chaincodes/query-chaincode');

query.queryChaincode("peer0.supervisor.hyperprivacy.network.com",'eventchannel','sensors', 'checkSensors', [''], "Supervisor", "supervisor_admin");
