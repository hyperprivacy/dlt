const { getAllEvents } = require('../../../network/src/lib/events/query-event');
const { getAllCriticalEvents } = require('../../../network/src/lib/events/query-critical-event');

const uniqueEvents = undefined;

const events = (parent, args, context, info) => {
	console.log(
		'--------------------------------------------------------------------------------------------------------------------------------------------------------------'
	);

	if (!uniqueEvents) {
		return Promise.all([ getAllEvents(), getAllCriticalEvents() ]).then(([ events, criticalEvents ]) => {
			const preCache = events.concat(criticalEvents).map((event) => {
				return {
					data: typeof event.Record.data == String ? event.Record.data : JSON.stringify(event.Record.data),
					sensor_id: event.Record.sensor_id
				};
			});

			uniqueEvents = preCache;
		});
	} else {
		Promise.all([ getAllEvents(), getAllCriticalEvents() ]).then(([ events, criticalEvents ]) => {
			const preUnique = [];

			[
				...events.concat(criticalEvents).map((event) => {
					return {
						data: typeof event.Record.data == String ? event.Record.data : JSON.stringify(event.Record.data),
						sensor_id: event.Record.sensor_id
					};
				}),
				...uniqueEvents
			].forEach((event) => {
				if (!uniqueEvents.includes(event)) {
					uniqueEvents.push(event);
				}
			});

			uniqueEvents = preUnique;
		});
	}

	return uniqueEvents;
};
module.exports = { events };
