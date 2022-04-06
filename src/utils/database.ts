import { MYSQLDB_URI, NODE_ENV } from '../utils/config';
import { Sequelize } from 'sequelize';

console.log(`Connecting to ${MYSQLDB_URI}`);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let loggingOption: any = false;

if(NODE_ENV === 'dev'){
  loggingOption = console.log;
}

const sequelize = new Sequelize(MYSQLDB_URI, {
  logging: loggingOption,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  define: {
    //Make all tables use the default name
    freezeTableName: true,
  }
});

export const databaseCheck = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};


export default sequelize;
