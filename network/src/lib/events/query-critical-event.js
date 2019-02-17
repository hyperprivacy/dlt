'use strict';

require('../../../../config');
var query = require('../chaincodes/query-chaincode');

query.queryChaincode([
    'peer0.enduser.hyperprivacy.network.com'], 
    'eventchannel',
    'events',
    'getCriticalEvents',
    [''],
    'EndUser',
    'enduser_admin')
    .then((res) => {
        console.log(res);
    });