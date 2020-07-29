import express, { Server, Request, Response } from 'express';
// import morgan from 'morgan';
import graphQlServer from './server';

const PORT = process.env.PORT || 5555;

// Add your subscriptions

const app: Server = express();

// set up appriopriate logger;
// app.use(morgan('dev'));

app.get('/test', (_: Request, res: Response) => {
	res.send('Success, welcome');
});
// const router = express.Router();
graphQlServer(app, PORT).catch(err => console.log(err));

export default app;
