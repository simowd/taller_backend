import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { databaseCheck } from './utils/database';
import { errorLogger, unknownEndpoint } from './utils/middleware';
import { path as pathRoot} from 'app-root-path';
import userRouter from './controllers/UserController';
import { NODE_ENV } from './utils/config';
import passport from 'passport';
import { passportBuilder } from './utils/passport';
import loginRouter from './controllers/LoginController';
import settingsRouter from './controllers/SettingsController';

const app = express();

//Checking database status
databaseCheck();

//Configuring Middleware
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

//Initialize passport
passportBuilder(passport);
app.use(passport.initialize());

//Serve public path for local development
if(NODE_ENV === 'dev'){
  app.use(express.static(`${pathRoot}/public/`));
}
  
//Setting up the controllers
app.use('/api/v1/users', userRouter);
app.use('/api/v1/login', loginRouter);
app.use('/api/v1/settings', passport.authenticate('jwt', { session: false }), settingsRouter);

//Adding the middleware created
app.use(unknownEndpoint);
app.use(errorLogger);

export default app;