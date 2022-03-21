import { MYSQLDB_URI } from '../utils/config';
import { Sequelize } from 'sequelize';

console.log(`Connecting to ${MYSQLDB_URI}`);

const sequelize = new Sequelize(MYSQLDB_URI, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
});

export const databaseCheck = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    sequelize.close();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};


export default sequelize;
