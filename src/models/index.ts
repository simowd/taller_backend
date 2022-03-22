import Country from './Country';
import Gender from './Gender';
import Language from './Language';
import User from './User';

//Setting up the relationships table User has on DB
Country.hasMany(User);
Gender.hasMany(User);
Language.hasMany(User);

User.belongsTo(Country);
User.belongsTo(Gender);
User.belongsTo(Language);

//Syncing all tables
User.sync();
Country.sync();
Gender.sync();
Language.sync();

export { User, Country, Gender, Language };