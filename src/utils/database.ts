import { MYSQLDB_URI } from '../utils/config';
import { Sequelize } from 'sequelize';

console.log(`Connecting to ${MYSQLDB_URI}`);

const sequelize = new Sequelize(MYSQLDB_URI, {

});

export default sequelize;
