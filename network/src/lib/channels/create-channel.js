var helper = require('../../helper');

var createChannel = async function(channelName,channelConfigInBytes, orgName, username){
    try {
        // setup the client for org
        var client = await helper.getClientForOrg(orgName, username);
        var channelConfig = client.extractChannelConfig(channelConfigInBytes);

        let signature = client.signChannelConfig(channelConfig);

        // create request 
        // see crate create channel

        let request = {
            config: channelConfig,
            signatures: [signature],
            name: channelName,
            //admin transaction, for production remove "true" and use admin identity
            txId: client.newTransactionID(true)
        }

        // send to orderer

        var response = await client.createChannel(request)

        if (response && response.status === 'SUCCESS') {                        
            return {
                success : true,
                message: "Channel " + channelName + " created Succesfully "
            };
        } else {
            throw  {
                sucess: false,
                message: "Failed to create channel: " +  channelName,
                status: response.status,
                info: response.info
            };
        }
    } catch(err) {
        throw err;
    }
}
exports.createChannel = createChannel;