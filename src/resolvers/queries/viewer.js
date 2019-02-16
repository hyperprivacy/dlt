const viewer = (parent, args, context, info) => {
	return new Promise((resolve) => {
		resolve({
			email: 'test@email',
			firstname: 'John',
			id: '1',
			lastname: 'Müller',
			username: 'sdf'
		});
	});
};

module.exports = { viewer };
