'use strict';

require('../../../../config');
const uuidV1 = require('uuid/v1');
var invoke = require('../chaincodes/invoke-chaincode');

var transient = {
	sensor_id: uuidV1(),
	data: {
		temperature: 20
	}
};

function createEvent(data) {
	return invoke
		.invokeChaincode(
			[ 'peer0.enduser.hyperprivacy.network.com' ],
			'eventchannel',
			'events',
			'createEvent',
			[ uuidV1() ],
			'EndUser',
			'enduser_admin',
			transient
		)
		.then((res) => {
			console.log(res);
			return res;
		});
}

module.exports = { createEvent };
