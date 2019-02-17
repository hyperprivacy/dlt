const events = (parent, args, context, info) => {
	return new Promise((resolve) => {
		const device = {
			description: 'Transporter-1333 temperature sensor.',
			mac: '123-123-123-123',
			id: '213213',
			type: 'TemperatureSensor-324',
			name: 'TP-1231'
		};

		resolve([
			{
				device: device,
				creation: Date.now() - Math.random() * 123123,
				id: '2',
				name: 'temperature-reading-v1',
				type: 'regular',
				data: {
					data: '{ "hello": "world"}'
				}
			},
			{
				device: device,
				creation: Date.now() - Math.random() * 123123,
				id: '1',
				name: 'temperature-reading-v1',
				type: 'regular',
				data: {
					data: '{ "hello": "world"}'
				}
			},
			{
				device: device,
				creation: Date.now() - Math.random() * 123123,
				id: '3',
				name: 'temperature-reading-v1',
				type: 'regular',
				data: {
					data: '{ "hello": "world"}'
				}
			},
			{
				device: device,
				creation: Date.now(),
				id: '4',
				name: 'temperature-reading-v1',
				type: 'regular',
				data: {
					data: '{ "hello": "world"}'
				}
			}
		]);
	});
};

module.exports = { events };
