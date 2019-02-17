'use strict';

require('./../../../../config');
var query = require('../chaincodes/query-chaincode');

function getOneSensor(id) {
	return query.queryChaincode(
		'peer0.supervisor.hyperprivacy.network.com',
		'eventchannel',
		'sensors',
		'checkSensor',
		[ id ],
		'Supervisor',
		'supervisor_admin'
	);
}

module.exports = { getOneSensor };
