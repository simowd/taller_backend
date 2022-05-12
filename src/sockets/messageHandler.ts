import { Server, Socket } from 'socket.io';
import { FileSocketBody } from '../types/file';

const messageHandler = (_io: Server, socket: Socket) => {
  const onCodeSent = (data: FileSocketBody) => {
    console.log(data);

  };

  socket.on('code:sent', onCodeSent);
};

export default messageHandler;