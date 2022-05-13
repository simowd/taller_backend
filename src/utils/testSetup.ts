import File from '../models/File';
import Folder from '../models/Folder';
import Output from '../models/Output';
import Setting from '../models/Setting';
import User from '../models/User';
import sequelize from './database';

const createUsers = [
  {
    name: 'Juan',
    last_name: 'Perez',
    username: 'juanito123',
    email: 'juan@gmail.com',
    password: 'juanchitowapo',
    id_country: 'BO',
    id_gender: 1,
    id_language: 'es',
  },
  {
    name: 'Ana',
    last_name: 'Gonzalez',
    username: 'ana123',
    email: 'ana@gmail.com',
    password: 'anita:O',
    id_country: 'US',
    id_language: 'en',
    id_gender: 2,
  },
];

const deleteDatabaseData = async () => {
  await Output.destroy({ where: {} });
  await File.destroy({ where: {} });
  await Folder.destroy({ where: {} });
  await Setting.destroy({ where: {} });
  await User.destroy({ where: {} });
  await sequelize.query('ALTER TABLE user AUTO_INCREMENT = 1;');
  await sequelize.query('ALTER TABLE folder AUTO_INCREMENT = 100;');
};

export { createUsers, deleteDatabaseData };