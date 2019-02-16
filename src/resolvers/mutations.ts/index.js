var { login } = require('./login');
var { publishEvent } = require('./publishEvent');
var { registerSensor } = require('./registerSensor');
var { revokeSensor } = require('./revokeSensor');

const Mutation = {
	login: login,
	publishEvent: publishEvent,
	registerSensor: registerSensor,
	revokeSensor: revokeSensor
};

module.exports = { Mutation };
