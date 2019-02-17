'use strict';

require('../../../../config');
const uuidV1 = require('uuid/v1');
var invoke = require('../chaincodes/invoke-chaincode');

var transient = {
	sensor_id: uuidV1(),
	data: {
		door_opened: true,
		lat: '48.775845',
		lng: '9.182932'
	}
};

function createCriticalEvent(data) {
	return invoke
		.invokeChaincode(
			[ 'peer0.enduser.hyperprivacy.network.com' ],
			'eventchannel',
			'events',
			'createCriticalEvent',
			[ uuidV1() ],
			'EndUser',
			'enduser_admin',
			transient
		)
		.then((res) => {
			console.log(res);
		});
}

module.exports = { createCriticalEvent };
