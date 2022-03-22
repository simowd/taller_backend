import { Model, DataTypes } from 'sequelize';
import sequelize from '../utils/database';

class Country extends Model {}

Country.init({
  id_country: {
    type: DataTypes.STRING(5),
    primaryKey: true,
  },
  country: {
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
  modelName: 'country'
});

export default Country;