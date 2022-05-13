import _ from 'lodash';
import { Socket } from 'socket.io';
import File from '../models/File';
import { FileSocketBody } from '../types/file';
import { blobFileUploader } from '../utils/azure_blob';
import { socketLogger } from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';

const transactionBuilder = (socket: Socket) => {
  return {
    tr_id: uuidv4(),
    tr_date: new Date(Date.now()),
    tr_user_id: socket.data.user_id,
    tr_ip: socket.handshake.address
  };
};

const saveAll = async (redisHash: Record<string, string>, socket: Socket) => {
  try {
    //Rebuild the recieved objects
    const data: Array<FileSocketBody> = new Array<FileSocketBody>();

    console.log(socket.data);

    // Rebuild all the files saved and push it to the array
    _.forIn(redisHash, (value) => {
      data.push(JSON.parse(value));
    });

    //Iterate through the array and save the file to Azure and to Database

    for (const file of data) {
      //Uploading Blob to Azure
      await blobFileUploader(file.folder_storage, file.file_storage, file.value);

      await File.update({ ...transactionBuilder(socket) }, { where: { storage: file.file_storage } });
    }
  }
  catch (error) {
    if (error instanceof Error) {
      socketLogger(`${error.message}`);
    }
  }
};

const saveOne = async (data: FileSocketBody, socket: Socket) => {
  try {
    //Uploading Blob to Azure
    await blobFileUploader(data.folder_storage, data.file_storage, data.value);

    //Update on database
    await File.update( {...transactionBuilder(socket)}, { where: { storage: data.file_storage }});
  }
  catch (error) {
    if (error instanceof Error) {
      socketLogger(`${error.message}`);
    }
  }
};

export { saveAll, saveOne };