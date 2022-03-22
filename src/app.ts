import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { databaseCheck } from './utils/database';

import userRouter from './controllers/user';

const app = express();

databaseCheck();

//Configuring Middleware
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

//Setting up the controllers
app.use('/api/v1/users', userRouter);

export default app;