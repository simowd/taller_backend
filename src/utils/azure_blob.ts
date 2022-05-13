import { BlobServiceClient } from '@azure/storage-blob';
import { AZURE_STORAGE_CONNECTION_STRING, NODE_ENV } from './config';

let connectionString = AZURE_STORAGE_CONNECTION_STRING;

if (NODE_ENV === 'dev' || NODE_ENV === 'test') {
  connectionString = 'DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=http://azurite:10000/devstoreaccount1;QueueEndpoint=http://azurite:10001/devstoreaccount1;';
}

//blob instance
const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);

//File uploader
export const blobFileUploader = async (containerId: string, fileId: string, content: string) => {
  const blobContainerClient = blobServiceClient.getContainerClient(containerId);

  const newBlockBlobClient = blobContainerClient.getBlockBlobClient(fileId);

  await newBlockBlobClient.upload(content, content.length, { blobHTTPHeaders: { blobContentType: 'text/x-python' } });

  return newBlockBlobClient;
};

//File Buffer Uploader
export const blobDataUploader = async (containerId: string, fileId: string, content: Buffer) => {
  const blobContainerClient = blobServiceClient.getContainerClient(containerId);

  const newBlockBlobClient = blobContainerClient.getBlockBlobClient(fileId);

  await newBlockBlobClient.uploadData(content, { blobHTTPHeaders: { blobContentType: 'text/x-python' } });

  return newBlockBlobClient;
};


//Container creator
export const blobContainerCreator = async (containerId: string) => {
  const containerClient = await blobServiceClient.getContainerClient(containerId);
  await containerClient.createIfNotExists();
  return containerClient;
};

export default blobServiceClient;