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

export { PORT, MYSQLDB_URI };