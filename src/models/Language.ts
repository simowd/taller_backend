import { Model, DataTypes } from 'sequelize';
import sequelize from '../utils/database';

class Language extends Model {}

Language.init({
  id_language: {
    type: DataTypes.STRING(5),
    primaryKey: true,
  },
  language: {
    type: DataTypes.STRING(255),
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
  modelName: 'language'
});

export default Language;