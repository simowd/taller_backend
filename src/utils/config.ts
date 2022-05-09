import 'dotenv/config';
import 'app-root-path';

const getEnvironmentVariable = (env: string): string => {
  const variable = process.env[env];
  if (variable === undefined) {
    throw new Error(`Environment variable ${env} is not defined`);
  }
  return variable;
};

const PORT: string = getEnvironmentVariable('PORT');
const MYSQLDB_URI = getEnvironmentVariable('NODE_ENV') === 'test' ? getEnvironmentVariable('TEST_MYSQL_URI') : getEnvironmentVariable('MYSQL_URI');
const NODE_ENV = getEnvironmentVariable('NODE_ENV');
const SECRET = getEnvironmentVariable('SECRET');
const AZURE_STORAGE_CONNECTION_STRING = getEnvironmentVariable('AZURE_STORAGE_CONNECTION_STRING');

export { PORT, MYSQLDB_URI, NODE_ENV, SECRET, AZURE_STORAGE_CONNECTION_STRING };