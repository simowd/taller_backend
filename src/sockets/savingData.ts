import _ from 'lodash';
import { FileSocketBody } from '../types/file';

const saveAll = (redisHash: Record<string, string>) => {
  //Rebuild the recieved objects
  const data: Array<FileSocketBody> = new Array<FileSocketBody>();

  // Rebuild all the files saved and push it to the array
  _.forIn(redisHash, (value) => {
    data.push(JSON.parse(value));
  });

  return data;
};

export { saveAll };