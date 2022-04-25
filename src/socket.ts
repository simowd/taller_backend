/* eslint-disable @typescript-eslint/no-explicit-any */
import { Server, Socket } from 'socket.io';
import http from 'http';
import { instrument } from '@socket.io/admin-ui';
import { NODE_ENV } from './utils/config';
import { validUser } from './utils/middleware';
import connectHandler from './handlers/connectHandler';
import messageHandler from './handlers/messageHandler';



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
    console.log(`User id: ${socket.data.user_id} Socket id:  ${socket.id} has connected`);
    connectHandler(io, socket);
    messageHandler(io, socket);
  };

  io.on('connection', onConnection);

};