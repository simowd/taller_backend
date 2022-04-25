import { Server, Socket } from 'socket.io';

const messageHandler = (_io: Server, socket: Socket) => {
  const onCodeSent = (data: object) => {
    console.log(socket.id, data);
  };

  socket.on('code:sent', onCodeSent);
};

export default messageHandler;