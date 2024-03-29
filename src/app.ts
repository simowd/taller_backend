import express from 'express';

//Utils imports
import { databaseCheck } from './utils/database';
import { path as pathRoot } from 'app-root-path';
import { createFileManagmentCycle, NODE_ENV } from './utils/config';
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
import fileManagmentRouter from './controllers/FileManagmentController';
import outputRouter from './controllers/OutputController';
import editorRouter from './controllers/EditorController';
import path from 'path';

const app = express();

//Checking database status
databaseCheck();
//Create tmp directory and settings
createFileManagmentCycle();

//Configuring Middleware
app.use(cors());
app.use(morgan('combined'));
app.use(express.static(path.join(__dirname, 'build')));
app.use(express.json());

//Initialize passport
passportBuilder(passport);
app.use(passport.initialize());

//More middleware
app.use(buildTransaction);

//Serve public path for local development
if (NODE_ENV === 'dev') {
  app.use(express.static(`${pathRoot}/public/`));
}

//Setting up the controllers
app.use('/api/v1/users', userRouter);
app.use('/api/v1/login', loginRouter);
app.use('/api/v1/settings', passport.authenticate('jwt', { session: false }), settingsRouter);
app.use('/api/v1/projects', folderRouter);
app.use('/api/v1/files', fileRouter);
app.use('/api/v1/transfer', fileManagmentRouter);
app.use('/api/v1/output', outputRouter);
app.use('/api/v1/editor', editorRouter);

//Serve the frontend app
app.get('/*', function (_req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

//Adding the middleware created
app.use(unknownEndpoint);
app.use(errorLogger);

export default app;