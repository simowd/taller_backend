import Redis, { RedisOptions } from 'ioredis';
import { NODE_ENV, REDIS_HOST } from './config';

//Setup Redis Settings
const redisSettings: RedisOptions = {
  db: NODE_ENV === 'dev' ? 1 : 0,
  port: 6379,
  host: REDIS_HOST
};

const redis = new Redis(redisSettings);

export default redis;