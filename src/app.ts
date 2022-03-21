import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { databaseCheck } from './utils/database';

const app = express();

databaseCheck();

//Configuring Middleware
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

app.get('/ping', (_req, res) => {
  console.log('someone pinged here :(');
  res.send('pong hola juanchis');
});

export default app;