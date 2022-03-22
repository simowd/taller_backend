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
