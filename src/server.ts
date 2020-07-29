import { ApolloServer } from 'apollo-server-express';
import { createServer } from 'http';
import { graphqlUploadExpress } from 'graphql-upload';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { connect } from 'mongoose';
import shared from './shared';

const { authChecker } = shared.authChecker;

// resolvers
import resolvers from './graphql';

const graphQlServer = async (app: any, PORT: string | number) => {
	const schema = await buildSchema({
		resolvers,
		emitSchemaFile: true,
		validate: false,
		authChecker,
	});

	// create mongoose connection
	const mongoose = await connect('mongodb://patDev:planks123@ds037508.mlab.com:37508/linkup', {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: false,
	});
	await mongoose.connection;

	const httpServer = createServer(app);
	const server = new ApolloServer({
		context: ({ req, res }) => ({ req, res }),
		uploads: false,
		schema,
		introspection: true,
		playground: true,
		subscriptions: {
			onConnect: () => console.log('Connected to websocket 😤'),
		},
	});
	server.applyMiddleware({ app, cors: true, path: '/' });
	server.installSubscriptionHandlers(httpServer);

	app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));

	httpServer.listen(PORT, () => {
		console.log(
			`🚀 Server ready and listening at http://localhost:${PORT}${server.graphqlPath}`
		);
		console.log(`🌤Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`);
	});
};
export default graphQlServer;
