import { BlobServiceClient } from '@azure/storage-blob';
import { AZURE_STORAGE_CONNECTION_STRING, NODE_ENV } from './config';

let connectionString = AZURE_STORAGE_CONNECTION_STRING;

if (NODE_ENV === 'dev'){
  connectionString = 'DefaultEndpointsProtocol=https;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=https://127.0.0.1:10000/devstoreaccount1;';
}

const blobServiceClient = BlobServiceClient.fromConnectionString(
  connectionString
);

export default blobServiceClient;