import _ from 'lodash';
import { Socket } from 'socket.io';
import File from '../models/File';
import { FileSocketBody } from '../types/file';
import blobServiceClient from '../utils/azure_blob';
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
      const containerClient = blobServiceClient.getContainerClient(file.folder_storage);

      const blockBlobClient = containerClient.getBlockBlobClient(file.file_storage);

      await blockBlobClient.upload(file.value, file.value.length, { blobHTTPHeaders: { blobContentType: 'text/x-python' } });

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
    const containerClient = blobServiceClient.getContainerClient(data.folder_storage);

    const blockBlobClient = containerClient.getBlockBlobClient(data.file_storage);

    await blockBlobClient.upload(data.value, data.value.length, { blobHTTPHeaders: { blobContentType: 'text/x-python' } });

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