require('./config');

const { ApolloServer } = require('apollo-server');

const { typeDefs } = require('./src/typeDefs');
const { Query } = require('./src/resolvers/queries');
const { Mutation } = require('./src/resolvers/mutations.ts');
const { RainbowNotificator } = require('./src/alerts/rainbow');
const { PubSub } = require('apollo-server');
const { Subscription } = require('./src/resolvers/subscriptions');

const pubsub = new PubSub();

const resolvers = {
	Query: Query,
	Mutation: Mutation,
	Subscription: Subscription
};

const notificator = new RainbowNotificator(() => {
	//notificator.sendAlert('Test alert');

	const server = new ApolloServer({
		typeDefs,
		resolvers,
		cors: {
			origin: process.env.ORIGIN,
			credentials: true
		},
		subscriptions: {
			path: '/graphql'
		}
	});

	server.listen().then(({ url }) => {
		console.log(`Server ready at ${url}`);
	});
});

module.exports = { notificator, pubsub };
