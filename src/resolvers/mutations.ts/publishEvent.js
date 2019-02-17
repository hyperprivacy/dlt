const { createEvent } = require('../../../network/src/lib/events/create-event');
const { createCriticalEvent } = require('../../../network/src/lib/events/create-critical-event');
const { getOneSensor } = require('../../../network/src/lib/sensors/get-one-sensor');
const { pubsub, notificator } = require('../../../static');
const YAML = require('yaml');

const publishEvent = (parent, args, context, info) => {
	return new Promise((resolve) => {
		const event = {
			sensor_id: args.input.deviceId,
			data: JSON.stringify(
				Object.assign(JSON.parse(args.input.data), {
					type: args.input.type,
					creation: Date.now()
				})
			)
		};

		if (args.input.type == 'critical') {
			createCriticalEvent(event);
			pubsub.publish('[CRITICAL-EVENT]', event);

			data = Object.assign({}, event);
			data.data = JSON.parse(data.data);

			getOneSensor(args.input.deviceId).then((sensors) => {
				const sensor = sensors[0];

				notificator.sendAlert(
					`---- CRITICAL EVENT ----\n\nSensor ${sensor.Record.name} send a critical event:\n\n${YAML.stringify(
						data,
						null,
						2
					)}`
				);
			});
		} else {
			createEvent(event);
			pubsub.publish('[EVENT]', event);
		}

		resolve(event);
	});
};

module.exports = { publishEvent };
