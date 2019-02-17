'use strict';

require('../../../../config');
var query = require('../chaincodes/query-chaincode');

function getAllCriticalEvents() {
	return query
		.queryChaincode(
			[ 'peer0.enduser.hyperprivacy.network.com' ],
			'eventchannel',
			'events',
			'getCriticalEvents',
			[ '' ],
			'EndUser',
			'enduser_admin'
		)
		.then((res) => {
			console.log(res);
			return res;
		});
}

module.exports = { getAllCriticalEvents };
