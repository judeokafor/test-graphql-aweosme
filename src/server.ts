import { ApolloServer } from 'apollo-server-express';
import { graphqlUploadExpress } from 'graphql-upload';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { connect } from 'mongoose';
import shared from './shared';

const { authChecker } = shared.authChecker;

// resolvers
import resolvers from './graphql';

const graphQlServer = async (app: any) => {
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

	const server = new ApolloServer({
		context: ({ req, res }) => ({ req, res }),
		uploads: false,
		schema,
		introspection: true,
		playground: true,
	});
	app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));
	server.applyMiddleware({ app, cors: true, path: '/' });
};
export default graphQlServer;
