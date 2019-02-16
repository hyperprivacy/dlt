var { signIn } = require('../../../network/src/lib/users/signin');

const login = (parent, args, context, info) => {
	return new Promise((resolve, reject) => {
		if (args.input) {
			signIn(process.env.ORGANIZATION, args.input.username, args.input.password, resolve, reject);
		}
	});
};

module.exports = { login };
