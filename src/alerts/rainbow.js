const RainbowSDK = require('rainbow-node-sdk');

class RainbowNotificator {
	constructor() {
		this.rainbowSDK = new RainbowSDK({
			rainbow: {
				host: 'official'
			},
			credentials: {
				login: process.env.RAINBOW_CREDENTIALS_LOGIN,
				password: process.env.RAINBOW_CREDENTIALS_PASSWORD
			},
			application: {
				appID: process.env.RAINBOW_CREDENTIALS_APPID,
				appSecret: process.env.RAINBOW_CREDENTIALS_SECRET
			},
			logs: {
				enableConsoleLogs: false,
				enableFileLogs: false
			},
			im: {
				sendReadReceipt: true
			}
		});

		this.rainbowSDK.events.on('rainbow_onready', () => {
			console.log('Rainbow ready');
		});

		this.rainbowSDK.start();
	}

	sendAlert(message) {
		this.rainbowSDK.im.sendMessageToBubbleJid(message, 'room_6e7e5f45f31f4caf84ccf3ac0e67d3ef@muc.openrainbow.com');
		console.log('Send message: ' + message);
	}
}

module.exports = { RainbowNotificator };
