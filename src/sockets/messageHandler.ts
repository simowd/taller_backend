import { Server, Socket } from 'socket.io';
import { FileSocketBody } from '../types/file';
import { stream, hash } from '../utils/redis';

const messageHandler = (_io: Server, socket: Socket) => {
  const onCodeSent = async (data: FileSocketBody) => {
    //Upload changes to the Stream data
    await stream.xadd(`${data.folder_storage}:${data.file_storage}`, '*', 'value' , data.value);

    const dataBuilder : {[key:string]: any} = {};

    dataBuilder[data.file_storage] = data.value.toString();

    //Upload data to backend
    await hash.hset(`${socket.id}`, data.file_storage, JSON.stringify(data));

  };

  socket.on('code:sent', onCodeSent);
};

export default messageHandler;