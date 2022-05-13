import { Server, Socket } from 'socket.io';
import { FileSocketBody } from '../types/file';
import { socketLogger } from '../utils/logger';
import { stream, hash } from '../utils/redis';
import { saveOne } from './savingData';

const messageHandler = (_io: Server, socket: Socket) => {
  //When code is updated all the changes happen here
  const onCodeSent = async (data: FileSocketBody) => {
    try {
      //Upload changes to the Stream data
      await stream.xadd(`${data.folder_storage}:${data.file_storage}`, '*', 'value', data.value);

      const dataBuilder: { [key: string]: any } = {};

      dataBuilder[data.file_storage] = data.value;

      //Upload data to backend
      await hash.hset(`${socket.id}`, data.file_storage, JSON.stringify(data));
    }
    catch (error) {
      if (error instanceof Error) {
        socketLogger(`${error.message}`);
      }
    }
  };

  //Save the file when the user has changed the file and requested to save
  const onCodeSave = async (data: FileSocketBody) => {
    try {
      //Send data to handler
      saveOne(data, socket);
    }
    catch (error) {
      if (error instanceof Error) {
        socketLogger(`${error.message}`);
      }
    }
  };

  socket.on('code:sent', onCodeSent);
  socket.on('code:save', onCodeSave);
};

export default messageHandler;