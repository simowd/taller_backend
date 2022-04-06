import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import sequelize from '../utils/database';

class User extends Model <InferAttributes<User>, InferCreationAttributes<User>> {

  declare id_user: CreationOptional<number>;
  declare name: string | null;
  declare last_name: string | null;
  declare username: string;
  declare email: string;
  declare password: string;
  declare picture:  string | null;
  declare status: number;
  declare tr_id: number | null;
  declare tr_date: Date | null;
  declare tr_user_id: number | null;
  declare tr_ip: string | null;

}

User.init({
  id_user: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  last_name: {
    type: DataTypes.STRING(50),
    allowNull: true
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
    allowNull: true
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