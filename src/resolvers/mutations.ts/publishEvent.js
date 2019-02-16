const publishEvent = (parent, args, context, info) => {
	return new Promise((resolve) => {
		if (args && args.input) {
			console.log(args.input.data);
		}

		resolve({
			device: {
				description: 'Transporter-1333 temperature sensor.',
				mac: '123-123-123-123',
				id: '213213',
				type: 'TemperatureSensor-324',
				name: 'TP-1231'
			},
			creation: Date.now() - Math.random() * 123123,
			id: '2',
			type: 'temperature-reading-v1'
		});
	});
};

module.exports = { publishEvent };
