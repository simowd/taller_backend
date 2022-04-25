import { Response, Request, NextFunction } from 'express';
import { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { SECRET } from './config';
import { ExtendedError } from 'socket.io/dist/namespace';
import User from '../models/User';
//import User from '../models/User';

const errorLogger = (err: Error, _req: Request, res: Response, next: NextFunction) => {
  let errorMessage = 'Something went wrong';
  if (err instanceof Error) {
    errorMessage += ' Error: ' + err.message;
    return res.status(500).send(errorMessage);
  }

  next(err);
};

const unknownEndpoint = (_req: Request, res: Response) => {
  res.status(404).send({ error: 'Unknown Endpoint' });
};

const validUser = async (socket: Socket, next: (err?: ExtendedError | undefined) => void) => {
  const auth = socket.handshake.headers.authorization;

  if (auth && auth.toLowerCase().startsWith('bearer ')) {
    
    //Get and decode token
    const token = auth.substring(7);
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, SECRET);
    }
    catch (e: unknown) {
      if (e instanceof Error) {
        next(new Error('Invalid token'));
      }
    }

    //Verify user veracity
    if (decodedToken) {
      const id: string = decodedToken.sub as string;
      const user = await User.findByPk(id);
      if (user) {
        console.log('Ingresa');
        next();
      }
    }
  }
  else {
    next(new Error('No authorization token provided'));
  }
};

export { errorLogger, unknownEndpoint, validUser };