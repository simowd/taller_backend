/* eslint-disable @typescript-eslint/no-explicit-any */
import { Server, Socket } from 'socket.io';
import http from 'http';
import { instrument } from '@socket.io/admin-ui';
import { NODE_ENV } from './utils/config';
import connectHandler from './handlers/connectHandler';
import { validUser } from './utils/middleware';

export const socket = async (httpServer: http.Server) => {
  //New config instance
  const io = new Server(httpServer, {
    cors: {
      origin: true,
      credentials: true
    }
  });

  //socket.io Admin Config
  if (NODE_ENV === 'dev') {
    instrument(io, {
      auth: false
    });
  }

  //Add auth middleware
  io.use(validUser);

  //Create connection function
  const onConnection = (socket: Socket) => {
    console.log(`User: ${socket.id} has connected`);
    connectHandler(io, socket);
  };

  io.on('connection', onConnection);

};