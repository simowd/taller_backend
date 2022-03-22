import Country from './Country';
import Gender from './Gender';
import Language from './Language';
import User from './User';

//Setting up the relationships table User has on DB
User.hasOne(Country);
User.hasOne(Gender);
User.hasOne(Language);

Country.belongsTo(User);
Gender.belongsTo(User);
Language.belongsTo(User);

module.exports = {
  User
};