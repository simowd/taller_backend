import { Server, Socket } from 'socket.io';

const connectHandler = (_io: Server, socket: Socket) => {
  //New connection logger
  const onDisconnect = (reason: string) => {
    console.log(`User: ${socket.id} has disconnected. Reason: ${reason}`);
  };

  socket.on('disconnect', onDisconnect);
};

export default connectHandler;