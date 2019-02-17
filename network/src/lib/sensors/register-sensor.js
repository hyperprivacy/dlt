'use strict';

require('./../../../../config');
const uuidV1 = require('uuid/v1');
var sleep = require('sleep');
var invoke = require('../chaincodes/invoke-chaincode');

invoke.invokeChaincode([
    'peer0.enduser.hyperprivacy.network.com'], 
    'eventchannel',
    'sensors',
    'addSensor',
    [uuidV1(), '63-D4-66-34-81-D1', 'door-lock', 'Sealed Doors', 'Critical Event for sealed doors'],
    'EndUser',
    'enduser_admin').then((res) => {
        console.log(res);
    });

sleep.sleep(5);

invoke.invokeChaincode([
    'peer0.enduser.hyperprivacy.network.com'], 
    'eventchannel',
    'sensors',
    'addSensor',
    [uuidV1(), '63-D4-66-34-81-D2', 'transport-temperature', 'Package Temperature', 'Event for transport temperature, can be critical.'],
    'EndUser',
    'enduser_admin').then((res) => {
        console.log(res);
    });

sleep.sleep(5);

invoke.invokeChaincode([
    'peer0.enduser.hyperprivacy.network.com'], 
    'eventchannel',
    'sensors',
    'addSensor',
    [uuidV1(), '63-D4-66-34-81-D3', 'transport-motion', 'Transport Temperature', 'Event for transport motion, can be critical.'],
    'EndUser',
    'enduser_admin').then((res) => {
        console.log(res);
    });