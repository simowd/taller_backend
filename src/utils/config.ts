import 'dotenv/config';
import 'app-root-path';
import fs from 'fs-extra';
import { path as pathRoot} from 'app-root-path';

const TIME = 10 * 60000;

const getEnvironmentVariable = (env: string): string => {
  const variable = process.env[env];
  if (variable === undefined) {
    throw new Error(`Environment variable ${env} is not defined`);
  }
  return variable;
};

const createFileManagmentCycle = () => {
  const tmpDir = `${pathRoot}/tmp`;
  fs.ensureDirSync(tmpDir);
  console.log(`Temporary data folder at ${tmpDir}`);

  setInterval(() => {
    fs.emptyDirSync(tmpDir);
    console.log('/tmp -- Temporary data folder emptied');
  }, TIME);
};

const PORT: string = getEnvironmentVariable('PORT');
const MYSQLDB_URI = getEnvironmentVariable('NODE_ENV') === 'test' ? getEnvironmentVariable('TEST_MYSQL_URI') : getEnvironmentVariable('MYSQL_URI');
const NODE_ENV = getEnvironmentVariable('NODE_ENV');
const SECRET = getEnvironmentVariable('SECRET');
const AZURE_STORAGE_CONNECTION_STRING = getEnvironmentVariable('AZURE_STORAGE_CONNECTION_STRING');
const REDIS_HOST = getEnvironmentVariable('REDIS_HOST');

export { PORT, MYSQLDB_URI, NODE_ENV, SECRET, AZURE_STORAGE_CONNECTION_STRING, REDIS_HOST,createFileManagmentCycle };