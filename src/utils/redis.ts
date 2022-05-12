import Redis, { RedisOptions } from 'ioredis';
import { NODE_ENV, REDIS_HOST } from './config';

//Setup Redis Settings for the hashes
const hashSettings: RedisOptions = {
  db: NODE_ENV === 'dev' ? 2 : 0,
  port: 6379,
  host: REDIS_HOST
};

//Setup Redis Settings for the streams
const streamSettings: RedisOptions = {
  db: NODE_ENV === 'dev' ? 3 : 1,
  port: 6379,
  host: REDIS_HOST
};

//Create instance for different database entry point
const hash = new Redis(hashSettings);
const stream = new Redis(streamSettings);

export { hash, stream };