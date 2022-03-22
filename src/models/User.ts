import { Model, DataTypes } from 'sequelize';
import sequelize from '../utils/database';

class User extends Model {}

User.init({
  id_user: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  last_name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  picture: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  status: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  tr_id: {
    type: DataTypes.INTEGER
  },
  tr_date: {
    type: DataTypes.TIME
  },
  tr_user_id: {
    type: DataTypes.INTEGER
  },
  tr_ip: {
    type: DataTypes.STRING(50)
  },
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'user',
});

export default User;