import { Model, DataTypes } from 'sequelize';
import sequelize from '../utils/database';

class Gender extends Model {}

Gender.init({
  id_gender: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  gender: {
    type: DataTypes.STRING(25),
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
  modelName: 'gender'
});

export default Gender;