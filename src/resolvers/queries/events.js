const { getAllEvents } = require('../../../network/src/lib/events/query-event');
const { getAllCriticalEvents } = require('../../../network/src/lib/events/query-critical-event');

const events = (parent, args, context, info) => {
	console.log(
		'--------------------------------------------------------------------------------------------------------------------------------------------------------------'
	);

	return Promise.all([ getAllEvents(), getAllCriticalEvents() ]).then(([ events, criticalEvents ]) => {
		return events.concat(criticalEvents).map((event) => {
			return {
				data: typeof event.Record.data == String ? event.Record.data : JSON.stringify(event.Record.data),
				sensor_id: event.Record.sensor_id
			};
		});

		console.log(
			'--------------------------------------------------------------------------------------------------------------------------------------------------------------'
		);
	});
};
module.exports = { events };
