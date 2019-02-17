const { getOneSensor } = require('../../../network/src/lib/sensors/get-one-sensor');

const Event = {
	device: (parent, args, context, info) => {
		return getOneSensor(parent.sensor_id).then((sensors) => {
			if (sensors.length < 1) {
				return null;
			}

			const sensor = sensors[0];

			return {
				id: sensor.Record.id,
				mac: sensor.Record.mac,
				type: sensor.Record.type,
				description: sensor.Record.description,
				name: sensor.Record.name
			};
		});
	}
};

module.exports = { Event };
