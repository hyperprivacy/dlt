'use strict';

require('../../../../config');
var query = require('../chaincodes/query-chaincode');

query.queryChaincode([
    'peer0.enduser.hyperprivacy.network.com'], 
    'eventchannel',
    'events',
    'getEventById',
    ['1-d38945465066d64973e8708c63eff823'],
    'EndUser',
    'enduser_admin')
    .then((res) => {
        console.log(res);
    });