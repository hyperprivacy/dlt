const { PubSub } = require('apollo-server');
const { RainbowNotificator } = require('./src/alerts/rainbow');

const pubsub = new PubSub();
const notificator = new RainbowNotificator();

module.exports = { pubsub, notificator };
