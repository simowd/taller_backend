import express from 'express';

//Utils imports
import { databaseCheck } from './utils/database';
import { path as pathRoot} from 'app-root-path';
import { NODE_ENV } from './utils/config';
import { passportBuilder } from './utils/passport';

//Middleware imports
import passport from 'passport';
import { buildTransaction, errorLogger, unknownEndpoint } from './utils/middleware';
import morgan from 'morgan';
import cors from 'cors';

//Router imports
import userRouter from './controllers/UserController';
import loginRouter from './controllers/LoginController';
import settingsRouter from './controllers/SettingsController';
import folderRouter from './controllers/FolderController';
import fileRouter from './controllers/FileController';

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

//More middleware
app.use(buildTransaction);

//Serve public path for local development
if(NODE_ENV === 'dev'){
  app.use(express.static(`${pathRoot}/public/`));
}
  
//Setting up the controllers
app.use('/api/v1/users', userRouter);
app.use('/api/v1/login', loginRouter);
app.use('/api/v1/settings', passport.authenticate('jwt', { session: false }), settingsRouter);
app.use('/api/v1/projects', folderRouter);
app.use('/api/v1/files', fileRouter);

//Adding the middleware created
app.use(unknownEndpoint);
app.use(errorLogger);

export default app;