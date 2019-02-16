'use strict';

require('./../../../../config');
var query = require('../chaincodes/query-chaincode');

query.queryChaincode("peer0.supervisor.hyperprivacy.network.com",'eventchannel','sensors', 'checkSensor', ['f32804b0-321c-11e9-b7dc-d9833796c201'], "Supervisor", "supervisor_admin");

