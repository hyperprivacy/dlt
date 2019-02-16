const organization = (parent, args, context, info) => {
	return new Promise((resolve) => {
		resolve({ id: '1', name: 'BWM' });
	});
};

module.exports = { organization };
