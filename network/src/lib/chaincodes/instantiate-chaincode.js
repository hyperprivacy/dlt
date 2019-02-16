
'use strict';
var util = require('util');
var helper = require('../helper');
var logger = helper.getLogger('instantiate-chaincode');
var path = require('path');

var instantiateChaincode = async function(peers,chaincodeName,chaincodeType, chaincodeVersion, functionName, args, orgName,channelName,username) {
	logger.debug('***** Instantiate chaincode on channel ' + channelName +
		' *******');
	var error_message = null;

	try {
		// first setup the client for this org
		var client = await helper.getClientForOrg(orgName,username);
		logger.debug('Successfully got the fabric client for the organization "%s"', orgName);
		var channel = client.getChannel(channelName);
		if(!channel) {
			let message = util.format('Channel %s was not defined in the connection profile', channelName);
			logger.error(message);
			throw new Error(message);
		}
		var txID = client.newTransactionID(true);
        var deployId = txID.getTransactionID();

        // COLLECTION CONFIG
        const collectionsConfigPath = '/home/davor/Desktop/dlt/network/src/chaincodes/sensors/collection_config.json';

		// send proposal to endorser
		var request = {
			targets : peers,
			chaincodeId: chaincodeName,
			chaincodeType: chaincodeType,
            chaincodeVersion: chaincodeVersion,
            fcn: functionName,
			args: args,
            txId: txID,
			'collections-config': collectionsConfigPath,
			// endorsment policy explanation.
			// https://www.oodlestechnologies.com/blogs/Fabric-Chaincode-Endorsement-Policies-Simplified
			'endorsement-policy': {
				identities: [
				{ role: { name: 'member', mspId: 'ProviderMSP' }},
				{ role: { name: 'member', mspId: 'SupervisorMSP' }}
				],
				policy: {
					'1-of':[{ 'signed-by': 0 }, { 'signed-by': 1 }]
			        }
			} 
		};
		
		let results = await channel.sendInstantiateProposal(request, 60000); //instantiate takes much longer
        console.log(results);


		var proposalResponses = results[0];
		var proposal = results[1];


		var all_good = true;
		for (var i in proposalResponses) {
			console.log("RESPONSE",proposalResponses);
			let one_good = false;
			if (proposalResponses && proposalResponses[i].response &&
				proposalResponses[i].response.status === 200) {
				one_good = true;
				logger.info('instantiate proposal was good');
			} else {
				logger.error('instantiate proposal was bad');
			}
			all_good = all_good & one_good;
		}

		if (all_good) {
			logger.info(util.format(
				'Successfully sent Proposal and received ProposalResponse: Status - %s, message - "%s", metadata - "%s", endorsement signature: %s',
				proposalResponses[0].response.status, proposalResponses[0].response.message,
				proposalResponses[0].response.payload, proposalResponses[0].endorsement.signature));


			// instantiate transaction was committed on the peer
			var promises = [];
			let event_hubs = channel.getChannelEventHubsForOrg();
			logger.debug('found %s eventhubs for this organization %s',event_hubs.length, orgName);
			event_hubs.forEach((eh) => {
				let instantiateEventPromise = new Promise((resolve, reject) => {
					logger.debug('instantiateEventPromise - setting up event');
					let event_timeout = setTimeout(() => {
						let message = 'REQUEST_TIMEOUT:' + eh.getPeerAddr();
						logger.error(message);
						eh.disconnect();
					}, 60000);
					eh.registerTxEvent(deployId, (tx, code, block_num) => {
						logger.info('The chaincode instantiate transaction has been committed on peer %s',eh.getPeerAddr());
						logger.info('Transaction %s has status of %s in blocl %s', tx, code, block_num);
						clearTimeout(event_timeout);

						if (code !== 'VALID') {
							let message = util.format('The chaincode instantiate transaction was invalid, code:%s',code);
							logger.error(message);
							reject(new Error(message));
						} else {
							let message = 'The chaincode instantiate transaction was valid.';
							logger.info(message);
							resolve(message);
						}
					}, (err) => {
						clearTimeout(event_timeout);
						logger.error(err);
						reject(err);
					},

						{unregister: true, disconnect: true}
					);
					eh.connect();
				});
				promises.push(instantiateEventPromise);
			});

			var orderer_request = {
				txId: txID, 
				proposalResponses: proposalResponses,
				proposal: proposal
			};
			console.log("orderer",orderer_request);
			var sendPromise = channel.sendTransaction(orderer_request);
			// put the send to the orderer last so that the events get registered and
			// are ready for the orderering and committing
			promises.push(sendPromise);
			let results = await Promise.all(promises);
			logger.debug(util.format('------->>> R E S P O N S E : %j', results));
			let response = results.pop(); //  orderer results are last in the results
			if (response.status === 'SUCCESS') {
				logger.info('Successfully sent transaction to the orderer.');
			} else {
				error_message = util.format('Failed to order the transaction. Error code: %s',response.status);
				logger.debug(error_message);
			}

			// now see what each of the event hubs reported
			for(let i in results) {
				let event_hub_result = results[i];
				let event_hub = event_hubs[i];
				logger.debug('Event results for event hub :%s',event_hub.getPeerAddr());
				if(typeof event_hub_result === 'string') {
					logger.debug(event_hub_result);
				} else {
					if(!error_message) error_message = event_hub_result.toString();
					logger.debug(event_hub_result.toString());
				}
			}
		} else {
			error_message = util.format('Failed to send Proposal and receive all good ProposalResponse');
			logger.debug(error_message);
		}
	} catch (error) {
		logger.error('Failed to send instantiate due to error: ' + error.stack ? error.stack : error);
		error_message = error.toString();
	}

	if (!error_message) {
		let message = util.format(
			'Successfully instantiate chaincode in organization %s to the channel \'%s\'',
			orgName, channelName);
		logger.info(message);
		// build a response to send back to the REST caller
		let response = {
			success: true,
			message: message
		};
		return response;
	} else {
		let message = util.format('Failed to instantiate. cause:%s',error_message);
		logger.error(message);
		throw new Error(message);
	}
};
exports.instantiateChaincode = instantiateChaincode;
