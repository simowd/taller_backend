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
    type: DataTypes.TEXT,
    allowNull: false
  },
  last_name: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  username: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  email: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  password: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  picture: {
    type: DataTypes.TEXT,
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
    type: DataTypes.TEXT
  },
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'user'
});

export default User;