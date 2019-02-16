const registerSensor = (parent, args, context, info) => {
	return new Promise((resolve) => {
		resolve({
			description: 'Transporter-1333 temperature sensor.',
			mac: '123-123-123-123',
			id: '213213',
			type: 'TemperatureSensor-324',
			name: 'TP-1231'
		});
	});
};

module.exports = { registerSensor };
