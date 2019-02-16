var util = require('util');
var helper = require('../helper');
var logger = helper.getLogger('Query');

var queryChaincode = async function (peer,channelName,chaincodeName, fcn, args, orgName, username) {
	try {
		// first setup the client for this org
		var client = await helper.getClientForOrg(orgName, username);
		logger.debug('Successfully got the fabric client for the organization "%s"', orgName);
		var channel = client.getChannel(channelName);
		if (!channel) {
			let message = util.format('Channel %s was not defined in the connection profile', channelName);
			logger.error(message);
			throw new Error(message);
		}

		// send query
		var request = {
			targets: peer, //queryByChaincode allows for multiple targets
			chaincodeId: chaincodeName,
			fcn: fcn,
			args: args,
			request_timeout: 200000
		};
        let response_payloads = await channel.queryByChaincode(request, true);
        
        console.log("RESPONSE", response_payloads);


		if (response_payloads) {
            console.log(JSON.parse(response_payloads));
			return JSON.parse(response_payloads);

		} else {
			logger.error('response_payloads is null');
			return 'response_payloads is null';
		}

	} catch (error) {
		logger.error('Failed to query due to error: ' + error.stack ? error.stack : error);
		return error.toString();
	}
};

var getBlockByNumber = async function (peer, channelName, blockNumber, orgName, username) {
	try {
		// first setup the client for this org
		var client = await helper.getClientForOrg(orgName, username);
		logger.debug('Successfully got the fabric client for the organization "%s"', orgName);
		var channel = client.getChannel(channelName);
		if (!channel) {
			let message = util.format('Channel %s was not defined in the connection profile', channelName);
			logger.error(message);
			throw new Error(message);
		}

		let response_payload = await channel.queryBlock(parseInt(blockNumber), peer, true);
		//console.log(response_payload);
		if (response_payload) {
			logger.debug(response_payload);
			return response_payload;
		} else {
			logger.error('response_payload is null');
			return 'response_payload is null';
		}
	} catch (error) {
		logger.error('Failed to query due to error: ' + error.stack ? error.stack : error);
		return error.toString();
	}
};

exports.queryChaincode = queryChaincode;
exports.getBlockByNumber = getBlockByNumber;