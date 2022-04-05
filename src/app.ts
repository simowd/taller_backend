import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { databaseCheck } from './utils/database';
import { errorLogger, unknownEndpoint } from './utils/middleware';

import userRouter from './controllers/UserController';

const app = express();

databaseCheck();

//Configuring Middleware
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

//Setting up the controllers
app.use('/api/v1/users', userRouter);

app.use(unknownEndpoint);
app.use(errorLogger);

export default app;