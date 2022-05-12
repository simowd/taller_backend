import { Server, Socket } from 'socket.io';
import { socketLogger } from '../utils/logger';

const connectHandler = (_io: Server, socket: Socket) => {
  //New connection logger
  const onDisconnect = (reason: string) => {
    socketLogger(`User: ${socket.id} has disconnected. Reason: ${reason}`);
  };

  socket.on('disconnect', onDisconnect);
};

export default connectHandler;