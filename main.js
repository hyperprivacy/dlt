require('./config');
require('./static');

const { ApolloServer } = require('apollo-server');

const { typeDefs } = require('./src/typeDefs');
const { Query } = require('./src/resolvers/queries');
const { Mutation } = require('./src/resolvers/mutations.ts');
const { Event } = require('./src/resolvers/types/event');
const { Subscription } = require('./src/resolvers/subscriptions');

const resolvers = {
	Query: Query,
	Mutation: Mutation,
	Subscription: Subscription,
	Event: Event
};

const server = new ApolloServer({
	typeDefs,
	resolvers,
	cors: {
		origin: process.env.ORIGIN,
		credentials: true
	},
	subscriptions: {
		path: '/graphql'
	},
	context: ({ session }) => {
		return { session };
	}
});

server.listen().then(({ url }) => {
	console.log(`Server ready at ${url}`);
});
