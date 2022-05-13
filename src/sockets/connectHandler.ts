import { Server, Socket } from 'socket.io';
import { socketLogger } from '../utils/logger';
import { hash } from '../utils/redis';
import { saveAll } from './savingData';

const connectHandler = (_io: Server, socket: Socket) => {
  //New connection logger
  const onDisconnect = async (reason: string) => {
    socketLogger(`User: ${socket.id} has disconnected. Reason: ${reason}`);

    const redisHash = await hash.hgetall(`${socket.id}`);

    console.log(saveAll(redisHash));

  };

  socket.on('disconnect', onDisconnect);
};

export default connectHandler;