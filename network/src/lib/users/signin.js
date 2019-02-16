var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var UnauthorizedError = require('../errors/unauthorized-error');
var InternalError = require('../errors/internal-error');
var hfc = require('fabric-client');
var helper = require('../helper');

var signIn = async function(org, username, password, resolve, reject) {
	console.log('INPUTS: ', org, username, password);

	try {
		var orgAdmin = hfc.getConfigSetting('admins')[org];

		if (!orgAdmin) {
			throw new InternalError('Organisation admin is not defined!', 'IE1001');
		}

		var client = await helper.getClientForOrg(org).catch((err) => {
			throw new InternalError(
				"Organisation is not defined in network configuration! Can't get a client for organisation!",
				'IE1002',
				err.message
			);
		});

		//for identity service we need to use admin user object who has hf.Registrar attribtue
		let adminRegistrar = await client.getUserContext(orgAdmin.username, true).then((user) => {
			if (!user) {
				throw new InternalError('The selected organization has no registered/enrolled administrator!', 'IE1003');
			}

			return user;
		});
		//get certificate authority based on client configuration for organisation
		var caClient = client.getCertificateAuthority();
		//create new identity service for organisation
		var identityService = caClient.newIdentityService();

		//now we need to find user and send request to CA with registrar
		identityService
			.getOne(username, adminRegistrar)
			.then((res) => {
				//if everything is good now we need to check bcrypt hash
				return res.result;
			})
			.catch((err) => {
				return Promise.reject(new UnauthorizedError('Username does not exist in this organisation', 'UA1001'));
			})
			.then((user) => {
				var hashPassword = user.attrs.find((element) => {
					return element.name === 'password';
				});

				var email = user.attrs.find((element) => {
					return element.name === 'email';
				});

				var hash = bcrypt.compareSync(password, hashPassword.value);

				if (!hash) {
					return Promise.reject(new UnauthorizedError('Incorrect username/password combination', 'UA1002'));
				}

				var token = jwt.sign(
					{
						exp: Math.floor(Date.now() / 1000) + parseInt(hfc.getConfigSetting('jwt_expiretime')),
						usr: username,
						org: org,
						aff: user.affiliation,
						typ: user.type,
						eml: email.value
					},
					'hyperprivacy.network'
				);
				console.log({ token: token });
				resolve(token);
			})
			.catch((err) => {
				console.log(err);
				reject(err);
			});
	} catch (err) {
		console.log(err);
		reject(err);
	}
};

exports.signIn = signIn;
