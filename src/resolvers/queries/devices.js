const { getAllSensors } = require('../../../network/src/lib/sensors/get-all-sensors');
const _ = require('lodash');

const devices = (parent, args, context, info) => {
	return getAllSensors().then((sensors) => {
		return _.map(sensors, (sensor) => {
			return {
				id: sensor.Record.id,
				mac: sensor.Record.mac,
				type: sensor.Record.type,
				description: sensor.Record.description,
				name: sensor.Record.name
			};
		});
	});
};

module.exports = { devices };
