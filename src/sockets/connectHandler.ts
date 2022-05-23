import { Server, Socket } from 'socket.io';
import { socketLogger } from '../utils/logger';
import { hash } from '../utils/redis';
import { saveAll } from './savingData';

const connectHandler = (_io: Server, socket: Socket) => {
  //New connection logger
  const onDisconnect = async (reason: string) => {
    socketLogger(`User: ${socket.id} has disconnected. Reason: ${reason}`);
    try {
      //Get data from Redis database
      const redisHash = await hash.hgetall(`${socket.id}`);
      //Save to data
      await saveAll(redisHash, socket);
      await hash.del(`${socket.id}`);
    }
    catch (error) {
      if (error instanceof Error) {
        socketLogger(`${error.message}`);
      }
    }
  };

  socket.on('disconnect', onDisconnect);
};

export default connectHandler;