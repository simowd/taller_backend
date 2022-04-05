import Country from './Country';
import Gender from './Gender';
import Language from './Language';
import User from './User';

//Setting up the relationships table User has on DB
Country.hasMany(User);
Gender.hasMany(User);
Language.hasMany(User);

User.belongsTo(Country, {foreignKey: 'country_id_country'});
User.belongsTo(Gender, {foreignKey: 'gender_id_gender'});
User.belongsTo(Language, {foreignKey: 'language_id_language'});

//Syncing all tables
// User.sync();
// Country.sync();
// Gender.sync();
// Language.sync();

export { User, Country, Gender, Language };